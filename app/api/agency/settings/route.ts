import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireAgencyAdmin, getAdminRole } from '@/lib/admin/auth';

export async function GET() {
  try {
    await requireAgencyAdmin();
    const { agencyId } = await getAdminRole();
    const supabase = await createServiceClient();

    const [{ data: agency }, { data: wl }] = await Promise.all([
      supabase.from('agencies').select('*').eq('id', agencyId).single(),
      supabase.from('white_label_settings').select('*').eq('agency_id', agencyId).single(),
    ]);

    return NextResponse.json({ agency, white_label: wl });
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

    const { agency_name, subdomain, ...wlFields } = body;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: any[] = [];

    if (agency_name || subdomain) {
      const agencyUpdate: Record<string, unknown> = {};
      if (agency_name) agencyUpdate.name = agency_name;
      if (subdomain) agencyUpdate.subdomain = subdomain;
      updates.push(supabase.from('agencies').update(agencyUpdate).eq('id', agencyId).then());
    }

    if (Object.keys(wlFields).length > 0) {
      updates.push(
        supabase.from('white_label_settings')
          .upsert({ ...wlFields, agency_id: agencyId }, { onConflict: 'agency_id' })
                );
    }

    await Promise.all(updates);

    const [{ data: agency }, { data: wl }] = await Promise.all([
      supabase.from('agencies').select('*').eq('id', agencyId).single(),
      supabase.from('white_label_settings').select('*').eq('agency_id', agencyId).single(),
    ]);

    return NextResponse.json({ agency, white_label: wl });
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
