import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase-server';

const PutSchema = z.object({
  content: z.record(z.any()), // arbitrary JSON
});

export async function GET() {
  try {

    // First, let's see all records in the table
    const { data: allRecords, error: allError } = await supabaseServer
      .from('website_content')
      .select('*')
      .order('updated_at', { ascending: false });

    if (allError) {
    }

    // Then get the latest record as before
    const { data, error } = await supabaseServer
      .from('website_content')
      .select('id, value, updated_at')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    const content = data?.value || {};

    return NextResponse.json({ content, id: data?.id ?? null, updated_at: data?.updated_at ?? null });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch website content' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const { content } = PutSchema.parse(body);

    // Check if a record already exists
    const { data: existingData, error: fetchError } = await supabaseServer
      .from('website_content')
      .select('id')
      .eq('section', 'site')
      .eq('key', 'content')
      .eq('lang', 'bn')
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    let result;
    if (existingData) {
      // Update existing record
      const { data, error } = await supabaseServer
        .from('website_content')
        .update({
          value: content,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData.id)
        .select('id, value, updated_at')
        .single();

      if (error) {
        throw error;
      }
      result = data;
    } else {
      // Insert new record
      const { data, error } = await supabaseServer
        .from('website_content')
        .insert({
          section: 'site',
          key: 'content',
          lang: 'bn',
          type: 'json',
          value: content
        })
        .select('id, value, updated_at')
        .single();

      if (error) {
        throw error;
      }
      result = data;
    }

    return NextResponse.json({ content: result.value, id: result.id, updated_at: result.updated_at });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update website content' }, { status: 500 });
  }
}
