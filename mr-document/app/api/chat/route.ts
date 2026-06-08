import { NextRequest, NextResponse } from 'next/server'
import { getAnthropicClient, SHAY_SYSTEM_PROMPT } from '@/lib/anthropic'
import { createServiceClient } from '@/lib/supabase'

const rateLimitMap = new Map<string, { count: number; reset: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + 60_000 })
    return true
  }
  if (entry.count >= 10) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  const { messages, sessionId } = await req.json()

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  try {
    const response = await getAnthropicClient().messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system: SHAY_SYSTEM_PROMPT,
      messages: messages.slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    })

    const content = response.content[0].type === 'text' ? response.content[0].text : ''

    if (sessionId) {
      try {
        const supabase = createServiceClient()
        const { data: existing } = await supabase
          .from('chat_sessions')
          .select('id')
          .eq('session_id', sessionId)
          .single()

        if (existing) {
          await supabase
            .from('chat_sessions')
            .update({ messages })
            .eq('session_id', sessionId)
        } else {
          await supabase.from('chat_sessions').insert({ session_id: sessionId, messages })
        }
      } catch {
        // Non-critical
      }
    }

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'AI unavailable' }, { status: 500 })
  }
}
