'use client';

import { useEffect, useState } from 'react';
import EarlyBirdCounter from '@/components/admin/EarlyBirdCounter';

export const dynamic = 'force-dynamic';

interface EarlyBirdData {
  count: number;
  max_count: number;
  is_open: boolean;
}

export default function EarlyBirdPage() {
  const [data, setData] = useState<EarlyBirdData | null>(null);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/early-bird').then(r => r.json()).then(d => {
      setData(d);
      setCount(String(d.count));
    }).finally(() => setLoading(false));
  }, []);

  async function handleUpdate(updates: Partial<EarlyBirdData>) {
    setSaving(true);
    const updated = await fetch('/api/admin/early-bird', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).then(r => r.json());
    setData(updated);
    setCount(String(updated.count));
    setSaving(false);
  }

  if (loading) return <div className="text-gray-400">Loading...</div>;
  if (!data) return <div className="text-gray-400">Unable to load early bird data.</div>;

  const pct = Math.round((data.count / data.max_count) * 100);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Early Bird</h1>
        <p className="text-gray-400 mt-1">Manage the early bird counter and availability</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 flex flex-col items-center justify-center">
          <EarlyBirdCounter count={data.count} maxCount={data.max_count} isOpen={data.is_open} />
          <div className="mt-6 text-center">
            <p className="text-2xl font-bold text-white">{data.count} / {data.max_count}</p>
            <p className="text-gray-400 text-sm mt-1">{pct}% claimed</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${data.is_open ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
              {data.is_open ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-6">
          <h2 className="text-lg font-semibold">Manual Controls</h2>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Set Count</label>
            <div className="flex gap-3">
              <input
                type="number"
                min="0"
                max={data.max_count}
                value={count}
                onChange={e => setCount(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
              />
              <button
                disabled={saving}
                onClick={() => handleUpdate({ count: parseInt(count) })}
                className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors"
              >
                Update
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Availability</label>
            <div className="flex gap-3">
              <button
                disabled={saving || data.is_open}
                onClick={() => handleUpdate({ is_open: true })}
                className="flex-1 bg-green-900/40 hover:bg-green-900/60 text-green-400 border border-green-800 px-4 py-2 rounded-lg font-medium disabled:opacity-40 transition-colors"
              >
                Open
              </button>
              <button
                disabled={saving || !data.is_open}
                onClick={() => handleUpdate({ is_open: false })}
                className="flex-1 bg-red-900/40 hover:bg-red-900/60 text-red-400 border border-red-800 px-4 py-2 rounded-lg font-medium disabled:opacity-40 transition-colors"
              >
                Close
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800 text-sm text-gray-400">
            <p>Milestones trigger emails at: 50%, 75%, 90%, 100%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
