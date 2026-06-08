'use client';

interface Invoice {
  id: string;
  invoice_number: string;
  plan_name: string;
  amount_incl_vat: number;
  status: string;
  issued_at: string;
}

interface InvoiceTableProps {
  invoices: Invoice[];
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  function downloadPdf(id: string, invoiceNumber: string) {
    const a = document.createElement('a');
    a.href = `/api/invoices/${id}/pdf`;
    a.download = `SmartDesk-Invoice-${invoiceNumber}.pdf`;
    a.click();
  }

  if (!invoices.length) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        No invoices yet. Your first invoice will appear here after your first payment.
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              {['Invoice', 'Date', 'Plan', 'Amount', 'Status', 'Download'].map(h => (
                <th key={h} className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-gray-800/30 transition-colors">
                <td className="py-3 pr-4 font-mono text-xs text-gray-300">{inv.invoice_number}</td>
                <td className="py-3 pr-4 text-gray-300">
                  {new Date(inv.issued_at).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="py-3 pr-4 text-gray-300 capitalize">{inv.plan_name?.replace(/_/g, ' ')}</td>
                <td className="py-3 pr-4 text-white font-medium">€{(inv.amount_incl_vat / 100).toFixed(2)}</td>
                <td className="py-3 pr-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${inv.status === 'paid' ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'}`}>
                    {inv.status === 'paid' ? '✓' : '○'} {inv.status}
                  </span>
                </td>
                <td className="py-3">
                  <button
                    onClick={() => downloadPdf(inv.id, inv.invoice_number)}
                    className="text-violet-400 hover:text-violet-300 text-xs flex items-center gap-1 transition-colors"
                  >
                    PDF ↓
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-gray-500">
        All invoices include 23% Irish VAT. VAT invoices are suitable for reclaiming VAT through Revenue.ie.
      </p>
    </div>
  );
}

export default InvoiceTable;
