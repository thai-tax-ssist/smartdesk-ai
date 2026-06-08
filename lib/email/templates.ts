import { Resend } from 'resend';

const ADMIN_EMAIL = 'annie@smartdesk.ai';
const FROM = 'SmartDesk.ai <noreply@smartdesk.ai>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://smartdesk.ai';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function dublinTime() {
  return new Date().toLocaleString('en-IE', { timeZone: 'Europe/Dublin' });
}

// ─── EMAILS TO USERS ───────────────────────────────

export async function sendWelcomeEmail(userEmail: string, userName: string, trialEndsAt: string) {
  const resend = getResend();
  await resend.emails.send({
    from: FROM,
    to: userEmail,
    subject: 'Welcome to SmartDesk.ai 🎉 Your 14-day trial has started',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:32px;border-radius:12px">
        <h1 style="color:#6366f1;font-size:24px">Welcome to SmartDesk.ai, ${userName}! 🎉</h1>
        <p>Your 14-day free trial has started. Here's what to expect:</p>
        <ul>
          <li>50 queries included in your trial</li>
          <li>AI interview system — we ask questions before giving answers</li>
          <li>Your trial ends: <strong>${new Date(trialEndsAt).toLocaleDateString('en-IE')}</strong></li>
          <li>Your card will be charged on day 15 unless you cancel</li>
        </ul>
        <p style="margin-top:24px">
          <a href="${APP_URL}/chat" style="background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block">
            Start Your First Chat →
          </a>
        </p>
        <p style="color:#64748b;font-size:12px;margin-top:32px">
          You can cancel anytime from your <a href="${APP_URL}/billing" style="color:#6366f1">billing page</a>.
        </p>
      </div>
    `,
  });
}

export async function sendTrialReminderEmail(userEmail: string, userName: string, daysLeft: number) {
  const resend = getResend();
  await resend.emails.send({
    from: FROM,
    to: userEmail,
    subject: `⏰ Your SmartDesk.ai trial ends in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:32px;border-radius:12px">
        <h1 style="color:#f59e0b;font-size:24px">⏰ Trial ending soon, ${userName}</h1>
        <p>Your SmartDesk.ai free trial ends in <strong>${daysLeft} day${daysLeft !== 1 ? 's' : ''}</strong>.</p>
        <p>After that, you'll be charged €35.67/month (€29 + 23% VAT) for the Starter plan.</p>
        <div style="margin:24px 0">
          <a href="${APP_URL}/billing" style="background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-right:12px">
            Keep My Access →
          </a>
          <a href="${APP_URL}/billing" style="color:#64748b;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;border:1px solid #334155">
            Cancel
          </a>
        </div>
        <p style="color:#64748b;font-size:12px">No penalty for cancelling. Your access continues until your trial ends.</p>
      </div>
    `,
  });
}

export async function sendPaymentConfirmedEmail(userEmail: string, planName: string, amount: string) {
  const resend = getResend();
  await resend.emails.send({
    from: FROM,
    to: userEmail,
    subject: `✅ Payment confirmed — SmartDesk.ai ${planName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:32px;border-radius:12px">
        <h1 style="color:#10b981;font-size:24px">✅ Payment confirmed</h1>
        <p>Thank you! Your payment of <strong>${amount}</strong> for <strong>${planName}</strong> has been confirmed.</p>
        <p>A VAT invoice (23% Irish VAT) is available in your billing portal.</p>
        <p style="margin-top:24px">
          <a href="${APP_URL}/billing" style="background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block">
            View Invoice →
          </a>
        </p>
      </div>
    `,
  });
}

export async function sendPaymentFailedEmail(userEmail: string) {
  const resend = getResend();
  await resend.emails.send({
    from: FROM,
    to: userEmail,
    subject: '⚠️ Action required — Payment failed on SmartDesk.ai',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:32px;border-radius:12px">
        <h1 style="color:#ef4444;font-size:24px">⚠️ Payment failed</h1>
        <p>We couldn't process your payment for SmartDesk.ai. Your card was declined.</p>
        <p>Please update your payment method to keep your account active.</p>
        <p style="margin-top:24px">
          <a href="${APP_URL}/billing" style="background:#ef4444;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block">
            Update Payment Method →
          </a>
        </p>
        <p style="color:#64748b;font-size:12px;margin-top:16px">If you need help, reply to this email.</p>
      </div>
    `,
  });
}

export async function sendCancellationConfirmedEmail(userEmail: string, accessUntil: string) {
  const resend = getResend();
  await resend.emails.send({
    from: FROM,
    to: userEmail,
    subject: 'Subscription cancelled — SmartDesk.ai',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:32px;border-radius:12px">
        <h1 style="color:#e2e8f0;font-size:24px">Sorry to see you go</h1>
        <p>Your SmartDesk.ai subscription has been cancelled.</p>
        <p>You still have full access until: <strong>${new Date(accessUntil).toLocaleDateString('en-IE')}</strong></p>
        <p>We'd love to have you back any time.</p>
        <p style="margin-top:24px">
          <a href="${APP_URL}/billing" style="background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block">
            Reactivate →
          </a>
        </p>
      </div>
    `,
  });
}

// ─── EMAILS TO ADMIN ─────────────────────────────

export async function sendNewSignupNotification(userEmail: string, userName: string, plan: string) {
  const resend = getResend();
  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `🆕 New SmartDesk signup: ${userName} (${plan})`,
    html: `
      <h2>New Signup!</h2>
      <p><strong>Name:</strong> ${userName}</p>
      <p><strong>Email:</strong> ${userEmail}</p>
      <p><strong>Plan:</strong> ${plan}</p>
      <p><strong>Time:</strong> ${dublinTime()}</p>
      <p><a href="${APP_URL}/admin/users">View in Admin Dashboard →</a></p>
    `,
  });
}

export async function sendEscalationNotification(
  customerName: string,
  customerEmail: string,
  currentPlan: string,
  problemSummary: string,
  conversationHistory: Array<{ role: string; content: string }>,
  ticketId: string
) {
  const resend = getResend();
  const conversationHtml = conversationHistory.map(msg => `
    <div style="margin:8px 0;padding:8px 12px;border-radius:6px;background:${msg.role === 'user' ? '#1e3a5f' : '#1e293b'}">
      <strong>${msg.role === 'user' ? customerName : 'SmartDesk AI'}:</strong>
      <p style="margin:4px 0">${msg.content}</p>
    </div>
  `).join('');

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `🚨 Support escalation: ${customerName} — ${problemSummary.slice(0, 60)}`,
    html: `
      <h2>🚨 Support Escalation</h2>
      <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
      <p><strong>Plan:</strong> ${currentPlan}</p>
      <p><strong>Problem:</strong> ${problemSummary}</p>
      <p><a href="${APP_URL}/admin/tickets/${ticketId}">View Ticket →</a></p>
      <hr/>
      <h3>Conversation History</h3>
      ${conversationHtml}
    `,
  });
}

export async function sendPaymentFailureAlert(userEmail: string, amount: string) {
  const resend = getResend();
  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `💳 Payment failure alert — ${userEmail}`,
    html: `
      <h2>Payment Failure</h2>
      <p><strong>User:</strong> ${userEmail}</p>
      <p><strong>Amount:</strong> ${amount}</p>
      <p><strong>Time:</strong> ${dublinTime()}</p>
    `,
  });
}

export async function sendEarlyBirdMilestoneEmail(count: number) {
  const resend = getResend();
  const closed = count >= 100;
  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: closed
      ? '🔴 EARLY BIRD CLOSED — All 100 spots taken!'
      : `🔥 Early Bird milestone: ${count}/100 spots taken`,
    html: `
      <h2>${closed ? '🔴 Early Bird is CLOSED' : '🔥 Early Bird Milestone'}</h2>
      <p><strong>${count}/100</strong> spots taken</p>
      <p><strong>Time:</strong> ${dublinTime()}</p>
      <p><a href="${APP_URL}/admin/early-bird">Manage Early Bird →</a></p>
    `,
  });
}

export async function sendAgencyWelcomeEmail(adminEmail: string, agencyName: string) {
  const resend = getResend();
  await resend.emails.send({
    from: FROM,
    to: adminEmail,
    subject: `🎉 Your SmartDesk White Label is ready — ${agencyName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:32px;border-radius:12px">
        <h1 style="color:#6366f1">Your White Label is ready! 🎉</h1>
        <p>Hi! Your SmartDesk.ai white label account for <strong>${agencyName}</strong> has been set up.</p>
        <p>Log in to your agency dashboard to:</p>
        <ul>
          <li>Upload your logo and set brand colours</li>
          <li>Configure your custom subdomain</li>
          <li>Invite your team members</li>
        </ul>
        <p style="margin-top:24px">
          <a href="${APP_URL}/agency" style="background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block">
            Go to Agency Dashboard →
          </a>
        </p>
      </div>
    `,
  });
}
