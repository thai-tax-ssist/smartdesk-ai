'use client';

import { useEffect, useState } from 'react';
import { AgencyTable } from '@/components/admin/AgencyTable';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Agency {
  id: string;
  name: string;
  subdomain: string | null;
  plan: string;
  status: string;
  user_count: number;
  created_at: string;
}

export default function AdminAgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', subdomain: '', admin_email: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/agencies').then(r => r.json()).then(setAgencies).finally(() => setLoading(false));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/admin/agencies', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await fetch('/api/admin/agencies').then(r => r.json());
    setAgencies(data);
    setShowForm(false);
    setForm({ name: '', subdomain: '', admin_email: '' });
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Agencies</h1>
          <p className="text-gray-400 mt-1">White Label client accounts</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + New Agency
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
          <h2 className="text-lg font-semibold">Create Agency</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Agency name" className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500" />
            <input value={form.subdomain} onChange={e => setForm(f => ({ ...f, subdomain: e.target.value }))}
              placeholder="subdomain (optional)" className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500" />
            <input required type="email" value={form.admin_email} onChange={e => setForm(f => ({ ...f, admin_email: e.target.value }))}
              placeholder="Admin email" className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
              {saving ? 'Creating...' : 'Create'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white px-4 py-2 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <AgencyTable agencies={agencies} renderActions={(a) => (
          <Link href={`/admin/agencies/${a.id}`} className="text-violet-400 hover:text-violet-300 text-sm">
            View →
          </Link>
        )} />
      )}
    </div>
  );
}
