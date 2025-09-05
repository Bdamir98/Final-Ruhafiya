import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get('timeframe') || '24h';
    const status = searchParams.get('status') || 'all';

    // Calculate time range
    const now = new Date();
    let startTime = new Date();
    switch (timeframe) {
      case '1h':
        startTime.setHours(now.getHours() - 1);
        break;
      case '24h':
        startTime.setDate(now.getDate() - 1);
        break;
      case '7d':
        startTime.setDate(now.getDate() - 7);
        break;
      case '30d':
        startTime.setDate(now.getDate() - 30);
        break;
    }

    // Get suspicious orders with fraud scores
    let query = supabaseServer
      .from('orders')
      .select(`
        *,
        fraud_score,
        fraud_reasons,
        is_flagged,
        ip_address,
        user_agent,
        device_fingerprint
      `)
      .gte('created_at', startTime.toISOString())
      .order('created_at', { ascending: false });

    if (status === 'flagged') {
      query = query.eq('is_flagged', true);
    } else if (status === 'high_risk') {
      query = query.gte('fraud_score', 70);
    }

    const { data: orders, error } = await query;
    if (error) throw error;

    // Get fraud statistics
    const { data: stats } = await supabaseServer
      .from('orders')
      .select('fraud_score, is_flagged, status')
      .gte('created_at', startTime.toISOString());

    const totalOrders = stats?.length || 0;
    const flaggedOrders = stats?.filter(o => o.is_flagged).length || 0;
    const highRiskOrders = stats?.filter(o => (o.fraud_score || 0) >= 70).length || 0;
    const blockedOrders = stats?.filter(o => o.status === 'blocked').length || 0;

    // Get recent fraud patterns
    const { data: patterns } = await supabaseServer
      .from('fraud_patterns')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      orders: orders || [],
      statistics: {
        total: totalOrders,
        flagged: flaggedOrders,
        highRisk: highRiskOrders,
        blocked: blockedOrders,
        fraudRate: totalOrders > 0 ? ((flaggedOrders / totalOrders) * 100).toFixed(2) : '0'
      },
      patterns: patterns || []
    });
  } catch (error) {
    console.error('Failed to fetch fake orders data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, orderId, reason } = await req.json();

    switch (action) {
      case 'flag':
        await supabaseServer
          .from('orders')
          .update({ 
            is_flagged: true, 
            fraud_reasons: reason,
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId);
        break;

      case 'unflag':
        await supabaseServer
          .from('orders')
          .update({ 
            is_flagged: false, 
            fraud_reasons: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId);
        break;

      case 'block':
        await supabaseServer
          .from('orders')
          .update({ 
            status: 'blocked', 
            is_flagged: true,
            fraud_reasons: reason,
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId);
        break;

      case 'whitelist':
        const { data: order } = await supabaseServer
          .from('orders')
          .select('mobile_number, ip_address')
          .eq('id', orderId)
          .single();

        if (order) {
          await supabaseServer
            .from('fraud_whitelist')
            .insert({
              mobile_number: order.mobile_number,
              ip_address: order.ip_address,
              reason: 'Manual whitelist',
              created_at: new Date().toISOString()
            });
        }
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
