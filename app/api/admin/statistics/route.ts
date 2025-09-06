import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/database/supabase-server';

export async function GET(req: NextRequest) {
  try {
    // Get total orders count
    const { count: totalOrders, error: ordersError } = await supabaseServer
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (ordersError) throw ordersError;

    // Get total revenue and pending orders
    const { data: ordersData, error: ordersDataError } = await supabaseServer
      .from('orders')
      .select('total_amount, status');

    if (ordersDataError) throw ordersDataError;

    // Calculate statistics
    const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
    const pendingOrders = ordersData?.filter(order => order.status === 'pending').length || 0;

    // Get unique customers count
    const { count: totalCustomers, error: customersError } = await supabaseServer
      .from('customers')
      .select('*', { count: 'exact', head: true });

    if (customersError) throw customersError;

    return NextResponse.json({
      totalOrders: totalOrders || 0,
      totalRevenue,
      pendingOrders,
      totalCustomers: totalCustomers || 0
    });
  } catch (error) {
    console.error('Failed to fetch statistics:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}