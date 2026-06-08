'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

const statuses = ['open', 'in_progress', 'resolved', 'closed'];

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/tickets/${id}`).then(r => r.json()).then(setTicket).finally(() => setLoading(false));
  }, [id]);

  async function updateStatus(status: string) {
    setSaving(true);
    const data = await fetch(`/api/admin/tickets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then(r => r.json());
    setTicket(data);
    setSaving(false);
  }

  if (loading) return <div className="text-gray-400">Loading...</div>;
  if (!ticket) return <div className="text-gray-400">Ticket not found.</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/tickets" className="text-gray-400 hover:text-white">← Tickets</Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-white">{ticket.subject}</h1>
        <p className="text-gray-400 text-sm mt-1">#{ticket.id.slice(0, 8)} · {new Date(ticket.created_at).toLocaleDateString('en-IE', { dateStyle: 'long' })}</p>
      </div>

      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
        <div>
          <p className="text-sm text-gray-400 mb-1">Message</p>
          <p className="text-white whitespace-pre-wrap">{ticket.message}</p>
        </div>
        <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
          <div>
            <p className="text-xs text-gray-400 mb-1">Priority</p>
            <span className={`text-sm font-medium capitalize ${ticket.priority === 'urgent' ? 'text-red-400' : ticket.priority === 'high' ? 'text-orange-400' : 'text-gray-300'}`}>
              {ticket.priority || 'normal'}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Status</p>
            <select
              value={ticket.status}
              onChange={e => updateStatus(e.target.value)}
              disabled={saving}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-violet-500 disabled:opacity-50 capitalize"
            >
              {statuses.map(s => (
                <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
