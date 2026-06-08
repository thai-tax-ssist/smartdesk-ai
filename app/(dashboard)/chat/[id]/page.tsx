import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { Message } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ChatConversationPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: conversation } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!conversation) notFound();

  const [{ data: messages }, { data: subscription }, { data: usage }] = await Promise.all([
    supabase.from('messages').select('*').eq('conversation_id', id).order('created_at'),
    supabase.from('subscriptions').select('plan').eq('user_id', user.id).single(),
    supabase.from('usage_tracking').select('queries_used').eq('user_id', user.id).eq('month', new Date().toISOString().slice(0, 7)).single(),
  ]);

  const plan = subscription?.plan || 'trial';
  const queriesUsed = usage?.queries_used || 0;
  const queriesLimit = plan === 'pro' ? -1 : plan === 'starter' ? 200 : 50;

  return (
    <div className="h-full relative">
      <ChatInterface
        conversationId={id}
        initialMessages={(messages as Message[]) || []}
        plan={plan}
        queriesUsed={queriesUsed}
        queriesLimit={queriesLimit}
      />
    </div>
  );
}
