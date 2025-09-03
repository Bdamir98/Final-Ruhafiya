import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase-server';
import { createProductNotification } from '@/lib/notifications';

const ProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().default(''),
  price: z.number().nonnegative(),
  shipping_charge: z.number().nonnegative().default(0),
  is_active: z.boolean().default(true),
  stock_quantity: z.number().int().nonnegative().default(0),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();
    const page = Math.max(1, Number(searchParams.get('page') || '1'));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || '10')));
    const active = searchParams.get('active'); // 'true' | 'false' | null

    let query = supabaseServer
      .from('products')
      .select('*', { count: 'exact' })
      .order('id', { ascending: true });

    if (q) {
      // search by name or description
      query = query.ilike('name', `%${q}%`);
    }
    if (active === 'true') query = query.eq('is_active', true);
    if (active === 'false') query = query.eq('is_active', false);

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error, count } = await query.range(from, to);
    if (error) throw error;
    return NextResponse.json({ products: data ?? [], total: count ?? 0, page, pageSize });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ProductSchema.parse(body);

    const { data, error } = await supabaseServer
      .from('products')
      .insert({
        name: parsed.name,
        description: parsed.description,
        price: parsed.price,
        shipping_charge: parsed.shipping_charge,
        is_active: parsed.is_active,
        stock_quantity: parsed.stock_quantity,
      })
      .select('*')
      .single();

    if (error) throw error;

    // Create notification
    await createProductNotification('created', data);

    return NextResponse.json({ product: data });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    console.error('Product creation failed:', e);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
