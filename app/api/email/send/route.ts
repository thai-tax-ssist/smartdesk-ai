import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/admin/auth';
import {
  sendWelcomeEmail,
  sendTrialReminderEmail,
  sendEarlyBirdMilestoneEmail,
} from '@/lib/email/templates';

export async function POST(req: NextRequest) {
  try {
    await requireSuperAdmin();
    const { type, email, name, data } = await req.json();

    switch (type) {
      case 'welcome':
        await sendWelcomeEmail(email, name, data?.trialEndsAt ?? new Date(Date.now() + 14 * 86400000).toISOString());
        break;
      case 'trial_reminder':
        await sendTrialReminderEmail(email, name, data?.daysLeft ?? 3);
        break;
      case 'early_bird_milestone':
        await sendEarlyBirdMilestoneEmail(data?.count ?? 0);
        break;
      default:
        return NextResponse.json({ error: 'Unknown email type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
