import { NextRequest, NextResponse } from 'next/server'
import { getAnthropicClient, BUILDER_SYSTEM_PROMPT } from '@/lib/anthropic'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const adminSecret = req.headers.get('x-admin-secret')
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { orderId, brief } = await req.json()

  const supabase = createServiceClient()

  let orderBrief = brief
  if (orderId && !brief) {
    const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single()
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    orderBrief = `Platform: ${order.platform}\nPackage: ${order.package_id}\nRequirement: ${order.requirement_brief}`

    await supabase.from('orders').update({ status: 'building' }).eq('id', orderId)
  }

  if (!orderBrief) {
    return NextResponse.json({ error: 'No brief provided' }, { status: 400 })
  }

  try {
    const response = await getAnthropicClient().messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: BUILDER_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: orderBrief }],
    })

    const rawText = response.content[0].type === 'text' ? response.content[0].text : '{}'
    let output
    try {
      output = JSON.parse(rawText)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON from AI', raw: rawText }, { status: 500 })
    }

    if (orderId) {
      await supabase.from('orders').update({ document_output: output, status: 'qc' }).eq('id', orderId)
    }

    return NextResponse.json({ output })
  } catch (error) {
    console.error('Build error:', error)
    return NextResponse.json({ error: 'Build failed' }, { status: 500 })
  }
}
