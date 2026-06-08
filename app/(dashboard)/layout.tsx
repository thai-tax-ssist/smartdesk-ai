import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/layout/Sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const [{ data: conversations }, { data: usage }, { data: subscription }, { data: profile }] = await Promise.all([
    supabase.from('conversations').select('id, title, created_at').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(20),
    supabase.from('usage_tracking').select('queries_used').eq('user_id', user.id).eq('month', new Date().toISOString().slice(0, 7)).single(),
    supabase.from('subscriptions').select('plan, status').eq('user_id', user.id).single(),
    supabase.from('users').select('full_name, email').eq('id', user.id).single(),
  ]);

  const plan = subscription?.plan || 'trial';
  const queriesUsed = usage?.queries_used || 0;
  const queriesLimit = plan === 'pro' ? -1 : plan === 'starter' ? 200 : 50;

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar
        conversations={conversations || []}
        queriesUsed={queriesUsed}
        queriesLimit={queriesLimit}
        userName={profile?.full_name || undefined}
        userEmail={profile?.email || user.email}
        plan={plan}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
