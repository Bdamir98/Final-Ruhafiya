import { NextRequest, NextResponse } from 'next/server';

const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

/**
 * Send conversion event to Facebook Conversion API
 */
async function sendConversionEvent(eventName: string, eventData: any, userData: any) {
  if (!FB_ACCESS_TOKEN || !FB_PIXEL_ID) {
    console.warn('Facebook Conversion API: Missing FB_ACCESS_TOKEN or FB_PIXEL_ID');
    return { success: false, error: 'Missing configuration' };
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${FB_PIXEL_ID}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [{
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_source_url: eventData.url || '',
          user_data: {
            client_ip_address: userData.ip || '',
            client_user_agent: userData.userAgent || '',
            fbc: userData.fbc || '',
            fbp: userData.fbp || ''
          },
          custom_data: eventData.custom_data || {}
        }],
        access_token: FB_ACCESS_TOKEN
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Facebook Conversion API Error:', result);
      return { success: false, error: result };
    }

    console.log('Facebook Conversion API Success:', eventName, result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Facebook Conversion API Request Failed:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Extract user data from request
 */
function extractUserData(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             '127.0.0.1';

  const userAgent = request.headers.get('user-agent') || '';

  // Extract Facebook cookies if available
  const fbc = request.cookies.get('_fbc')?.value || '';
  const fbp = request.cookies.get('fbp')?.value || '';

  return {
    ip,
    userAgent,
    fbc,
    fbp
  };
}

export { sendConversionEvent, extractUserData };
