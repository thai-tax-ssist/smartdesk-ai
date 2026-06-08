import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireSuperAdmin } from '@/lib/admin/auth';

export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin();
    const supabase = await createServiceClient();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: tickets } = await query;
    return NextResponse.json(tickets || []);
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
