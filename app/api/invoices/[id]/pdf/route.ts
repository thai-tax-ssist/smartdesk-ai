import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/server';
import { generateInvoicePDF } from '@/lib/pdf/invoice-generator';

interface Params { params: Promise<{ id: string }> }

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const serviceClient = await createServiceClient();
    const { data: userRow } = await serviceClient.from('users').select('role').eq('id', user.id).single();
    const isSuperAdmin = userRow?.role === 'super_admin';

    let query = serviceClient.from('invoices').select('*').eq('id', id);
    if (!isSuperAdmin) query = query.eq('user_id', user.id);

    const { data: invoice } = await query.single();
    if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const pdfBuffer = await generateInvoicePDF(invoice);

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="SmartDesk-Invoice-${invoice.invoice_number}.pdf"`,
      },
    });
  } catch (err) {
    console.error('PDF generation error:', err);
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
  }
}
