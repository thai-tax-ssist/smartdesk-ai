import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 10, color: '#1e293b', padding: 48, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  logo: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#6366f1' },
  logoSub: { fontSize: 9, color: '#64748b', marginTop: 2 },
  invoiceTitle: { fontSize: 24, fontFamily: 'Helvetica-Bold', color: '#1e293b', textAlign: 'right' },
  invoiceMeta: { fontSize: 9, color: '#64748b', textAlign: 'right', marginTop: 4 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  row: { flexDirection: 'row', marginBottom: 3 },
  label: { fontSize: 9, color: '#64748b', width: 80 },
  value: { fontSize: 9, color: '#1e293b', flex: 1 },
  divider: { borderBottom: '1 solid #e2e8f0', marginVertical: 16 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f8fafc', padding: '8 6', borderRadius: 4, marginBottom: 4 },
  tableHeaderText: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#64748b', textTransform: 'uppercase' },
  tableRow: { flexDirection: 'row', padding: '6 6', borderBottom: '1 solid #f1f5f9' },
  tableCell: { fontSize: 9, color: '#1e293b' },
  col1: { flex: 3 },
  col2: { flex: 1, textAlign: 'center' },
  col3: { flex: 1, textAlign: 'right' },
  col4: { flex: 1, textAlign: 'center' },
  col5: { flex: 1, textAlign: 'right' },
  totals: { marginTop: 8, alignItems: 'flex-end' },
  totalRow: { flexDirection: 'row', width: 220, justifyContent: 'space-between', marginBottom: 4 },
  totalLabel: { fontSize: 9, color: '#64748b' },
  totalValue: { fontSize: 9, color: '#1e293b' },
  grandTotalRow: { flexDirection: 'row', width: 220, justifyContent: 'space-between', backgroundColor: '#6366f1', padding: '6 8', borderRadius: 4, marginTop: 4 },
  grandTotalLabel: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  grandTotalValue: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  statusBadge: { backgroundColor: '#d1fae5', borderRadius: 4, padding: '4 8', alignSelf: 'flex-start', marginTop: 12 },
  statusText: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#065f46' },
  footer: { position: 'absolute', bottom: 32, left: 48, right: 48 },
  footerText: { fontSize: 8, color: '#94a3b8', textAlign: 'center' },
});

interface InvoiceData {
  invoice_number: string;
  issued_at: string;
  paid_at?: string | null;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_vat_number?: string | null;
  plan_name?: string | null;
  description?: string | null;
  amount_excl_vat: number;
  vat_rate: number;
  vat_amount: number;
  amount_incl_vat: number;
  setup_fee_excl_vat?: number;
  setup_fee_vat?: number;
  setup_fee_incl_vat?: number;
  status: string;
}

