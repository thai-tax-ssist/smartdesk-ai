'use client';

import { useEffect, useState } from 'react';
import UserUsageTable from '@/components/agency/UserUsageTable';

export const dynamic = 'force-dynamic';

export default function AgencyUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/agency/users').then(r => r.json()).then(setUsers).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Users</h1>
        <p className="text-gray-400 mt-1">All users in your agency</p>
      </div>
      {loading ? <div className="text-gray-400">Loading...</div> : <UserUsageTable users={users} />}
    </div>
  );
}
