import { NextRequest, NextResponse } from 'next/server';
import { sendConversionEvent, extractUserData } from '@/lib/facebook-conversion-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventData = {} } = body;

    const userData = extractUserData(request);

    // Send Lead event to Facebook Conversion API
    const result = await sendConversionEvent('Lead', {
      url: request.headers.get('referer') || '',
      custom_data: {
        content_name: eventData.content_name || 'Order Form',
        content_category: eventData.content_category || 'Order',
        ...eventData.custom_data
      }
    }, userData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Lead event sent successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Lead API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
