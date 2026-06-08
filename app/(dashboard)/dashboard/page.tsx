import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { daysUntil, formatDate } from '@/lib/utils';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const currentMonth = new Date().toISOString().slice(0, 7);

  const [{ data: subscription }, { data: usage }, { data: conversations }, { data: profile }] = await Promise.all([
    supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
    supabase.from('usage_tracking').select('queries_used').eq('user_id', user.id).eq('month', currentMonth).single(),
    supabase.from('conversations').select('id, title, created_at, updated_at').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(5),
    supabase.from('users').select('full_name').eq('id', user.id).single(),
  ]);

  const plan = subscription?.plan || 'trial';
  const queriesUsed = usage?.queries_used || 0;
  const queriesLimit = plan === 'pro' ? -1 : plan === 'starter' ? 200 : 50;
  const unlimited = queriesLimit === -1;
  const trialDays = subscription?.trial_ends_at ? daysUntil(subscription.trial_ends_at) : 0;

  const planBadgeMap: Record<string, 'warning' | 'info' | 'success' | 'default'> = {
    trial: 'warning',
    starter: 'info',
    pro: 'success',
    white_label: 'success',
    white_label_early_bird: 'success',
  };
  const planBadge = planBadgeMap[plan] || 'default';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
          Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''} 👋
        </h1>
        <p className="text-slate-400 mt-1">Here's what's happening with your SmartDesk account.</p>
      </div>

      {plan === 'trial' && trialDays <= 3 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
          <p className="text-amber-400 text-sm">⚡ {trialDays} day{trialDays !== 1 ? 's' : ''} left in your free trial</p>
          <Link href="/billing"><Button size="sm">Upgrade Now</Button></Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Queries Used</p>
          <p className="text-2xl font-bold text-white">{unlimited ? '∞' : queriesUsed}</p>
          <p className="text-xs text-slate-500 mt-1">{unlimited ? 'Unlimited' : `of ${queriesLimit} this month`}</p>
          {!unlimited && (
            <div className="mt-2 w-full bg-slate-700 rounded-full h-1.5">
              <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (queriesUsed / queriesLimit) * 100)}%` }} />
            </div>
          )}
        </Card>

        <Card>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Current Plan</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={planBadge} className="capitalize">{plan.replace('_', ' ')}</Badge>
          </div>
          {subscription?.current_period_end && (
            <p className="text-xs text-slate-500 mt-2">Renews {formatDate(subscription.current_period_end)}</p>
          )}
          {plan === 'trial' && subscription?.trial_ends_at && (
            <p className="text-xs text-slate-500 mt-2">Trial ends {formatDate(subscription.trial_ends_at)}</p>
          )}
        </Card>

        <Card>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Conversations</p>
          <p className="text-2xl font-bold text-white">{conversations?.length || 0}</p>
          <p className="text-xs text-slate-500 mt-1">this month</p>
        </Card>

        <Card>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Status</p>
          <Badge variant={subscription?.status === 'active' || subscription?.status === 'trialing' ? 'success' : 'warning'} className="capitalize mt-1">
            {subscription?.status || 'trialing'}
          </Badge>
        </Card>
      </div>

      {(plan === 'trial' || plan === 'starter') && (
        <Card glow className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-white mb-1">Upgrade for more power 🚀</h3>
              <p className="text-sm text-slate-400">Get unlimited queries, priority support, and advanced AI features.</p>
            </div>
            <Link href="/billing"><Button>Upgrade Plan →</Button></Link>
          </div>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Recent Conversations</h3>
          <Link href="/chat"><Button variant="ghost" size="sm">New Chat →</Button></Link>
        </div>
        {!conversations?.length ? (
          <div className="text-center py-8">
            <p className="text-slate-500 text-sm">No conversations yet.</p>
            <Link href="/chat"><Button size="sm" className="mt-3">Start your first chat →</Button></Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {conversations.map(conv => (
              <Link key={conv.id} href={`/chat/${conv.id}`} className="flex items-center justify-between py-3 hover:text-indigo-400 transition-colors">
                <span className="text-sm text-slate-300 truncate">{conv.title || 'Untitled conversation'}</span>
                <span className="text-xs text-slate-600 ml-4 flex-shrink-0">{formatDate(conv.updated_at)}</span>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
