import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createServiceClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = await createServiceClient();

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const plan = (sub.metadata?.plan || 'starter') as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const periodEnd = (sub as any).current_period_end;

        await supabase.from('subscriptions').upsert({
          stripe_customer_id: customerId,
          stripe_subscription_id: sub.id,
          plan,
          status: sub.status,
          current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'stripe_customer_id' });
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await supabase.from('subscriptions').update({
          status: 'canceled',
          updated_at: new Date().toISOString(),
        }).eq('stripe_subscription_id', sub.id);
        break;
      }
      case 'invoice.payment_succeeded': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const stripeInvoice = event.data.object as any;
        const subId = stripeInvoice.subscription as string;
        await supabase.from('subscriptions').update({
          status: 'active',
          updated_at: new Date().toISOString(),
        }).eq('stripe_subscription_id', subId);

        // Create VAT invoice record
        const amountExclVat = Math.round(stripeInvoice.amount_paid / 1.23);
        const vatAmount = stripeInvoice.amount_paid - amountExclVat;
        const customerId = stripeInvoice.customer as string;

        const { data: sub } = await supabase
          .from('subscriptions')
          .select('user_id, plan')
          .eq('stripe_subscription_id', subId)
          .single();

        if (sub?.user_id) {
          const { data: user } = await supabase
            .from('users')
            .select('email, full_name')
            .eq('id', sub.user_id)
            .single();

          await supabase.from('invoices').insert({
            user_id: sub.user_id,
            stripe_invoice_id: stripeInvoice.id,
            stripe_payment_intent_id: stripeInvoice.payment_intent,
            customer_name: user?.full_name,
            customer_email: user?.email,
            plan_name: sub.plan,
            description: `SmartDesk.ai ${sub.plan?.replace(/_/g, ' ')} Plan`,
            amount_excl_vat: amountExclVat,
            vat_rate: 0.23,
            vat_amount: vatAmount,
            amount_incl_vat: stripeInvoice.amount_paid,
            status: 'paid',
            paid_at: new Date().toISOString(),
          });
        }
        void customerId;
        break;
      }
      case 'invoice.payment_failed': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as any;
        const subId = invoice.subscription as string;
        await supabase.from('subscriptions').update({
          status: 'past_due',
          updated_at: new Date().toISOString(),
        }).eq('stripe_subscription_id', subId);
        break;
      }
      case 'checkout.session.completed': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = event.data.object as any;
        const userId = session.metadata?.user_id;
        const customerId = session.customer as string;
        if (userId && customerId) {
          await supabase.from('subscriptions').update({
            stripe_customer_id: customerId,
            card_collected: true,
            updated_at: new Date().toISOString(),
          }).eq('user_id', userId);
        }
        break;
      }
    }
  } catch (e) {
    console.error('Webhook error:', e);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
