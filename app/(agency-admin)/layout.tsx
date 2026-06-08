import { redirect } from 'next/navigation';
import { getAdminRole } from '@/lib/admin/auth';
import { AgencyNav } from '@/components/agency/AgencyNav';
import { createServiceClient } from '@/lib/supabase/server';

export default async function AgencyAdminLayout({ children }: { children: React.ReactNode }) {
  const { role, agencyId, userId } = await getAdminRole();
  if (role !== 'agency_admin' && role !== 'super_admin') redirect('/dashboard');

  const supabase = await createServiceClient();
  const [{ data: user }, { data: agency }, { data: wl }] = await Promise.all([
    supabase.from('users').select('full_name, email').eq('id', userId!).single(),
    supabase.from('agencies').select('name').eq('id', agencyId!).single(),
    supabase.from('white_label_settings').select('logo_url, primary_color').eq('agency_id', agencyId!).single(),
  ]);

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <AgencyNav
        agencyName={agency?.name}
        logoUrl={wl?.logo_url}
        userName={user?.full_name}
        userEmail={user?.email}
      />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
