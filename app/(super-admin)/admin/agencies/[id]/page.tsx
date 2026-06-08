'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface AgencyDetail {
  id: string;
  name: string;
  subdomain: string | null;
  plan: string;
  status: string;
  domain: string | null;
  created_at: string;
}

export default function AgencyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [agency, setAgency] = useState<AgencyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', subdomain: '', status: 'active' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/agencies/${id}`).then(r => r.json()).then(data => {
      setAgency(data);
      setForm({ name: data.name || '', subdomain: data.subdomain || '', status: data.status || 'active' });
    }).finally(() => setLoading(false));
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const data = await fetch(`/api/admin/agencies/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).then(r => r.json());
    setAgency(data);
    setEditing(false);
    setSaving(false);
  }

  if (loading) return <div className="text-gray-400">Loading...</div>;
  if (!agency) return <div className="text-gray-400">Agency not found.</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/agencies" className="text-gray-400 hover:text-white">← Agencies</Link>
      </div>
      <h1 className="text-3xl font-bold text-white">{agency.name}</h1>

      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
        {editing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Subdomain</label>
              <input value={form.subdomain} onChange={e => setForm(f => ({ ...f, subdomain: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500">
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50">
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="text-gray-400 hover:text-white px-4 py-2">Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-400">Plan:</span> <span className="text-white capitalize">{agency.plan?.replace(/_/g, ' ')}</span></div>
              <div><span className="text-gray-400">Status:</span> <span className={`capitalize font-medium ${agency.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>{agency.status}</span></div>
              <div><span className="text-gray-400">Subdomain:</span> <span className="text-white">{agency.subdomain || '—'}</span></div>
              <div><span className="text-gray-400">Domain:</span> <span className="text-white">{agency.domain || '—'}</span></div>
              <div><span className="text-gray-400">Created:</span> <span className="text-white">{new Date(agency.created_at).toLocaleDateString('en-IE')}</span></div>
            </div>
            <button onClick={() => setEditing(true)} className="mt-4 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
}
