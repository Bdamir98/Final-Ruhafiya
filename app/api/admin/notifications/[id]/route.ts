import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

// GET - Get single notification
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabaseServer
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error('Error fetching notification:', e);
    return NextResponse.json({ error: 'Failed to fetch notification' }, { status: 500 });
  }
}

// PATCH - Update notification (mark read/unread)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updateData = await req.json();

    const { data, error } = await supabaseServer
      .from('notifications')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', parseInt(id))
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error('Error updating notification:', e);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

// DELETE - Delete single notification
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabaseServer
      .from('notifications')
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;

    return NextResponse.json({ message: 'Notification deleted successfully' });
  } catch (e) {
    console.error('Error deleting notification:', e);
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}