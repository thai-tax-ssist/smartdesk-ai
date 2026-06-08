import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { sendDocumentDeliveredEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const adminSecret = req.headers.get('x-admin-secret') || req.cookies.get('admin_token')?.value
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { orderId, documentLink } = await req.json()

  const supabase = createServiceClient()
  const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single()
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  await supabase.from('orders').update({ status: 'delivered', document_link: documentLink }).eq('id', orderId)

  const output = order.document_output as { title?: string; guideContent?: string } | null
  await supabase.from('documents').insert({
    order_id: orderId,
    client_email: order.client_email,
    title: output?.title || order.package_id,
    document_type: order.package_id,
    platform: order.platform,
    document_link: documentLink,
    claude_output: order.document_output,
    delivered_at: new Date().toISOString(),
  })

  await sendDocumentDeliveredEmail({
    to: order.client_email,
    name: order.client_name || 'there',
    title: output?.title || 'Your document',
    link: documentLink,
    guide: output?.guideContent,
  })

  return NextResponse.json({ success: true })
}
