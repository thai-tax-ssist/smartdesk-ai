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
      .select('id')
      .eq('agency_id', agencyId);

    if (!users || users.length === 0) {
      return NextResponse.json({ total_queries: 0, total_limit: 0, users: [] });
    }

    const userIds = users.map(u => u.id);
    const { data: usages } = await supabase
      .from('usage_tracking')
      .select('user_id, queries_used, query_limit')
      .in('user_id', userIds)
      .eq('month', month);

    const totalQueries = usages?.reduce((sum, u) => sum + (u.queries_used || 0), 0) || 0;
    const totalLimit = usages?.reduce((sum, u) => sum + (u.query_limit || 0), 0) || 0;

    const last6: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      last6[d.toISOString().slice(0, 7)] = 0;
    }

    const { data: history } = await supabase
      .from('usage_tracking')
      .select('month, queries_used')
      .in('user_id', userIds);

    history?.forEach(h => {
      if (last6[h.month] !== undefined) last6[h.month] += h.queries_used || 0;
    });

    return NextResponse.json({
      total_queries: totalQueries,
      total_limit: totalLimit,
      by_month: Object.entries(last6).map(([month, queries]) => ({ month, queries })),
      users: usages || [],
    });
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
