import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/database/supabase-server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data: addresses, error } = await supabaseServer
      .from('customer_addresses')
      .select('*')
      .eq('customer_id', id)
      .order('is_default', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ addresses });
  } catch (e) {
    console.error('Failed to fetch customer addresses:', e);
    return NextResponse.json(
      { error: 'Failed to fetch customer addresses' },
      { status: 500 }
    );
  }
}
