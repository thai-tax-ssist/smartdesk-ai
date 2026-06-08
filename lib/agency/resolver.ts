const cache = new Map<string, { agency: AgencyData | null; expiresAt: number }>();

interface AgencyData {
  id: string;
  name: string;
  logo_url?: string;
  primary_color?: string;
  custom_domain?: string;
  welcome_message?: string;
  ai_personality?: string;
}

export async function resolveAgencyFromHostname(hostname: string): Promise<AgencyData | null> {
  const cached = cache.get(hostname);
  if (cached && cached.expiresAt > Date.now()) return cached.agency;

  try {
    const { createServiceClient } = await import('@/lib/supabase/server');
    const supabase = await createServiceClient();

    const subdomain = hostname.replace('.smartdesk.ai', '');

    const { data } = await supabase
      .from('white_label_settings')
      .select('agency_id, logo_url, primary_color, custom_domain, welcome_message, ai_personality, agencies(id, name)')
      .eq('custom_domain', subdomain)
      .single();

    const agency: AgencyData | null = data
      ? {
          id: data.agency_id,
          name: (data.agencies as unknown as { name: string } | null)?.name || subdomain,
          logo_url: data.logo_url || undefined,
          primary_color: data.primary_color || undefined,
          custom_domain: data.custom_domain || undefined,
          welcome_message: data.welcome_message || undefined,
          ai_personality: data.ai_personality || undefined,
        }
      : null;

    cache.set(hostname, { agency, expiresAt: Date.now() + 5 * 60 * 1000 });
    return agency;
  } catch {
    return null;
  }
}
