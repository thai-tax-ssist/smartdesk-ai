import { createServiceClient } from '@/lib/supabase/server';

export async function exportUserData(userId: string) {
  const supabase = await createServiceClient();

  const [
    { data: profile },
    { data: user },
    { data: conversations },
    { data: subscription },
    { data: usage },
    { data: invoices },
  ] = await Promise.all([
    supabase.from('user_profiles').select('*').eq('user_id', userId).single(),
    supabase.from('users').select('id, email, full_name, role, created_at').eq('id', userId).single(),
    supabase.from('conversations').select('*, messages(*)').eq('user_id', userId),
    supabase.from('subscriptions').select('*').eq('user_id', userId),
    supabase.from('usage_tracking').select('*').eq('user_id', userId),
    supabase.from('invoices').select('invoice_number, plan_name, amount_incl_vat, status, issued_at').eq('user_id', userId),
  ]);

  return {
    exported_at: new Date().toISOString(),
    user,
    profile,
    conversations: conversations || [],
    subscription,
    usage: usage || [],
    invoices: invoices || [],
    notice: 'This export contains all personal data SmartDesk.ai holds about you, as required by GDPR Article 20 (Right to Data Portability).',
  };
}
