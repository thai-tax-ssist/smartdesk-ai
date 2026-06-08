'use client';

import { useEffect, useState } from 'react';
import UserTable from '@/components/admin/UserTable';

export const dynamic = 'force-dynamic';

export default function AdminUsersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(setUsers).finally(() => setLoading(false));
  }, []);

  const filtered = statusFilter === 'all' ? users :
    users.filter(u => u.status === statusFilter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Users</h1>
        <p className="text-gray-400 mt-1">All registered users across all plans</p>
      </div>

      <div className="flex gap-2">
        {['all', 'active', 'trialing', 'canceled'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${statusFilter === s ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? <div className="text-gray-400">Loading...</div> : <UserTable users={filtered} />}
    </div>
  );
}
