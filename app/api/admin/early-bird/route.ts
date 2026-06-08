import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireSuperAdmin } from '@/lib/admin/auth';
import { sendEarlyBirdMilestoneEmail } from '@/lib/email/templates';

const MILESTONES = [50, 75, 90, 100];

export async function GET() {
  try {
    await requireSuperAdmin();
    const supabase = await createServiceClient();
    const { data } = await supabase.from('early_bird_counter').select('*').eq('id', 1).single();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireSuperAdmin();
    const supabase = await createServiceClient();
    const body = await req.json();

    const { data: current } = await supabase.from('early_bird_counter').select('*').eq('id', 1).single();
    const oldCount = current?.count || 0;

    const updates: Record<string, unknown> = {};
    if (body.count !== undefined) updates.count = Math.max(0, Math.min(body.count, current?.max_count || 100));
    if (body.is_open !== undefined) updates.is_open = body.is_open;

    const newCount = (updates.count as number) ?? oldCount;
    if (newCount >= (current?.max_count || 100)) updates.is_open = false;

    const { data } = await supabase.from('early_bird_counter').update(updates).eq('id', 1).select().single();

    // Check milestones
    for (const milestone of MILESTONES) {
      if (oldCount < milestone && newCount >= milestone) {
        sendEarlyBirdMilestoneEmail(newCount).catch(console.error);
        break;
      }
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

export async function incrementEarlyBirdCount() {
  const supabase = await createServiceClient();
  const { data: current } = await supabase.from('early_bird_counter').select('*').eq('id', 1).single();
  if (!current?.is_open) return current;

  const newCount = (current.count || 0) + 1;
  const closed = newCount >= (current.max_count || 100);

  const { data } = await supabase
    .from('early_bird_counter')
    .update({ count: newCount, is_open: !closed })
    .eq('id', 1)
    .select()
    .single();

  for (const milestone of [50, 75, 90, 100]) {
    if (current.count < milestone && newCount >= milestone) {
      sendEarlyBirdMilestoneEmail(newCount).catch(console.error);
      break;
    }
  }
  return data;
}
