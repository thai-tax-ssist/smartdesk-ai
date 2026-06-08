import { Badge } from '@/components/ui/Badge';

interface UserRow {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  plan?: string;
  status?: string;
  queries_used?: number;
  agency_name?: string;
  created_at: string;
}

interface UserTableProps {
  users: UserRow[];
}

const planVariant: Record<string, 'info' | 'success' | 'warning' | 'default'> = {
  trial: 'warning',
  starter: 'info',
  pro: 'success',
};

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  active: 'success',
  trialing: 'warning',
  canceled: 'danger',
  past_due: 'danger',
};

export function UserTable({ users }: UserTableProps) {
  if (!users.length) return <p className="text-slate-500 text-sm py-8 text-center">No users found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800">
            {['User', 'Role', 'Plan', 'Status', 'Queries', 'Agency', 'Joined'].map(h => (
              <th key={h} className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider pb-3 pr-4">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {users.map(user => (
            <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                    {(user.full_name || user.email)[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.full_name || '—'}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 pr-4">
                <Badge variant={user.role === 'super_admin' ? 'warning' : user.role === 'agency_admin' ? 'info' : 'default'} className="capitalize">
                  {user.role.replace('_', ' ')}
                </Badge>
              </td>
              <td className="py-3 pr-4">
                {user.plan ? <Badge variant={planVariant[user.plan] || 'default'} className="capitalize">{user.plan.replace('_', ' ')}</Badge> : '—'}
              </td>
              <td className="py-3 pr-4">
                {user.status ? <Badge variant={statusVariant[user.status] || 'default'} className="capitalize">{user.status}</Badge> : '—'}
              </td>
              <td className="py-3 pr-4 text-slate-300">{user.queries_used ?? 0}</td>
              <td className="py-3 pr-4 text-slate-400 text-xs">{user.agency_name || '—'}</td>
              <td className="py-3 pr-4 text-slate-400 text-xs">{new Date(user.created_at).toLocaleDateString('en-IE')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
