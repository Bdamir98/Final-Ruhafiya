import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/database/supabase-server';
import { createProductNotification } from '@/lib/utils/notifications';

const ProductUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().optional(),
  shipping_charge: z.number().nonnegative().optional(),
  is_active: z.boolean().optional(),
  image_url: z.string().url().optional(),
  stock_quantity: z.number().int().nonnegative().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: 'Invalid product id' }, { status: 400 });
    }

    const body = await req.json();
    const update = ProductUpdateSchema.parse(body);
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from('products')
      .update({ ...update, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;

    // Create notification
    await createProductNotification('updated', data);

    return NextResponse.json({ product: data });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: 'Invalid product id' }, { status: 400 });
    }

    // Get product data before deletion for notification
    const { data: existingProduct, error: fetchError } = await supabaseServer
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const { error } = await supabaseServer
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Create notification
    await createProductNotification('deleted', existingProduct);

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
