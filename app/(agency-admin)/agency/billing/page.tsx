import { createServiceClient } from '@/lib/supabase/server';
import { getAdminRole } from '@/lib/admin/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const PLAN_NAMES: Record<string, string> = {
  white_label_early_bird: 'White Label Early Bird',
  white_label: 'White Label',
};

const PLAN_PRICES: Record<string, number> = {
  white_label_early_bird: 249,
  white_label: 349,
};

export default async function AgencyBillingPage() {
  const { userId } = await getAdminRole();
  const supabase = await createServiceClient();

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId!)
    .single();

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Billing</h1>
        <p className="text-gray-400 mt-1">Your agency subscription</p>
      </div>

      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        {sub ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-white">{PLAN_NAMES[sub.plan] || sub.plan}</p>
                <p className="text-gray-400 text-sm">€{PLAN_PRICES[sub.plan] || 0}/month + VAT</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${sub.status === 'active' ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'}`}>
                {sub.status}
              </span>
            </div>
            <div className="pt-4 border-t border-gray-800">
              <form action="/api/stripe/create-portal" method="POST">
                <button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Manage Billing
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No active subscription found.</p>
            <Link href="/billing" className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              View Plans
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
