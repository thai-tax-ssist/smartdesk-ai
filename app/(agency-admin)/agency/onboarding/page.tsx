import { createServiceClient } from '@/lib/supabase/server';
import { getAdminRole } from '@/lib/admin/auth';
import { WhiteLabelWizard } from '@/components/onboarding/WhiteLabelWizard';

export const dynamic = 'force-dynamic';

export default async function AgencyOnboardingPage() {
  const { agencyId } = await getAdminRole();
  const supabase = await createServiceClient();

  const [{ data: agency }, { data: wl }] = await Promise.all([
    supabase.from('agencies').select('name').eq('id', agencyId!).single(),
    supabase.from('white_label_settings').select('*').eq('agency_id', agencyId!).single(),
  ]);

  return (
    <WhiteLabelWizard
      agencyName={agency?.name || 'Your Agency'}
      initialData={wl || {}}
    />
  );
}
