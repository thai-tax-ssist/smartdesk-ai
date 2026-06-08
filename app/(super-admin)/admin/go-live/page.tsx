'use client';

import { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

const SECTIONS = [
  {
    title: 'Stripe Setup',
    items: [
      'Created Stripe account (live mode)',
      'Created product: Starter (€29/month)',
      'Created product: Pro (€79/month)',
      'Created product: Early Bird White Label (€249/month)',
      'Created product: White Label (€349/month)',
      'Created one-time price: WL Setup Fee (€500)',
      'Copied all Price IDs to Vercel env variables',
      'Configured Stripe webhook: https://smartdesk.ai/api/stripe/webhook',
      'Webhook events: customer.subscription.*, invoice.*, checkout.session.completed',
      'Copied webhook signing secret to STRIPE_WEBHOOK_SECRET',
      'EU VAT configured in Stripe',
    ],
  },
  {
    title: 'Supabase Setup',
    items: [
      'Project created in EU region (eu-west-1)',
      'Phase 1 schema SQL run',
      'Phase 2 RLS policies SQL run',
      'Phase 3 invoices + email_logs tables SQL run',
      'Google OAuth configured in Supabase Auth',
      'agency-logos storage bucket created',
      'Your account promoted to super_admin',
      'Tested: RLS prevents agency seeing other agency data',
      'Supabase URL + anon key + service role key in Vercel env',
    ],
  },
  {
    title: 'Resend Email Setup',
    items: [
      'Resend account created',
      'Domain verified: smartdesk.ai',
      'DNS records added: SPF, DKIM, DMARC',
      'Test email sent from noreply@smartdesk.ai ✅',
      'All email templates tested',
      'RESEND_API_KEY added to Vercel env',
    ],
  },
  {
    title: 'Vercel Setup',
    items: [
      'Project connected to GitHub repo',
      'All environment variables set',
      'Domain smartdesk.ai added',
      'Wildcard *.smartdesk.ai added',
      'Dublin region (dub1) selected',
      'Cron job working: /api/cron/trial-reminders',
      'Deployment succeeded with no errors',
    ],
  },
  {
    title: 'Legal & GDPR',
    items: [
      'Privacy Policy reviewed and approved',
      'Terms of Service reviewed and approved',
      'Cookie Policy reviewed and approved',
      'Cookie banner showing on homepage',
      'GDPR delete account flow tested',
      'Data export (Right of Access) working',
      'Irish VAT number added to invoices (when registered)',
    ],
  },
  {
    title: 'SEO & Launch',
    items: [
      'Google Search Console verified',
      'Sitemap submitted to Google',
      'OG image uploaded (/public/og-image.png)',
      'Test all pages on mobile (iOS + Android)',
      'Test all pages in Chrome, Safari, Firefox',
      'Lighthouse score > 90 on landing page',
    ],
  },
  {
    title: 'Functionality Test',
    items: [
      'Sign up flow (email + Google OAuth)',
      'Free trial starts, card collected',
      'Onboarding 2-step flow saves to DB',
      'Chat interface: AI asks questions before answering',
      'Query counter decrements correctly',
      'Trial reminder email sends at day 11',
      'Trial gate shows at day 15',
      'Upgrade to Starter plan via Stripe',
      'Invoice generates after payment',
      'PDF invoice downloads correctly with VAT',
      'Support widget (Alex) responds',
      'Escalation email sends to admin',
      'Super admin dashboard shows data',
      'Agency admin can customise branding',
      'White Label wizard completes all 6 steps',
      'Subdomain routing works',
      'Cancel subscription flow works',
      'GDPR account deletion works',
    ],
  },
  {
    title: 'Environment Variables',
    items: [
      'ANTHROPIC_API_KEY',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      'STRIPE_STARTER_PRICE_ID',
      'STRIPE_PRO_PRICE_ID',
      'STRIPE_WHITE_LABEL_EARLY_BIRD_PRICE_ID',
      'STRIPE_WHITE_LABEL_PRICE_ID',
      'NEXT_PUBLIC_APP_URL=https://smartdesk.ai',
      'RESEND_API_KEY',
      'CRON_SECRET',
      'NEXT_PUBLIC_APP_NAME=SmartDesk.ai',
      'ADMIN_EMAIL',
    ],
  },
];

export default function GoLivePage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const stored = localStorage.getItem('go-live-checklist');
    if (stored) setChecked(JSON.parse(stored));
  }, []);

  function toggle(key: string) {
    setChecked(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem('go-live-checklist', JSON.stringify(next));
      return next;
    });
  }

  const total = SECTIONS.reduce((sum, s) => sum + s.items.length, 0);
  const done = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);

  function exportPdf() {
    window.print();
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>Go-Live Checklist</h1>
          <p className="text-gray-400 mt-1">Pre-launch checklist for SmartDesk.ai production deployment</p>
        </div>
        <button onClick={exportPdf} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          Export PDF
        </button>
      </div>

      {/* Progress */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-semibold">{done} / {total} complete</span>
          <span className="text-violet-400 font-bold">{pct}%</span>
        </div>
        <div className="bg-gray-800 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        {pct === 100 && (
          <p className="text-green-400 font-semibold mt-3 text-center">🚀 Ready to launch!</p>
        )}
      </div>

      {/* DNS Setup Info */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h2 className="text-lg font-semibold text-white mb-4">Wildcard Domain DNS Setup</h2>
        <div className="font-mono text-xs bg-gray-950 rounded-xl p-4 space-y-1 text-gray-300">
          <p className="text-gray-400 mb-2"># Cloudflare / DNS provider:</p>
          <p>A     @    →  76.76.21.21</p>
          <p>CNAME www  →  cname.vercel-dns.com</p>
          <p>CNAME *    →  cname.vercel-dns.com  <span className="text-yellow-400"># wildcard — set to DNS only (grey cloud)</span></p>
        </div>
        <p className="text-xs text-gray-500 mt-3">Vercel handles SSL for wildcards automatically. Propagation: 1–24 hours.</p>
      </div>

      {/* Checklist sections */}
      {SECTIONS.map(section => {
        const sectionDone = section.items.filter(item => checked[`${section.title}:${item}`]).length;
        return (
          <div key={section.title} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">{section.title}</h2>
              <span className="text-xs text-gray-400">{sectionDone}/{section.items.length}</span>
            </div>
            <div className="space-y-2">
              {section.items.map(item => {
                const key = `${section.title}:${item}`;
                return (
                  <label key={item} className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={!!checked[key]}
                      onChange={() => toggle(key)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-600 bg-gray-800 text-violet-600 focus:ring-violet-500 cursor-pointer"
                    />
                    <span className={`text-sm transition-colors ${checked[key] ? 'text-gray-500 line-through' : 'text-gray-300 group-hover:text-white'}`}>
                      {item}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
