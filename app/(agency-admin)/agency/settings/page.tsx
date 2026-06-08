import { createServiceClient } from '@/lib/supabase/server';
import { getAdminRole } from '@/lib/admin/auth';
import BrandCustomizer from '@/components/agency/BrandCustomizer';

export const dynamic = 'force-dynamic';

export default async function AgencySettingsPage() {
  const { agencyId } = await getAdminRole();
  const supabase = await createServiceClient();

  const [{ data: agency }, { data: wl }] = await Promise.all([
    supabase.from('agencies').select('*').eq('id', agencyId!).single(),
    supabase.from('white_label_settings').select('*').eq('agency_id', agencyId!).single(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Brand Settings</h1>
        <p className="text-gray-400 mt-1">Customise your white label platform</p>
      </div>
      <BrandCustomizer agency={agency} whiteLabelSettings={wl} />
    </div>
  );
}
