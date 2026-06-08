import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase'
import { sendWelcomeEmail, sendNewOrderNotification } from '@/lib/resend'
import { PACKAGES } from '@/lib/stripe'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServiceClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const packageId = session.metadata?.packageId || ''
    const pkg = PACKAGES[packageId as keyof typeof PACKAGES]

    const orderData = {
      client_email: session.customer_email || session.customer_details?.email || '',
      client_name: session.customer_details?.name || '',
      package_id: packageId,
      platform: pkg?.platform || 'google',
      stripe_payment_id: session.payment_intent as string,
      stripe_session_id: session.id,
      amount_paid: session.amount_total || 0,
      requirement_brief: session.metadata?.brief || '',
      status: 'new',
    }

    const { data: order, error } = await supabase.from('orders').insert(orderData).select().single()

    if (error) {
      console.error('Failed to insert order:', error)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    // Send emails
    const amount = (session.amount_total || 0) / 100
    await Promise.allSettled([
      sendWelcomeEmail({
        to: orderData.client_email,
        name: orderData.client_name || 'there',
        packageName: pkg?.name || packageId,
        amount,
        orderId: order.id,
      }),
      sendNewOrderNotification({
        clientEmail: orderData.client_email,
        packageName: pkg?.name || packageId,
        platform: pkg?.platform || 'unknown',
        amount,
        brief: orderData.requirement_brief,
        orderId: order.id,
      }),
    ])
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('stripe_subscription_id', sub.id)
  }

  return NextResponse.json({ received: true })
}
