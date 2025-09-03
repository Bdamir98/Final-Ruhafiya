import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

type OrderRow = {
  id: number;
  order_number: string;
  full_name: string;
  mobile_number: string;
  full_address: string;
  product_id: number;
  quantity: number;
  unit_price: number;
  shipping_charge: number;
  total_amount: number;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type ProductRow = { id: number; name: string };

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();
    const status = searchParams.get('status')?.trim();
    const page = Math.max(1, Number(searchParams.get('page') || '1'));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || '10')));

    let query = supabaseServer
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (q) {
      // match order number, name or mobile
      query = query.or(
        `order_number.ilike.%${q}%,full_name.ilike.%${q}%,mobile_number.ilike.%${q}%`
      );
    }
    if (status) {
      query = query.eq('status', status);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data: orders, error: ordersError, count } = await query.range(from, to);

    if (ordersError) throw ordersError;

    if (!orders || orders.length === 0) {
      return NextResponse.json({ orders: [], total: 0, page, pageSize });
    }

    // Fetch products for mapping product_name
    const productIds = Array.from(new Set((orders as OrderRow[]).map((o: OrderRow) => o.product_id)));
    const { data: products, error: productsError } = await supabaseServer
      .from('products')
      .select('id, name')
      .in('id', productIds);

    if (productsError) throw productsError;

    const nameById = new Map((products as ProductRow[] | null)?.map((p: ProductRow) => [p.id, p.name] as const));

    const result = (orders as OrderRow[]).map((o: OrderRow) => ({
      ...o,
      product_name: nameById.get(o.product_id) ?? '',
    }));

    return NextResponse.json({ orders: result, total: count ?? result.length, page, pageSize });
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
