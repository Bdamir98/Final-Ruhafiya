import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/database/supabase-server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();
    const page = Math.max(1, Number(searchParams.get('page') || '1'));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || '10')));

    let query = supabaseServer
      .from('customers')
      .select('*', { count: 'exact' })
      .order('last_order_date', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (q) {
      query = query.or(`full_name.ilike.%${q}%,mobile_number.ilike.%${q}%,full_address.ilike.%${q}%`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error, count } = await query.range(from, to);

    if (error) throw error;
    return NextResponse.json({
      customers: data ?? [],
      total: count ?? 0,
      page,
      pageSize
    });
  } catch (e) {
    console.error('Failed to fetch customers:', e);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
