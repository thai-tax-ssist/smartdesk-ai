import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

interface UserUsage {
  id: string;
  email: string;
  full_name?: string;
  queries_used: number;
  last_active?: string;
  status: 'active' | 'inactive';
}

interface UserUsageTableProps {
  users: UserUsage[];
  limit?: number;
}

export function UserUsageTable({ users, limit }: UserUsageTableProps) {
  const displayUsers = limit ? users.slice(0, limit) : users;

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-slate-800">
          {['User', 'Queries Used', 'Last Active', 'Status'].map(h => (
            <th key={h} className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider pb-3 pr-4">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800/50">
        {displayUsers.map(user => (
          <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
            <td className="py-3 pr-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400">
                  {(user.full_name || user.email)[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium">{user.full_name || '—'}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              </div>
            </td>
            <td className="py-3 pr-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-300 font-medium">{user.queries_used}</span>
                <div className="w-16 bg-slate-700 rounded-full h-1">
                  <div className="bg-violet-500 h-1 rounded-full" style={{ width: `${Math.min(100, (user.queries_used / 200) * 100)}%` }} />
                </div>
              </div>
            </td>
            <td className="py-3 pr-4 text-slate-400 text-xs">{user.last_active ? formatDate(user.last_active) : '—'}</td>
            <td className="py-3">
              <Badge variant={user.status === 'active' ? 'success' : 'default'} className="capitalize">{user.status}</Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UserUsageTable;
