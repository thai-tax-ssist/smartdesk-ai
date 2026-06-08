import { NextRequest, NextResponse } from 'next/server';
import { anthropic, SUPPORT_WIDGET_PROMPT } from '@/lib/claude/client';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    let userContext = 'Anonymous visitor';
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: sub } = await supabase.from('subscriptions').select('plan, status').eq('user_id', user.id).single();
        userContext = `Logged in user. Plan: ${sub?.plan || 'unknown'}. Status: ${sub?.status || 'unknown'}.`;
      }
    } catch {}

    const systemPrompt = SUPPORT_WIDGET_PROMPT.replace('{userContext}', userContext);

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ content: 'Something went wrong. Please try again in a moment.' });
  }
}
