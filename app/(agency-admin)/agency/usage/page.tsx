'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const dynamic = 'force-dynamic';

interface UsageData {
  total_queries: number;
  total_limit: number;
  by_month: { month: string; queries: number }[];
}

export default function AgencyUsagePage() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/agency/usage').then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400">Loading...</div>;

  const usagePct = data && data.total_limit > 0 ? Math.round((data.total_queries / data.total_limit) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Usage</h1>
        <p className="text-gray-400 mt-1">Query usage across all agency users</p>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <p className="text-sm text-gray-400 mb-1">This Month</p>
              <p className="text-3xl font-bold text-white">{data.total_queries.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">queries used</p>
            </div>
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <p className="text-sm text-gray-400 mb-1">Limit</p>
              <p className="text-3xl font-bold text-white">{data.total_limit.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">total queries</p>
            </div>
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <p className="text-sm text-gray-400 mb-2">Usage</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-800 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-700 ${usagePct >= 90 ? 'bg-red-500' : usagePct >= 70 ? 'bg-yellow-500' : 'bg-violet-500'}`}
                    style={{ width: `${Math.min(usagePct, 100)}%` }}
                  />
                </div>
                <span className="text-white font-bold text-sm">{usagePct}%</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-lg font-semibold mb-4">Last 6 Months</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.by_month}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#f9fafb' }} />
                <Bar dataKey="queries" name="Queries" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
