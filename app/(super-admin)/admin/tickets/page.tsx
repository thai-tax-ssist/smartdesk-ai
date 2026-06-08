'use client';

import { useEffect, useState } from 'react';
import TicketCard from '@/components/admin/TicketCard';
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
  user_email?: string;
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const qs = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
    fetch(`/api/admin/tickets${qs}`).then(r => r.json()).then(setTickets).finally(() => setLoading(false));
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Support Tickets</h1>
        <p className="text-gray-400 mt-1">User support requests</p>
      </div>

      <div className="flex gap-2">
        {['all', 'open', 'in_progress', 'resolved', 'closed'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${statusFilter === s ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : tickets.length === 0 ? (
        <div className="text-gray-400 text-center py-12">No tickets found.</div>
      ) : (
        <div className="space-y-3">
          {tickets.map(ticket => (
            <Link key={ticket.id} href={`/admin/tickets/${ticket.id}`}>
              <TicketCard ticket={ticket} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
