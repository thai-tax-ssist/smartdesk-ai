import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';

interface Agency {
  id: string;
  name: string;
  logo_url?: string;
  plan: string;
  status: string;
  domain?: string;
  created_at: string;
  user_count?: number;
  revenue?: number;
}

interface AgencyTableProps {
  agencies: Agency[];
  renderActions?: (agency: Agency) => React.ReactNode;
}

const planVariant: Record<string, 'info' | 'success' | 'warning'> = {
  white_label: 'info',
  white_label_early_bird: 'warning',
};

const statusVariant: Record<string, 'success' | 'danger' | 'warning'> = {
  active: 'success',
  suspended: 'danger',
  inactive: 'warning',
};

export function AgencyTable({ agencies, renderActions }: AgencyTableProps) {
  if (!agencies.length) {
    return <p className="text-slate-500 text-sm py-8 text-center">No agencies yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800">
            {['Agency', 'Plan', 'Status', 'Users', 'Revenue', 'Domain', 'Created', 'Actions'].map(h => (
              <th key={h} className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider pb-3 pr-4">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {agencies.map(agency => (
            <tr key={agency.id} className="hover:bg-slate-800/30 transition-colors">
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  {agency.logo_url ? (
                    <img src={agency.logo_url} alt={agency.name} className="w-6 h-6 rounded object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded bg-indigo-500/20 flex items-center justify-center text-xs text-indigo-400 font-bold">
                      {agency.name[0]}
                    </div>
                  )}
                  <span className="text-white font-medium">{agency.name}</span>
                </div>
              </td>
              <td className="py-3 pr-4"><Badge variant={planVariant[agency.plan] || 'default'} className="capitalize">{agency.plan.replace('_', ' ')}</Badge></td>
              <td className="py-3 pr-4"><Badge variant={statusVariant[agency.status] || 'default'} className="capitalize">{agency.status}</Badge></td>
              <td className="py-3 pr-4 text-slate-300">{agency.user_count || 0}</td>
              <td className="py-3 pr-4 text-slate-300">{agency.revenue ? `€${agency.revenue}` : '—'}</td>
              <td className="py-3 pr-4 text-slate-400 text-xs">{agency.domain || '—'}</td>
              <td className="py-3 pr-4 text-slate-400 text-xs">{new Date(agency.created_at).toLocaleDateString('en-IE')}</td>
              <td className="py-3">
                {renderActions ? renderActions(agency) : (
                  <Link href={`/admin/agencies/${agency.id}`} className="text-indigo-400 hover:text-indigo-300 text-xs">View →</Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AgencyTable;