function formatEur(cents: number) {
  return `€${(cents / 100).toFixed(2)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function InvoicePDF({ invoice }: { invoice: InvoiceData }) {
  const hasSetupFee = (invoice.setup_fee_incl_vat || 0) > 0;

  return React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: styles.page },
      // Header
      React.createElement(View, { style: styles.header },
        React.createElement(View, null,
          React.createElement(Text, { style: styles.logo }, 'SmartDesk.ai'),
          React.createElement(Text, { style: styles.logoSub }, 'smartdesk.ai · support@smartdesk.ai'),
          React.createElement(Text, { style: { ...styles.logoSub, marginTop: 2 } }, 'Ireland (EU)'),
        ),
        React.createElement(View, null,
          React.createElement(Text, { style: styles.invoiceTitle }, 'VAT INVOICE'),
          React.createElement(Text, { style: styles.invoiceMeta }, `Invoice: ${invoice.invoice_number}`),
          React.createElement(Text, { style: styles.invoiceMeta }, `Date: ${formatDate(invoice.issued_at)}`),
          React.createElement(Text, { style: styles.invoiceMeta }, `Due: ${formatDate(invoice.issued_at)}`),
        ),
      ),

      React.createElement(View, { style: styles.divider }),

      // Bill To
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Bill To'),
        invoice.customer_name && React.createElement(View, { style: styles.row },
          React.createElement(Text, { style: styles.label }, 'Name:'),
          React.createElement(Text, { style: styles.value }, invoice.customer_name),
        ),
        invoice.customer_email && React.createElement(View, { style: styles.row },
          React.createElement(Text, { style: styles.label }, 'Email:'),
          React.createElement(Text, { style: styles.value }, invoice.customer_email),
        ),
        invoice.customer_vat_number && React.createElement(View, { style: styles.row },
          React.createElement(Text, { style: styles.label }, 'VAT No:'),
          React.createElement(Text, { style: styles.value }, invoice.customer_vat_number),
        ),
      ),

      React.createElement(View, { style: styles.divider }),

      // Line items table
      React.createElement(View, { style: styles.tableHeader },
        React.createElement(Text, { style: { ...styles.tableHeaderText, ...styles.col1 } }, 'Description'),
        React.createElement(Text, { style: { ...styles.tableHeaderText, ...styles.col2 } }, 'Qty'),
        React.createElement(Text, { style: { ...styles.tableHeaderText, ...styles.col3 } }, 'Unit Price'),
        React.createElement(Text, { style: { ...styles.tableHeaderText, ...styles.col4 } }, 'VAT'),
        React.createElement(Text, { style: { ...styles.tableHeaderText, ...styles.col5 } }, 'Amount'),
      ),
      React.createElement(View, { style: styles.tableRow },
        React.createElement(Text, { style: { ...styles.tableCell, ...styles.col1 } }, invoice.description || invoice.plan_name || 'SmartDesk.ai Subscription'),
        React.createElement(Text, { style: { ...styles.tableCell, ...styles.col2 } }, '1'),
        React.createElement(Text, { style: { ...styles.tableCell, ...styles.col3 } }, formatEur(invoice.amount_excl_vat)),
        React.createElement(Text, { style: { ...styles.tableCell, ...styles.col4 } }, `${Math.round(invoice.vat_rate * 100)}%`),
        React.createElement(Text, { style: { ...styles.tableCell, ...styles.col5 } }, formatEur(invoice.amount_excl_vat)),
      ),
      hasSetupFee && React.createElement(View, { style: styles.tableRow },
        React.createElement(Text, { style: { ...styles.tableCell, ...styles.col1 } }, 'White Label Setup Fee'),
        React.createElement(Text, { style: { ...styles.tableCell, ...styles.col2 } }, '1'),
        React.createElement(Text, { style: { ...styles.tableCell, ...styles.col3 } }, formatEur(invoice.setup_fee_excl_vat || 0)),
        React.createElement(Text, { style: { ...styles.tableCell, ...styles.col4 } }, `${Math.round(invoice.vat_rate * 100)}%`),
        React.createElement(Text, { style: { ...styles.tableCell, ...styles.col5 } }, formatEur(invoice.setup_fee_excl_vat || 0)),
      ),

      // Totals
      React.createElement(View, { style: styles.totals },
        React.createElement(View, { style: styles.totalRow },
          React.createElement(Text, { style: styles.totalLabel }, 'Subtotal (excl. VAT)'),
          React.createElement(Text, { style: styles.totalValue }, formatEur(invoice.amount_excl_vat + (invoice.setup_fee_excl_vat || 0))),
        ),
        React.createElement(View, { style: styles.totalRow },
          React.createElement(Text, { style: styles.totalLabel }, `VAT @ ${Math.round(invoice.vat_rate * 100)}% (Irish VAT)`),
          React.createElement(Text, { style: styles.totalValue }, formatEur(invoice.vat_amount + (invoice.setup_fee_vat || 0))),
        ),
        React.createElement(View, { style: styles.grandTotalRow },
          React.createElement(Text, { style: styles.grandTotalLabel }, 'TOTAL (incl. VAT)'),
          React.createElement(Text, { style: styles.grandTotalValue }, formatEur(invoice.amount_incl_vat + (invoice.setup_fee_incl_vat || 0))),
        ),
      ),

      // Payment status
      React.createElement(View, { style: styles.statusBadge },
        React.createElement(Text, { style: styles.statusText },
          invoice.status === 'paid'
            ? `✓ PAID${invoice.paid_at ? ' — ' + formatDate(invoice.paid_at) : ''}`
            : invoice.status.toUpperCase()
        ),
      ),

      // Footer
      React.createElement(View, { style: styles.footer },
        React.createElement(View, { style: { borderTop: '1 solid #e2e8f0', paddingTop: 12 } },
          React.createElement(Text, { style: styles.footerText }, 'SmartDesk.ai · support@smartdesk.ai · Ireland'),
          React.createElement(Text, { style: { ...styles.footerText, marginTop: 2 } }, 'This is a VAT invoice issued under Irish VAT law. Data processed in accordance with GDPR.'),
        ),
      ),
    )
  );
}

export async function generateInvoicePDF(invoice: InvoiceData): Promise<Buffer> {
  const { renderToBuffer } = await import('@react-pdf/renderer');
  const element = React.createElement(InvoicePDF, { invoice });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return renderToBuffer(element as any);
}
