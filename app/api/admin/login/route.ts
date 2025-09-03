import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase-server';
// Password verification is done in Postgres using pgcrypto's crypt() via RPC

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    // Basic env guard to avoid opaque 500s
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase env missing');
      return NextResponse.json(
        { error: 'Server not configured: Supabase environment is missing' },
        { status: 500 }
      );
    }

    const { email, password } = LoginSchema.parse(await req.json());

    // Delegate password verification to Postgres function (uses crypt())
    const { data: rpcRows, error } = await supabaseServer
      .rpc('admin_login', { p_email: email, p_password: password });

    if (error) {
      console.error('Supabase RPC error (admin_login)');
      return NextResponse.json({ error: 'Authentication query failed' }, { status: 500 });
    }

    const adminRow = Array.isArray(rpcRows) && rpcRows.length > 0 ? rpcRows[0] : null;
    if (!adminRow) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const { error: updateErr } = await supabaseServer
      .from('admin_users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', adminRow.id);

    if (updateErr) {
      console.warn('Failed to update last_login_at');
      // Do not fail login if audit update fails
    }

    return NextResponse.json({
      success: true,
      admin: { id: adminRow.id, email: adminRow.email, name: adminRow.name },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    console.error('Admin login error');
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
