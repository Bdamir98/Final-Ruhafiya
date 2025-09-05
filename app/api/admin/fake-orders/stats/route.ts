import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get('timeframe') || '24';
    const hours = parseInt(timeframe);

    // Get fraud statistics using the database function
    const { data: stats, error } = await supabaseServer
      .rpc('get_fraud_statistics', { timeframe_hours: hours });

    if (error) throw error;

    const statistics = stats?.[0] || {
      total_orders: 0,
      flagged_orders: 0,
      high_risk_orders: 0,
      blocked_orders: 0,
      fraud_rate: 0
    };

    // Get recent fraud patterns
    const { data: patterns } = await supabaseServer
      .from('fraud_patterns')
      .select('*')
      .eq('is_active', true)
      .order('detection_count', { ascending: false })
      .limit(10);

    // Get top risk factors
    const { data: riskFactors } = await supabaseServer
      .from('orders')
      .select('fraud_reasons')
      .not('fraud_reasons', 'is', null)
      .gte('created_at', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString());

    // Parse and count risk factors
    const reasonCounts: Record<string, number> = {};
    riskFactors?.forEach(order => {
      if (order.fraud_reasons) {
        const reasons = order.fraud_reasons.split(', ');
        reasons.forEach((reason: string) => {
          reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
        });
      }
    });

    const topRiskFactors = Object.entries(reasonCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([reason, count]: [string, number]) => ({ reason, count }));

    // Get hourly fraud trend for the last 24 hours
    const { data: hourlyData } = await supabaseServer
      .from('orders')
      .select('created_at, fraud_score, is_flagged')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true });

    // Group by hour
    const hourlyTrend = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date(Date.now() - (23 - i) * 60 * 60 * 1000);
      hour.setMinutes(0, 0, 0);
      
      const hourOrders = hourlyData?.filter(order => {
        const orderHour = new Date(order.created_at);
        orderHour.setMinutes(0, 0, 0);
        return orderHour.getTime() === hour.getTime();
      }) || [];

      return {
        hour: hour.getHours(),
        total: hourOrders.length,
        flagged: hourOrders.filter(o => o.is_flagged).length,
        avgScore: hourOrders.length > 0 
          ? Math.round(hourOrders.reduce((sum, o) => sum + (o.fraud_score || 0), 0) / hourOrders.length)
          : 0
      };
    });

    return NextResponse.json({
      statistics: {
        total: Number(statistics.total_orders),
        flagged: Number(statistics.flagged_orders),
        highRisk: Number(statistics.high_risk_orders),
        blocked: Number(statistics.blocked_orders),
        fraudRate: Number(statistics.fraud_rate).toFixed(2)
      },
      patterns: patterns || [],
      topRiskFactors,
      hourlyTrend
    });
  } catch (error) {
    console.error('Failed to fetch fraud statistics:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
