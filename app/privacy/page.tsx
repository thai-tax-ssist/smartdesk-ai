import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — SmartDesk.ai',
  description: 'How SmartDesk.ai collects, uses, and protects your personal data under GDPR.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-violet-400 hover:text-violet-300 text-sm mb-8 inline-block">← SmartDesk.ai</Link>
        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-12">Last updated: June 2025</p>

        <div className="prose prose-invert max-w-none space-y-10">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Who We Are</h2>
            <p>SmartDesk.ai is an AI-powered interview and advisory platform for Irish and European businesses. We are based in Ireland and operate as a data controller under GDPR.</p>
            <p className="mt-2">Contact: <a href="mailto:privacy@smartdesk.ai" className="text-violet-400">privacy@smartdesk.ai</a></p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Data We Collect</h2>
            <ul className="space-y-2 list-none pl-0">
              {[
                ['Account data', 'Name, email address, hashed password'],
                ['Profile data', 'Job role, use type, business goals (collected during onboarding)'],
                ['Usage data', 'Queries used, conversation history, timestamps'],
                ['Payment data', 'Handled entirely by Stripe — we store only your plan and subscription status. We never see or store your card number.'],
                ['Technical data', 'IP address, browser type, device info (used for security only, never sold)'],
              ].map(([title, desc]) => (
                <li key={title} className="flex gap-3">
                  <span className="text-violet-400 font-medium w-32 shrink-0">{title}:</span>
                  <span>{desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Data</h2>
            <ul className="space-y-1 list-disc pl-5">
              <li>To provide the SmartDesk.ai service you signed up for</li>
              <li>To improve AI response quality (in aggregate, never personally identified)</li>
              <li>To send service emails (billing receipts, trial reminders, account updates)</li>
              <li>To prevent fraud and ensure platform security</li>
              <li>To comply with Irish and EU law</li>
              <li>Marketing emails only with your explicit consent (opt-in)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Legal Basis (GDPR Article 6)</h2>
            <ul className="space-y-1 list-disc pl-5">
              <li><strong className="text-white">Contract:</strong> To deliver the service you paid for</li>
              <li><strong className="text-white">Legitimate interests:</strong> Security, fraud prevention, service improvement</li>
              <li><strong className="text-white">Legal obligation:</strong> Tax records, compliance with Irish law</li>
              <li><strong className="text-white">Consent:</strong> Marketing communications (opt-in only, withdraw any time)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Data Storage & Retention</h2>
            <ul className="space-y-1 list-disc pl-5">
              <li>All data stored in the EU (Supabase EU region — Ireland/eu-west-1)</li>
              <li>Conversation data retained for 24 months then automatically deleted</li>
              <li>Account data deleted within 30 days of a deletion request</li>
              <li>Financial records kept for 7 years as required by Irish Revenue law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Your Rights Under GDPR</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="space-y-1 list-disc pl-5">
              <li><strong className="text-white">Access</strong> your personal data (we&apos;ll provide a JSON export)</li>
              <li><strong className="text-white">Correct</strong> inaccurate data via your account settings</li>
              <li><strong className="text-white">Delete</strong> your data (&ldquo;Right to be Forgotten&rdquo;) via account settings</li>
              <li><strong className="text-white">Portability</strong> — export your data in machine-readable format</li>
              <li><strong className="text-white">Object</strong> to certain processing</li>
              <li><strong className="text-white">Withdraw consent</strong> for marketing at any time</li>
            </ul>
            <p className="mt-3">To exercise any right: email <a href="mailto:privacy@smartdesk.ai" className="text-violet-400">privacy@smartdesk.ai</a> or use your account settings. We respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Third-Party Services</h2>
            <div className="space-y-2">
              {[
                ['Anthropic', 'Claude AI API — processes your queries to generate responses. Data processed under EU Standard Contractual Clauses (SCCs).'],
                ['Stripe', 'Payment processing. PCI DSS Level 1 compliant. Stripe&apos;s privacy policy applies to payment data.'],
                ['Supabase', 'Database hosting. EU region (Ireland). SOC 2 Type II certified.'],
                ['Resend', 'Transactional email delivery. EU data processing available.'],
                ['Vercel', 'Application hosting and CDN. Edge network with EU nodes.'],
              ].map(([name, desc]) => (
                <div key={name} className="flex gap-3">
                  <span className="text-violet-400 font-medium w-24 shrink-0">{name}:</span>
                  <span className="text-sm">{desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Cookies</h2>
            <p>See our <Link href="/cookies" className="text-violet-400">Cookie Policy</Link> for details. We use only essential and functional cookies — no advertising or tracking cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Children</h2>
            <p>SmartDesk.ai is not intended for use by persons under 18. We do not knowingly collect data from minors. If you believe a minor has registered, contact us immediately.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Changes to This Policy</h2>
            <p>We will email you 30 days before any material changes to this policy. Continued use after that date constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">11. Contact & Complaints</h2>
            <p>Email: <a href="mailto:privacy@smartdesk.ai" className="text-violet-400">privacy@smartdesk.ai</a></p>
            <p className="mt-2">You also have the right to lodge a complaint with the Data Protection Commission (Ireland): <a href="https://www.dataprotection.ie" target="_blank" rel="noopener noreferrer" className="text-violet-400">dataprotection.ie</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
