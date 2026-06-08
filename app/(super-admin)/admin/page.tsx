import StatsCard from '@/components/admin/StatsCard';
import RevenueChart from '@/components/admin/RevenueChart';
import EarlyBirdCounter from '@/components/admin/EarlyBirdCounter';
import { createServiceClient } from '@/lib/supabase/server';
import { getCurrentMonth } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const PLAN_PRICES: Record<string, number> = {
  starter: 29,
  pro: 79,
  white_label_early_bird: 249,
  white_label: 349,
};

export default async function AdminOverviewPage() {
  const supabase = await createServiceClient();
  const month = getCurrentMonth();

  const [
    { data: users },
    { data: subs },
    { data: tickets },
    { data: earlyBird },
    { data: usage },
  ] = await Promise.all([
    supabase.from('users').select('id, created_at'),
    supabase.from('subscriptions').select('plan, status, created_at'),
    supabase.from('support_tickets').select('id, status'),
    supabase.from('early_bird_counter').select('*').eq('id', 1).single(),
    supabase.from('usage_tracking').select('queries_used').eq('month', month),
  ]);

  const active = subs?.filter(s => s.status === 'active') || [];
  const mrr = active.reduce((sum, s) => sum + (PLAN_PRICES[s.plan] || 0), 0);
  const totalQueries = usage?.reduce((sum, u) => sum + (u.queries_used || 0), 0) || 0;
  const openTickets = tickets?.filter(t => t.status === 'open').length || 0;

  const months: Record<string, { month: string; starter: number; pro: number; white_label: number }> = {};
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = d.toISOString().slice(0, 7);
    const label = d.toLocaleDateString('en-IE', { month: 'short', year: '2-digit' });
    months[key] = { month: label, starter: 0, pro: 0, white_label: 0 };
  }
  active.forEach(s => {
    const key = s.created_at?.slice(0, 7);
    if (key && months[key]) {
      if (s.plan === 'starter') months[key].starter += 29;
      else if (s.plan === 'pro') months[key].pro += 79;
      else if (s.plan?.includes('white_label')) months[key].white_label += PLAN_PRICES[s.plan] || 0;
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Overview</h1>
        <p className="text-gray-400 mt-1">SmartDesk.ai platform dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Total Users" value={users?.length || 0} icon="👥" />
        <StatsCard label="MRR" value={mrr} prefix="€" icon="💰" />
        <StatsCard label="Queries This Month" value={totalQueries} icon="🤖" />
        <StatsCard label="Open Tickets" value={openTickets} icon="🎫" accent={openTickets > 0 ? 'red' : 'green'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Revenue by Month</h2>
          <RevenueChart data={Object.values(months)} />
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold mb-4">Early Bird</h2>
          <EarlyBirdCounter
            count={earlyBird?.count || 0}
            maxCount={earlyBird?.max_count || 100}
            isOpen={earlyBird?.is_open ?? true}
          />
        </div>
      </div>
    </div>
  );
}
