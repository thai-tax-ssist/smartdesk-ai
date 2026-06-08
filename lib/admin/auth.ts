import { createServiceClient } from '@/lib/supabase/server';

export type AdminRole = 'super_admin' | 'agency_admin' | null;

export async function getAdminRole(): Promise<{ role: AdminRole; agencyId: string | null; userId: string | null }> {
  try {
    const supabase = await createServiceClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { role: null, agencyId: null, userId: null };

    const { data } = await supabase
      .from('users')
      .select('role, agency_id')
      .eq('id', user.id)
      .single();

    return {
      role: (data?.role as AdminRole) || null,
      agencyId: data?.agency_id || null,
      userId: user.id,
    };
  } catch {
    return { role: null, agencyId: null, userId: null };
  }
}

export async function requireSuperAdmin() {
  const { role } = await getAdminRole();
  if (role !== 'super_admin') throw new Error('Forbidden');
  return true;
}

export async function requireAgencyAdmin() {
  const { role, agencyId } = await getAdminRole();
  if (role !== 'agency_admin' && role !== 'super_admin') throw new Error('Forbidden');
  return { agencyId };
}
