import { NextRequest, NextResponse } from 'next/server';
import { sendConversionEvent, extractUserData } from '@/lib/facebook-conversion-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      value,
      currency = 'BDT',
      orderId,
      productName,
      quantity = 1,
      eventData = {}
    } = body;

    const userData = extractUserData(request);

    // Send Purchase event to Facebook Conversion API
    const result = await sendConversionEvent('Purchase', {
      url: request.headers.get('referer') || '',
      custom_data: {
        value: parseFloat(value),
        currency: currency,
        content_name: productName || 'Order',
        content_category: 'Order',
        order_id: orderId,
        quantity: quantity,
        ...eventData.custom_data
      }
    }, userData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Purchase event sent successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Purchase API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
