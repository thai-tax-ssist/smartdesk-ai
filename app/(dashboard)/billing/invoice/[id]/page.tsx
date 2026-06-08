import { createServiceClient } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function formatEur(cents: number) {
  return `€${(cents / 100).toFixed(2)}`;
}

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const serviceClient = await createServiceClient();
  const { data: invoice } = await serviceClient.from('invoices').select('*').eq('id', id).eq('user_id', user.id).single();
  if (!invoice) redirect('/billing');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/billing" className="text-gray-400 hover:text-white text-sm">← Billing</Link>
        <a href={`/api/invoices/${id}/pdf`} download className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Download PDF
        </a>
      </div>

      <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-violet-400" style={{ fontFamily: 'Sora, sans-serif' }}>SmartDesk.ai</h1>
            <p className="text-gray-400 text-sm mt-1">support@smartdesk.ai · Ireland</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">VAT INVOICE</p>
            <p className="text-gray-400 text-sm mt-1">{invoice.invoice_number}</p>
            <p className="text-gray-400 text-sm">{new Date(invoice.issued_at).toLocaleDateString('en-IE', { dateStyle: 'long' })}</p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Bill To</p>
          {invoice.customer_name && <p className="text-white">{invoice.customer_name}</p>}
          {invoice.customer_email && <p className="text-gray-400 text-sm">{invoice.customer_email}</p>}
          {invoice.customer_vat_number && <p className="text-gray-400 text-sm">VAT: {invoice.customer_vat_number}</p>}
        </div>

        <table className="w-full text-sm mb-6">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left text-xs text-gray-400 pb-2">Description</th>
              <th className="text-right text-xs text-gray-400 pb-2">Unit Price</th>
              <th className="text-right text-xs text-gray-400 pb-2">VAT</th>
              <th className="text-right text-xs text-gray-400 pb-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-800">
              <td className="py-3 text-gray-300">{invoice.description || invoice.plan_name}</td>
              <td className="py-3 text-right text-gray-300">{formatEur(invoice.amount_excl_vat)}</td>
              <td className="py-3 text-right text-gray-300">{Math.round(invoice.vat_rate * 100)}%</td>
              <td className="py-3 text-right text-gray-300">{formatEur(invoice.amount_excl_vat)}</td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal (excl. VAT)</span>
              <span className="text-gray-300">{formatEur(invoice.amount_excl_vat)}</span>
            </div>
            <div className="flex justify-between text-sm border-b border-gray-700 pb-2">
              <span className="text-gray-400">VAT @ {Math.round(invoice.vat_rate * 100)}%</span>
              <span className="text-gray-300">{formatEur(invoice.vat_amount)}</span>
            </div>
            <div className="flex justify-between font-bold bg-violet-600/20 rounded-lg px-3 py-2">
              <span className="text-white">Total (incl. VAT)</span>
              <span className="text-violet-300">{formatEur(invoice.amount_incl_vat)}</span>
            </div>
          </div>
        </div>

        {invoice.status === 'paid' && (
          <div className="mt-6 inline-flex items-center gap-2 bg-green-900/30 text-green-400 border border-green-800/50 px-4 py-2 rounded-full text-sm font-medium">
            ✓ PAID {invoice.paid_at ? `— ${new Date(invoice.paid_at).toLocaleDateString('en-IE', { dateStyle: 'long' })}` : ''}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-800 text-xs text-gray-500 text-center space-y-1">
          <p>SmartDesk.ai · support@smartdesk.ai · Ireland (EU)</p>
          <p>This is a VAT invoice issued under Irish VAT law. Data processed in accordance with GDPR.</p>
        </div>
      </div>
    </div>
  );
}
