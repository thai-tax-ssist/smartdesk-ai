import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireSuperAdmin } from '@/lib/admin/auth';

interface Params { params: Promise<{ id: string }> }

export async function GET(_: NextRequest, { params }: Params) {
  try {
    await requireSuperAdmin();
    const { id } = await params;
    const supabase = await createServiceClient();

    const [{ data: agency }, { data: users }, { data: wl }] = await Promise.all([
      supabase.from('agencies').select('*').eq('id', id).single(),
      supabase.from('users').select('id, email, full_name, created_at').eq('agency_id', id),
      supabase.from('white_label_settings').select('*').eq('agency_id', id).single(),
    ]);

    return NextResponse.json({ agency, users, white_label: wl });
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireSuperAdmin();
    const { id } = await params;
    const supabase = await createServiceClient();
    const body = await req.json();

    const { data, error } = await supabase
      .from('agencies')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    await requireSuperAdmin();
    const { id } = await params;
    const supabase = await createServiceClient();
    await supabase.from('agencies').delete().eq('id', id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
