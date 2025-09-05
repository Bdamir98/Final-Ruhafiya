import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    let query = supabaseServer
      .from('fraud_blacklist')
      .select('*')
      .order('created_at', { ascending: false });

    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    if (search) {
      query = query.or(`value.ilike.%${search}%,reason.ilike.%${search}%`);
    }

    const { data: entities, error } = await query;

    if (error) {
      console.error('Error fetching blocked entities:', error);
      return NextResponse.json({ error: 'Failed to fetch blocked entities' }, { status: 500 });
    }

    return NextResponse.json({ entities: entities || [] });
  } catch (error) {
    console.error('Error in blocked entities GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, type, value, reason, notes, id } = body;

    if (action === 'block') {
      // Add new blocked entity
      const { error } = await supabaseServer
        .from('fraud_blacklist')
        .insert({
          type,
          value: value.toLowerCase().trim(),
          reason,
          notes,
          blocked_by: 'admin', // In real app, get from session
          auto_blocked: false
        });

      if (error) {
        console.error('Error blocking entity:', error);
        return NextResponse.json({ error: 'Failed to block entity' }, { status: 500 });
      }

      // Log the action
      await supabaseServer
        .from('fraud_audit_log')
        .insert({
          action: 'manual_block',
          entity_type: type,
          entity_value: value,
          admin_user: 'admin',
          details: { reason, notes }
        });

      return NextResponse.json({ success: true });

    } else if (action === 'unblock') {
      // Get current entity data
      const { data: entity } = await supabaseServer
        .from('fraud_blacklist')
        .select('*')
        .eq('id', id)
        .single();

      if (!entity) {
        return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
      }

      // Record unblock history
      await supabaseServer
        .from('fraud_unblock_history')
        .insert({
          entity_type: entity.type,
          entity_value: entity.value,
          original_reason: entity.reason,
          unblock_reason: reason,
          notes,
          unblocked_by: 'admin' // In real app, get from session
        });

      // Update unblock count and last unblocked date
      await supabaseServer
        .from('fraud_blacklist')
        .update({
          unblock_count: (entity.unblock_count || 0) + 1,
          last_unblocked_at: new Date().toISOString()
        })
        .eq('id', id);

      // Remove from blacklist (or mark as inactive)
      await supabaseServer
        .from('fraud_blacklist')
        .delete()
        .eq('id', id);

      // Add to whitelist temporarily (24 hours)
      await supabaseServer
        .from('fraud_whitelist')
        .insert({
          type: entity.type,
          value: entity.value,
          reason: `Unblocked: ${reason}`,
          notes: `Previously blocked for: ${entity.reason}. ${notes || ''}`,
          added_by: 'admin',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        });

      // Log the action
      await supabaseServer
        .from('fraud_audit_log')
        .insert({
          action: 'manual_unblock',
          entity_type: entity.type,
          entity_value: entity.value,
          admin_user: 'admin',
          details: { reason, notes, original_reason: entity.reason }
        });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in blocked entities POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    // Get entity data for logging
    const { data: entity } = await supabaseServer
      .from('fraud_blacklist')
      .select('*')
      .eq('id', id)
      .single();

    if (!entity) {
      return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
    }

    // Delete the entity
    const { error } = await supabaseServer
      .from('fraud_blacklist')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting entity:', error);
      return NextResponse.json({ error: 'Failed to delete entity' }, { status: 500 });
    }

    // Log the action
    await supabaseServer
      .from('fraud_audit_log')
      .insert({
        action: 'delete_blocked_entity',
        entity_type: entity.type,
        entity_value: entity.value,
        admin_user: 'admin',
        details: { original_reason: entity.reason }
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in blocked entities DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
