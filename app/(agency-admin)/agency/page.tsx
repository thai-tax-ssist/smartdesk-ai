import { createServiceClient } from '@/lib/supabase/server';
import { getAdminRole } from '@/lib/admin/auth';
import { getCurrentMonth } from '@/lib/utils';
import StatsCard from '@/components/admin/StatsCard';

export const dynamic = 'force-dynamic';

export default async function AgencyOverviewPage() {
  const { agencyId } = await getAdminRole();
  const supabase = await createServiceClient();
  const month = getCurrentMonth();

  const [{ data: users }, { data: usages }] = await Promise.all([
    supabase.from('users').select('id, created_at').eq('agency_id', agencyId),
    supabase.from('usage_tracking').select('queries_used').in(
      'user_id',
      ((await supabase.from('users').select('id').eq('agency_id', agencyId)).data || []).map(u => u.id)
    ).eq('month', month),
  ]);

  const totalQueries = usages?.reduce((sum, u) => sum + (u.queries_used || 0), 0) || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Agency Overview</h1>
        <p className="text-gray-400 mt-1">Your white label platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard label="Total Users" value={users?.length || 0} icon="👥" />
        <StatsCard label="Queries This Month" value={totalQueries} icon="🤖" />
        <StatsCard label="Active Since" value={new Date().getFullYear()} icon="📅" />
      </div>
    </div>
  );
}
