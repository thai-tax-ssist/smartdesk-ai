import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { anthropic, INTERVIEW_SYSTEM_PROMPT } from '@/lib/claude/client';
import { getCurrentMonth } from '@/lib/utils';
import { Message } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { content, conversationId, messages: prevMessages } = await req.json();
    const service = await createServiceClient();

    // Check query limit
    const [{ data: subscription }, { data: usage }, { data: profile }] = await Promise.all([
      service.from('subscriptions').select('plan').eq('user_id', user.id).single(),
      service.from('usage_tracking').select('queries_used').eq('user_id', user.id).eq('month', getCurrentMonth()).single(),
      service.from('user_profiles').select('*').eq('user_id', user.id).single(),
    ]);

    const plan = subscription?.plan || 'trial';
    const limit = plan === 'pro' ? -1 : plan === 'starter' ? 200 : 50;
    const used = usage?.queries_used || 0;

    if (limit !== -1 && used >= limit) {
      return NextResponse.json({ error: 'Query limit reached' }, { status: 429 });
    }

    // Get or create conversation
    let convId = conversationId;
    if (!convId) {
      const { data: conv } = await service.from('conversations').insert({
        user_id: user.id,
        title: content.slice(0, 60),
      }).select('id').single();
      convId = conv?.id;
    }

    // Save user message
    const { data: userMsg } = await service.from('messages').insert({
      conversation_id: convId,
      role: 'user',
      content,
      message_type: 'chat',
    }).select('id').single();

    // Build message history for Claude
    const history = (prevMessages || []).map((m: Message) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    // Determine interview stage
    const assistantMessages = (prevMessages || []).filter((m: Message) => m.role === 'assistant');
    const questionCount = assistantMessages.filter((m: Message) => m.message_type === 'interview_question').length;
    const hasFinalAnswer = (prevMessages || []).some((m: Message) => m.message_type === 'final_answer');

    let messageType: 'interview_question' | 'final_answer' | 'chat' = 'interview_question';
    if (hasFinalAnswer || questionCount >= 4) {
      messageType = 'chat';
    } else if (questionCount >= 3) {
      messageType = 'final_answer';
    }

    const userProfileContext = profile
      ? `Job role: ${profile.job_role || 'Not specified'}. Use type: ${profile.use_type || 'Not specified'}. Problem: ${profile.problem || 'Not specified'}. Goal: ${profile.goal || 'Not specified'}.`
      : 'No profile data available.';

    const systemPrompt = INTERVIEW_SYSTEM_PROMPT.replace('{userProfile}', userProfileContext);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [...history, { role: 'user', content }],
    });

    const aiContent = response.content[0].type === 'text' ? response.content[0].text : '';

    // Save AI message
    const { data: aiMsg } = await service.from('messages').insert({
      conversation_id: convId,
      role: 'assistant',
      content: aiContent,
      message_type: messageType,
    }).select('id').single();

    // Update usage
    await service.from('usage_tracking').upsert({
      user_id: user.id,
      month: getCurrentMonth(),
      queries_used: used + 1,
    }, { onConflict: 'user_id,month' });

    // Update conversation timestamp
    await service.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', convId);

    return NextResponse.json({
      id: aiMsg?.id,
      userMessageId: userMsg?.id,
      content: aiContent,
      message_type: messageType,
      conversationId: convId,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Something went wrong. Please try again in a moment.' }, { status: 500 });
  }
}
