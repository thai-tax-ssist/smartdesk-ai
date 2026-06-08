import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireSuperAdmin } from '@/lib/admin/auth';

interface Params { params: Promise<{ id: string }> }

export async function GET(_: NextRequest, { params }: Params) {
  try {
    await requireSuperAdmin();
    const { id } = await params;
    const supabase = await createServiceClient();
    const { data } = await supabase.from('support_tickets').select('*').eq('id', id).single();
    return NextResponse.json(data);
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
      .from('support_tickets')
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
