import { redirect } from 'next/navigation';
import { getAdminRole } from '@/lib/admin/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { createServiceClient } from '@/lib/supabase/server';

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const { role, userId } = await getAdminRole();
  if (role !== 'super_admin') redirect('/dashboard');

  const supabase = await createServiceClient();
  const { data: user } = await supabase.from('users').select('full_name, email').eq('id', userId!).single();

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <AdminSidebar userName={user?.full_name} userEmail={user?.email} />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
