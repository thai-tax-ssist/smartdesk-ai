import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/client';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const serviceClient = await createServiceClient();

    // Get subscription to cancel in Stripe
    const { data: sub } = await serviceClient
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', user.id)
      .single();

    // Cancel Stripe subscription immediately
    if (sub?.stripe_subscription_id) {
      try {
        await stripe.subscriptions.cancel(sub.stripe_subscription_id);
      } catch (err) {
        console.error('Stripe cancel error:', err);
      }
    }

    // Delete user data (cascade handles messages via conversations)
    await Promise.all([
      serviceClient.from('conversations').delete().eq('user_id', user.id),
      serviceClient.from('usage_tracking').delete().eq('user_id', user.id),
      serviceClient.from('subscriptions').delete().eq('user_id', user.id),
      serviceClient.from('user_profiles').delete().eq('user_id', user.id),
    ]);

    // Delete from users table
    await serviceClient.from('users').delete().eq('id', user.id);

    // Delete Supabase auth user
    await serviceClient.auth.admin.deleteUser(user.id);

    return NextResponse.json({ success: true, message: 'Account deleted within 30 days per GDPR' });
  } catch (err) {
    console.error('Delete account error:', err);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
