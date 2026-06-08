import { Badge } from '@/components/ui/Badge';

interface TicketCardProps {
  ticket: {
    id: string;
    subject?: string;
    message?: string;
    customer_name?: string;
    customer_email?: string;
    user_email?: string;
    current_plan?: string;
    problem_summary?: string;
    status: string;
    priority?: string;
    created_at: string;
  };
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  return 'just now';
}

const statusVariant: Record<string, 'danger' | 'warning' | 'success'> = {
  open: 'danger',
  in_progress: 'warning',
  resolved: 'success',
};

const priorityVariant: Record<string, 'danger' | 'warning' | 'info'> = {
  urgent: 'danger',
  high: 'warning',
  medium: 'info',
};

export function TicketCard({ ticket }: TicketCardProps) {
  const title = ticket.subject || ticket.problem_summary || 'Support Request';
  const email = ticket.user_email || ticket.customer_email;
  const name = ticket.customer_name;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <div>
          {name && <p className="text-sm font-medium text-white">{name}</p>}
          {email && <p className="text-xs text-gray-400">{email}</p>}
          {!name && !email && <p className="text-sm font-medium text-white">Anonymous</p>}
        </div>
        <div className="flex items-center gap-2">
          {ticket.priority && priorityVariant[ticket.priority] && (
            <Badge variant={priorityVariant[ticket.priority]} className="capitalize">{ticket.priority}</Badge>
          )}
          <Badge variant={statusVariant[ticket.status] || 'default'} className="capitalize">
            {ticket.status.replace('_', ' ')}
          </Badge>
        </div>
      </div>
      <p className="text-sm text-gray-300 truncate">{title.slice(0, 100)}</p>
      <p className="text-xs text-gray-600 mt-2">{timeAgo(ticket.created_at)}</p>
    </div>
  );
}

export default TicketCard;
