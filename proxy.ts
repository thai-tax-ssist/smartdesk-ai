import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

async function getUserRole(request: NextRequest): Promise<{ role: string | null; userId: string | null }> {
  try {
    let role: string | null = null;
    let userId: string | null = null;

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll() {},
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { role: null, userId: null };

    userId = user.id;

    const supabaseService = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll() {},
        },
      }
    );

    const { data } = await supabaseService
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    role = data?.role || null;
    return { role, userId };
  } catch {
    return { role: null, userId: null };
  }
}

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const hostname = request.headers.get('host') || '';

  // ── Subdomain routing ──────────────────────────────────────
  const isSubdomain = hostname.endsWith('.smartdesk.ai') && !hostname.startsWith('www.') && hostname !== 'smartdesk.ai';
  if (isSubdomain) {
    const subdomain = hostname.replace('.smartdesk.ai', '');
    const response = NextResponse.next();
    response.headers.set('x-agency-subdomain', subdomain);
    return response;
  }

  // ── Session refresh (Supabase SSR) ─────────────────────────
  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const protectedRoutes = ['/chat', '/dashboard', '/billing', '/onboarding'];
  const authRoutes = ['/login', '/signup'];
  const adminRoutes = ['/admin'];
  const agencyRoutes = ['/agency'];

  const isProtected = protectedRoutes.some(r => pathname.startsWith(r));
  const isAuthRoute = authRoutes.some(r => pathname.startsWith(r));
  const isAdminRoute = adminRoutes.some(r => pathname.startsWith(r));
  const isAgencyRoute = agencyRoutes.some(r => pathname.startsWith(r));

  if (!user && (isProtected || isAdminRoute || isAgencyRoute)) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // ── Role checks ────────────────────────────────────────────
  if (user && (isAdminRoute || isAgencyRoute)) {
    const { role } = await getUserRole(request);

    if (isAdminRoute && role !== 'super_admin') {
      url.pathname = '/dashboard';
      url.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(url);
    }

    if (isAgencyRoute && role !== 'agency_admin' && role !== 'super_admin') {
      url.pathname = '/dashboard';
      url.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(url);
    }
  }

  // ── Onboarding check ───────────────────────────────────────
  if (user && isProtected && pathname !== '/onboarding') {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('onboarding_completed')
      .eq('user_id', user.id)
      .single();

    if (!profile?.onboarding_completed) {
      url.pathname = '/onboarding';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
