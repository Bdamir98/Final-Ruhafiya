import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase-server';

const CreateSchema = z.object({
  type: z.string().min(1),
  title: z.string().min(1),
  message: z.string().optional().default(''),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();
    const page = Math.max(1, Number(searchParams.get('page') || '1'));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || '10')));

    let query = supabaseServer
      .from('notifications')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (q) {
      query = query.or(`type.ilike.%${q}%,title.ilike.%${q}%,message.ilike.%${q}%`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error, count } = await query.range(from, to);
    if (error) throw error;

    console.log('Notifications fetched:', data?.length || 0); // Debug log

    return NextResponse.json({ notifications: data ?? [], total: count ?? 0, page, pageSize });
  } catch (e) {
    console.error('Error fetching notifications:', e);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateSchema.parse(body);

    const { data, error } = await supabaseServer
      .from('notifications')
      .insert({ type: parsed.type, title: parsed.title, message: parsed.message })
      .select('*')
      .single();

    if (error) throw error;
    console.log('Notification created:', data); // Debug log
    return NextResponse.json({ notification: data });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    console.error('Error creating notification:', e);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}
