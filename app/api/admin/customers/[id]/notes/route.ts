import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data: notes, error } = await supabaseServer
      .from('customer_notes')
      .select('*')
      .eq('customer_id', id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ notes });
  } catch (e) {
    console.error('Failed to fetch customer notes:', e);
    return NextResponse.json(
      { error: 'Failed to fetch customer notes' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { content, created_by } = await req.json();
    const { data: note, error } = await supabaseServer
      .from('customer_notes')
      .insert([
        {
          customer_id: id,
          content,
          created_by,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(note, { status: 201 });
  } catch (e) {
    console.error('Failed to create customer note:', e);
    return NextResponse.json(
      { error: 'Failed to create customer note' },
      { status: 500 }
    );
  }
}
