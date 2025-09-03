import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('id', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ products: data });
  } catch (e) {
    console.error('Products fetch error:', e);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
