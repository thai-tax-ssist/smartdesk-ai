import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireSuperAdmin } from '@/lib/admin/auth';

const PLAN_PRICES: Record<string, number> = {
  starter: 29,
  pro: 79,
  white_label_early_bird: 249,
  white_label: 349,
};

export async function GET() {
  try {
    await requireSuperAdmin();
    const supabase = await createServiceClient();

    const { data: subs } = await supabase
      .from('subscriptions')
      .select('plan, status, created_at');

    if (!subs) return NextResponse.json({ mrr: 0, arr: 0 });

    const active = subs.filter(s => s.status === 'active');
    const trialing = subs.filter(s => s.status === 'trialing');

    const mrr = active.reduce((sum, s) => sum + (PLAN_PRICES[s.plan] || 0), 0);
    const arr = mrr * 12;
    const trialConversionRate = subs.length > 0
      ? Math.round((active.length / Math.max(subs.length, 1)) * 100)
      : 0;

    // Build last 12 months chart data
    const months: Record<string, { month: string; starter: number; pro: number; white_label: number }> = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toISOString().slice(0, 7);
      const label = d.toLocaleDateString('en-IE', { month: 'short', year: '2-digit' });
      months[key] = { month: label, starter: 0, pro: 0, white_label: 0 };
    }

    active.forEach(s => {
      const key = s.created_at.slice(0, 7);
      if (months[key]) {
        if (s.plan === 'starter') months[key].starter += 29;
        else if (s.plan === 'pro') months[key].pro += 79;
        else if (s.plan?.includes('white_label')) months[key].white_label += PLAN_PRICES[s.plan] || 0;
      }
    });

    const byPlan = ['starter', 'pro', 'white_label_early_bird', 'white_label'].map(plan => ({
      plan,
      count: active.filter(s => s.plan === plan).length,
      revenue: active.filter(s => s.plan === plan).reduce((sum, s) => sum + (PLAN_PRICES[s.plan] || 0), 0),
    }));

    return NextResponse.json({
      mrr,
      arr,
      trialConversionRate,
      trialsActive: trialing.length,
      byMonth: Object.values(months),
      byPlan,
      totalVat: Math.round(mrr * 0.23 * 100) / 100,
      totalExVat: mrr,
      totalIncVat: Math.round(mrr * 1.23 * 100) / 100,
    });
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
