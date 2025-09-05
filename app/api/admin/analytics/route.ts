import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const period = searchParams.get('period') || '30'; // days
    const metric = searchParams.get('metric') || 'all';

    // Calculate date range
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);

    const startISOString = start.toISOString();
    const endISOString = end.toISOString();

    let analytics: any = {};

    if (metric === 'all' || metric === 'overview') {
      // Overview metrics
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startISOString)
        .lte('created_at', endISOString);

      const { data: allOrders } = await supabase
        .from('orders')
        .select('*');

      const { data: products } = await supabase
        .from('products')
        .select('*');

      const { data: customers } = await supabase
        .from('customers')
        .select('*');

      const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const totalOrders = orders?.length || 0;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Previous period comparison
      const prevStart = new Date(start.getTime() - (end.getTime() - start.getTime()));
      const { data: prevOrders } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', prevStart.toISOString())
        .lt('created_at', startISOString);

      const prevRevenue = prevOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const prevOrderCount = prevOrders?.length || 0;

      analytics.overview = {
        totalRevenue,
        totalOrders,
        avgOrderValue,
        totalProducts: products?.length || 0,
        totalCustomers: customers?.length || 0,
        revenueGrowth: prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0,
        orderGrowth: prevOrderCount > 0 ? ((totalOrders - prevOrderCount) / prevOrderCount) * 100 : 0,
        conversionRate: (customers?.length || 0) > 0 ? (totalOrders / (customers?.length || 1)) * 100 : 0
      };
    }

    if (metric === 'all' || metric === 'trends') {
      // Daily trends
      const { data: dailyData } = await supabase
        .from('orders')
        .select('created_at, total_amount, status')
        .gte('created_at', startISOString)
        .lte('created_at', endISOString)
        .order('created_at');

      const dailyTrends = dailyData?.reduce((acc: any, order) => {
        const date = new Date(order.created_at).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, orders: 0, revenue: 0, pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 };
        }
        acc[date].orders += 1;
        acc[date].revenue += order.total_amount || 0;
        acc[date][order.status] = (acc[date][order.status] || 0) + 1;
        return acc;
      }, {});

      analytics.trends = Object.values(dailyTrends || {});
    }

    if (metric === 'all' || metric === 'products') {
      // Product performance
      const { data: productOrders } = await supabase
        .from('orders')
        .select('product_id, product_name, quantity, total_amount, created_at')
        .gte('created_at', startISOString)
        .lte('created_at', endISOString);

      const productPerformance = productOrders?.reduce((acc: any, order) => {
        const key = order.product_name || `Product ${order.product_id}`;
        if (!acc[key]) {
          acc[key] = { 
            name: key, 
            orders: 0, 
            quantity: 0, 
            revenue: 0,
            avgOrderValue: 0
          };
        }
        acc[key].orders += 1;
        acc[key].quantity += order.quantity || 0;
        acc[key].revenue += order.total_amount || 0;
        acc[key].avgOrderValue = acc[key].revenue / acc[key].orders;
        return acc;
      }, {});

      analytics.products = Object.values(productPerformance || {})
        .sort((a: any, b: any) => b.revenue - a.revenue);
    }

    if (metric === 'all' || metric === 'customers') {
      // Customer analytics
      const { data: customerData } = await supabase
        .from('customers')
        .select(`
          *,
          orders!inner(created_at, total_amount, status)
        `)
        .gte('orders.created_at', startISOString)
        .lte('orders.created_at', endISOString);

      const customerAnalytics = customerData?.map(customer => ({
        id: customer.id,
        name: customer.full_name,
        totalOrders: customer.orders?.length || 0,
        totalSpent: customer.orders?.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0) || 0,
        avgOrderValue: customer.orders?.length > 0 ? 
          (customer.orders.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0) / customer.orders.length) : 0,
        lastOrderDate: customer.orders?.length > 0 ? 
          Math.max(...customer.orders.map((order: any) => new Date(order.created_at).getTime())) : null
      })).sort((a, b) => b.totalSpent - a.totalSpent);

      analytics.customers = customerAnalytics?.slice(0, 10); // Top 10 customers
    }

    if (metric === 'all' || metric === 'geography') {
      // Geographic distribution (based on addresses)
      const { data: geoData } = await supabase
        .from('orders')
        .select('full_address, total_amount')
        .gte('created_at', startISOString)
        .lte('created_at', endISOString);

      const cityDistribution = geoData?.reduce((acc: any, order) => {
        // Extract city from address (basic implementation)
        const address = order.full_address || '';
        const parts = address.split(',');
        const city = parts[parts.length - 2]?.trim() || 'Unknown';
        
        if (!acc[city]) {
          acc[city] = { city, orders: 0, revenue: 0 };
        }
        acc[city].orders += 1;
        acc[city].revenue += order.total_amount || 0;
        return acc;
      }, {});

      analytics.geography = Object.values(cityDistribution || {})
        .sort((a: any, b: any) => b.revenue - a.revenue)
        .slice(0, 10);
    }

    if (metric === 'all' || metric === 'performance') {
      // Performance metrics
      const { data: performanceData } = await supabase
        .from('orders')
        .select('created_at, status, total_amount')
        .gte('created_at', startISOString)
        .lte('created_at', endISOString);

      const statusDistribution = performanceData?.reduce((acc: any, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      // Calculate fulfillment time (mock data for now)
      const avgFulfillmentTime = 2.5; // days
      const orderFulfillmentRate = statusDistribution?.delivered ? 
        (statusDistribution.delivered / (performanceData?.length || 1)) * 100 : 0;

      analytics.performance = {
        statusDistribution,
        avgFulfillmentTime,
        orderFulfillmentRate,
        returnRate: 2.1, // Mock data
        customerSatisfaction: 4.6 // Mock data
      };
    }

    return NextResponse.json({ 
      success: true, 
      analytics,
      period: { start: startISOString, end: endISOString }
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
