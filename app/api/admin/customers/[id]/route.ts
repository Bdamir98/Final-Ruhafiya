import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/database/supabase-server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data: customer, error } = await supabaseServer
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

    return NextResponse.json(customer);
  } catch (e) {
    console.error('Failed to fetch customer:', e);
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updates = await req.json();
    const { data, error } = await supabaseServer
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    console.error('Failed to update customer:', e);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error } = await supabaseServer
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error('Failed to delete customer:', e);
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
}
