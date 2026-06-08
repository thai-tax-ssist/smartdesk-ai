import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/server';
import { InvoiceTable } from '@/components/billing/InvoiceTable';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { daysUntil, formatDate } from '@/lib/utils';
import { PLANS } from '@/lib/stripe/plans';

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: subscription } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single();

  const serviceClient = await createServiceClient();
  const { data: invoices } = await serviceClient
    .from('invoices')
    .select('id, invoice_number, plan_name, amount_incl_vat, status, issued_at')
    .eq('user_id', user.id)
    .order('issued_at', { ascending: false });

  const plan = subscription?.plan || 'trial';
  const status = subscription?.status || 'trialing';
  const trialDays = subscription?.trial_ends_at ? daysUntil(subscription.trial_ends_at) : 0;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: 'Sora, sans-serif' }}>Billing & Plans</h1>

      {/* Current plan */}
      <Card className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white capitalize">{plan.replace('_', ' ')} Plan</h2>
            <Badge variant={status === 'active' || status === 'trialing' ? 'success' : 'danger'} className="mt-1 capitalize">{status}</Badge>
          </div>
          {status === 'trialing' && (
            <div className="text-right">
              <p className="text-2xl font-bold text-amber-400">{trialDays}</p>
              <p className="text-xs text-slate-400">days left in trial</p>
            </div>
          )}
        </div>

        {subscription?.current_period_end && status !== 'trialing' && (
          <p className="text-sm text-slate-400">Next billing: <span className="text-white">{formatDate(subscription.current_period_end)}</span></p>
        )}
        {subscription?.trial_ends_at && status === 'trialing' && (
          <p className="text-sm text-slate-400">Trial ends: <span className="text-white">{formatDate(subscription.trial_ends_at)}</span></p>
        )}

        <div className="mt-4 pt-4 border-t border-slate-700 flex gap-3">
          <form action="/api/stripe/create-portal" method="POST">
            <Button type="submit" variant="secondary" size="sm">Manage Billing & Invoices</Button>
          </form>
        </div>
      </Card>

      {/* Available plans */}
      <h2 className="text-lg font-semibold text-white mb-4">Available Plans</h2>
      <div className="space-y-4 mb-8">
        {(['starter', 'pro'] as const).map(key => {
          const p = PLANS[key] as { name: string; priceEur: number; priceWithVat: number; queries: number; features: string[] };
          const isCurrent = plan === key;
          return (
            <Card key={key} className={isCurrent ? 'border-indigo-500/50' : ''}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{p.name}</h3>
                    {isCurrent && <Badge variant="info">Current Plan</Badge>}
                    {key === 'pro' && !isCurrent && <Badge variant="success">Most Popular</Badge>}
                  </div>
                  <p className="text-sm text-slate-400">
                    €{p.priceEur}/month + 23% VAT = <span className="text-white">€{p.priceWithVat}/month total</span>
                  </p>
                  <ul className="mt-3 space-y-1">
                    {p.features.map((f, i) => (
                      <li key={i} className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span className="text-indigo-400">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                {!isCurrent && (
                  <form action="/api/stripe/create-checkout" method="POST">
                    <input type="hidden" name="plan" value={key} />
                    <Button type="submit" size="sm">Upgrade</Button>
                  </form>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* VAT note */}
      <Card className="mb-6 bg-slate-800/30">
        <p className="text-xs text-slate-400">
          🇮🇪 <strong className="text-slate-300">EU VAT (23%)</strong> — All prices include Irish VAT in compliance with EU regulations. VAT invoices are available via the billing portal.
        </p>
      </Card>

      {/* Cancel */}
      {invoices && invoices.length > 0 && (
        <Card>
          <h3 className="font-semibold text-white mb-4">Invoices</h3>
          <InvoiceTable invoices={invoices} />
        </Card>
      )}

      {status !== 'canceled' && plan !== 'trial' && (
        <Card>
          <h3 className="font-semibold text-white mb-2">Cancel Subscription</h3>
          <p className="text-sm text-slate-400 mb-4">
            Cancel anytime — no penalty. Your access continues until the end of your current billing period.
          </p>
          <form action="/api/stripe/create-portal" method="POST">
            <Button type="submit" variant="danger" size="sm">Cancel Subscription</Button>
          </form>
        </Card>
      )}
    </div>
  );
}
