import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function PATCH(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'Invalid product id' }, { status: 400 });
  }

  const { data: existing, error: fetchErr } = await supabaseServer
    .from('products')
    .select('id, is_active')
    .eq('id', id)
    .single();

  if (fetchErr || !existing) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const nextActive = !existing.is_active;

  const { data, error } = await supabaseServer
    .from('products')
    .update({ is_active: nextActive, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to toggle product' }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}
