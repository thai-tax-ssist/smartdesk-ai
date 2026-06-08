import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

// POST: create initial user record after signup
export async function POST(req: NextRequest) {
  try {
    const { userId, email, fullName } = await req.json();
    const supabase = await createServiceClient();

    await supabase.from('users').upsert({ id: userId, email, full_name: fullName });
    await supabase.from('subscriptions').upsert({ user_id: userId });
    await supabase.from('user_profiles').upsert({ user_id: userId });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create user record' }, { status: 500 });
  }
}

// PATCH: save onboarding profile data
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { jobRole, useType, problem, goal } = await req.json();
    const service = await createServiceClient();

    await service.from('user_profiles').upsert({
      user_id: user.id,
      job_role: jobRole,
      use_type: useType,
      problem,
      goal,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
