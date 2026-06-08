import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ChatInterface } from '@/components/chat/ChatInterface';

export default async function ChatPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: subscription }, { data: usage }] = await Promise.all([
    supabase.from('subscriptions').select('plan').eq('user_id', user.id).single(),
    supabase.from('usage_tracking').select('queries_used').eq('user_id', user.id).eq('month', new Date().toISOString().slice(0, 7)).single(),
  ]);

  const plan = subscription?.plan || 'trial';
  const queriesUsed = usage?.queries_used || 0;
  const queriesLimit = plan === 'pro' ? -1 : plan === 'starter' ? 200 : 50;

  return (
    <div className="h-full relative">
      <ChatInterface plan={plan} queriesUsed={queriesUsed} queriesLimit={queriesLimit} />
    </div>
  );
}
