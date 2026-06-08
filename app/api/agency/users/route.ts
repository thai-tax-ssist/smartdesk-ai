import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireAgencyAdmin, getAdminRole } from '@/lib/admin/auth';
import { getCurrentMonth } from '@/lib/utils';

export async function GET() {
  try {
    await requireAgencyAdmin();
    const { agencyId } = await getAdminRole();
    const supabase = await createServiceClient();
    const month = getCurrentMonth();

    const { data: users } = await supabase
      .from('users')
      .select('id, email, full_name, created_at')
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false });

    if (!users) return NextResponse.json([]);

    const enriched = await Promise.all(users.map(async u => {
      const [{ data: sub }, { data: usage }] = await Promise.all([
        supabase.from('subscriptions').select('plan, status').eq('user_id', u.id).single(),
        supabase.from('usage_tracking').select('queries_used, query_limit').eq('user_id', u.id).eq('month', month).single(),
      ]);
      return {
        ...u,
        plan: sub?.plan,
        status: sub?.status,
        queries_used: usage?.queries_used || 0,
        query_limit: usage?.query_limit || 0,
      };
    }));

    return NextResponse.json(enriched);
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
