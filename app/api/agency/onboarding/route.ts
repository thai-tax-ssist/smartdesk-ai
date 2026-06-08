import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireAgencyAdmin, getAdminRole } from '@/lib/admin/auth';

export async function GET() {
  try {
    await requireAgencyAdmin();
    const { agencyId } = await getAdminRole();
    const supabase = await createServiceClient();

    const { data } = await supabase
      .from('white_label_settings')
      .select('*')
      .eq('agency_id', agencyId)
      .single();

    return NextResponse.json(data || {});
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAgencyAdmin();
    const { agencyId } = await getAdminRole();
    const supabase = await createServiceClient();
    const body = await req.json();

    const { data } = await supabase
      .from('white_label_settings')
      .upsert({ ...body, agency_id: agencyId }, { onConflict: 'agency_id' })
      .select()
      .single();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
