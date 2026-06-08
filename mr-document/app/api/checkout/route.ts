import { NextRequest, NextResponse } from 'next/server'
import { getStripe, getStripePrice, PACKAGES } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const { packageId, brief, email } = await req.json()

  if (!packageId || !PACKAGES[packageId as keyof typeof PACKAGES]) {
    return NextResponse.json({ error: 'Invalid package' }, { status: 400 })
  }

  const pkg = PACKAGES[packageId as keyof typeof PACKAGES]
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mrdocument.ie'

  try {
    const priceId = getStripePrice(packageId)
    const session = await getStripe().checkout.sessions.create({
      mode: pkg.interval === 'month' ? 'subscription' : 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/#pricing`,
      customer_email: email,
      metadata: { packageId, brief: brief || '' },
      billing_address_collection: 'required',
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
