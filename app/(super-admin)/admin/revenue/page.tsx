import RevenueChart from '@/components/admin/RevenueChart';
import StatsCard from '@/components/admin/StatsCard';

export const dynamic = 'force-dynamic';

async function getRevenueData() {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${base}/api/admin/revenue`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function AdminRevenuePage() {
  const data = await getRevenueData();

  if (!data) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Revenue</h1>
        <p className="text-gray-400">Unable to load revenue data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Revenue</h1>
        <p className="text-gray-400 mt-1">MRR, ARR, and subscription breakdown</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="MRR (ex-VAT)" value={data.mrr} prefix="€" icon="💰" />
        <StatsCard label="ARR" value={data.arr} prefix="€" icon="📈" />
        <StatsCard label="Trial Conversion" value={data.trialConversionRate} suffix="%" icon="🔄" />
        <StatsCard label="Active Trials" value={data.trialsActive} icon="⏳" />
      </div>

      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h2 className="text-lg font-semibold mb-4">Revenue by Month</h2>
        <RevenueChart data={data.byMonth} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">By Plan</h2>
          <div className="space-y-3">
            {data.byPlan?.map((p: { plan: string; count: number; revenue: number }) => (
              <div key={p.plan} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <span className="text-gray-300 capitalize">{p.plan.replace(/_/g, ' ')}</span>
                <div className="text-right">
                  <div className="text-white font-medium">€{p.revenue}/mo</div>
                  <div className="text-gray-400 text-xs">{p.count} subscribers</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">VAT Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Revenue ex-VAT</span>
              <span className="text-white font-medium">€{data.totalExVat}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">VAT (23% Irish)</span>
              <span className="text-white font-medium">€{data.totalVat}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-300 font-medium">Total inc-VAT</span>
              <span className="text-violet-400 font-bold text-lg">€{data.totalIncVat}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
