import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { sendTrialReminderEmail } from '@/lib/email/templates';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createServiceClient();

  // Find trials ending in exactly 3 days
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 3);
  const dateStr = targetDate.toISOString().slice(0, 10);

  const { data: subs } = await supabase
    .from('subscriptions')
    .select('user_id, trial_ends_at')
    .eq('status', 'trialing')
    .gte('trial_ends_at', `${dateStr}T00:00:00Z`)
    .lt('trial_ends_at', `${dateStr}T23:59:59Z`);

  if (!subs || subs.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const userIds = subs.map(s => s.user_id);
  const { data: users } = await supabase
    .from('users')
    .select('id, email, full_name')
    .in('id', userIds);

  let sent = 0;
  const logs = [];

  for (const user of users || []) {
    try {
      await sendTrialReminderEmail(user.email, user.full_name || 'there', 3);
      logs.push({ user_id: user.id, email_type: 'trial_reminder', success: true });
      sent++;
    } catch (err) {
      logs.push({ user_id: user.id, email_type: 'trial_reminder', success: false, error_message: String(err) });
    }
  }

  if (logs.length > 0) {
    await supabase.from('email_logs').insert(logs);
  }

  return NextResponse.json({ sent });
}
