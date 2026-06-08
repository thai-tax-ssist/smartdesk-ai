import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/client';
import { PLANS } from '@/lib/stripe/plans';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.redirect(new URL('/login', req.url));

    const body = req.headers.get('content-type')?.includes('application/json')
      ? await req.json()
      : Object.fromEntries(await req.formData());
    const plan = (body.plan as string) || 'starter';

    const service = await createServiceClient();
    const { data: subscription } = await service.from('subscriptions').select('stripe_customer_id').eq('user_id', user.id).single();

    const planConfig = PLANS[plan as keyof typeof PLANS] as { stripePriceId?: string | null };
    if (!planConfig?.stripePriceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      customer: subscription?.stripe_customer_id || undefined,
      customer_email: subscription?.stripe_customer_id ? undefined : user.email,
      mode: 'subscription',
      line_items: [{
        price: planConfig.stripePriceId,
        quantity: 1,
      }],
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      success_url: `${appUrl}/billing?success=true`,
      cancel_url: `${appUrl}/billing`,
      metadata: { user_id: user.id, plan },
    });

    return NextResponse.redirect(session.url!, 303);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
