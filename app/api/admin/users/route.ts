import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireSuperAdmin } from '@/lib/admin/auth';
import { getCurrentMonth } from '@/lib/utils';

export async function GET() {
  try {
    await requireSuperAdmin();
    const supabase = await createServiceClient();
    const month = getCurrentMonth();

    const { data: users } = await supabase
      .from('users')
      .select('id, email, full_name, role, agency_id, created_at, agencies(name)')
      .order('created_at', { ascending: false });

    if (!users) return NextResponse.json([]);

    const enriched = await Promise.all(users.map(async u => {
      const [{ data: sub }, { data: usage }] = await Promise.all([
        supabase.from('subscriptions').select('plan, status').eq('user_id', u.id).single(),
        supabase.from('usage_tracking').select('queries_used').eq('user_id', u.id).eq('month', month).single(),
      ]);
      return {
        ...u,
        agency_name: (u.agencies as unknown as { name: string } | null)?.name,
        plan: sub?.plan,
        status: sub?.status,
        queries_used: usage?.queries_used || 0,
      };
    }));

    return NextResponse.json(enriched);
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
