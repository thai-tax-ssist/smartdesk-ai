import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const serviceClient = await createServiceClient();
    const { data: invoices } = await serviceClient
      .from('invoices')
      .select('id, invoice_number, plan_name, amount_incl_vat, status, issued_at')
      .eq('user_id', user.id)
      .order('issued_at', { ascending: false });

    return NextResponse.json(invoices || []);
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
