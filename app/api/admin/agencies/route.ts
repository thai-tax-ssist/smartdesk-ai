import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireSuperAdmin } from '@/lib/admin/auth';

export async function GET() {
  try {
    await requireSuperAdmin();
    const supabase = await createServiceClient();

    const { data: agencies } = await supabase
      .from('agencies')
      .select('*')
      .order('created_at', { ascending: false });

    if (!agencies) return NextResponse.json([]);

    const enriched = await Promise.all(agencies.map(async agency => {
      const { count: user_count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('agency_id', agency.id);
      return { ...agency, user_count: user_count || 0 };
    }));

    return NextResponse.json(enriched);
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireSuperAdmin();
    const supabase = await createServiceClient();
    const body = await req.json();

    const { data: agency, error } = await supabase
      .from('agencies')
      .insert({ name: body.name, plan: body.plan || 'white_label' })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(agency);
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
