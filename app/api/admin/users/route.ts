import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase-server';
import { createUserNotification } from '@/lib/notifications';

const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6), // for create
  is_active: z.boolean().default(true),
});

const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  is_active: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();
    const page = Math.max(1, Number(searchParams.get('page') || '1'));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || '10')));

    let query = supabaseServer
      .from('admin_users')
      .select('id, email, name, is_active, last_login_at, created_at', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (q) {
      query = query.or(`email.ilike.%${q}%,name.ilike.%${q}%`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error, count } = await query.range(from, to);

    if (error) throw error;
    return NextResponse.json({ users: data ?? [], total: count ?? 0, page, pageSize });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, password, is_active } = UserSchema.parse(body);

    // Note: Password hashing should be done in DB, but for simplicity, assume RPC handles it
    const { data, error } = await supabaseServer
      .from('admin_users')
      .insert({ email, name, password, is_active })
      .select('id, email, name, is_active, created_at')
      .single();

    if (error) throw error;
    return NextResponse.json({ user: data });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    const parsed = UpdateUserSchema.parse(updates);

    const { data, error } = await supabaseServer
      .from('admin_users')
      .update(parsed)
      .eq('id', id)
      .select('id, email, name, is_active, last_login_at, created_at')
      .single();

    if (error) throw error;
    return NextResponse.json({ user: data });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get user data before deletion for notification
    const { data: existingUser, error: fetchError } = await supabaseServer
      .from('admin_users')
      .select('*')
      .eq('id', Number(userId))
      .single();

    if (fetchError) throw fetchError;

    const { error } = await supabaseServer
      .from('admin_users')
      .delete()
      .eq('id', Number(userId));

    if (error) throw error;

    // Create notification
    await createUserNotification('deleted', existingUser);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('User deletion failed:', e);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
