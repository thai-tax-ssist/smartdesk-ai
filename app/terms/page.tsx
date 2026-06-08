import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service — SmartDesk.ai',
  description: 'SmartDesk.ai Terms of Service. Please read before using our platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-violet-400 hover:text-violet-300 text-sm mb-8 inline-block">← SmartDesk.ai</Link>
        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>Terms of Service</h1>
        <p className="text-gray-400 text-sm mb-12">Last updated: June 2025</p>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance</h2>
            <p>By creating an account or using SmartDesk.ai, you agree to these Terms of Service. If you do not agree, please do not use the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. The Service</h2>
            <p>SmartDesk.ai is an AI-powered advisory platform that uses an interview-first approach to provide accurate, contextual answers to business questions. The service is provided &ldquo;as is&rdquo; and is designed for informational and advisory purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Accounts</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>One account per person or entity</li>
              <li>You must provide accurate information when registering</li>
              <li>You are responsible for maintaining the security of your account credentials</li>
              <li>You must be 18 or older to use SmartDesk.ai</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Acceptable Use</h2>
            <p className="mb-2">You may not use SmartDesk.ai to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Generate illegal content or content that violates others&apos; rights</li>
              <li>Attempt to reverse-engineer, scrape, or abuse the platform</li>
              <li>Resell or sub-license SmartDesk.ai without a White Label agreement</li>
              <li>Impersonate other persons or entities</li>
              <li>Upload malware or attempt to compromise platform security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. AI Disclaimer</h2>
            <p>AI responses from SmartDesk.ai are for informational purposes only. They do not constitute professional legal, medical, financial, or other regulated advice. Always consult a qualified professional for decisions in regulated domains.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Subscription & Billing</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-white">Free trial:</strong> 14 days. A valid payment card is required to start your trial.</li>
              <li><strong className="text-white">Auto-charge:</strong> Your card is automatically charged at the end of the trial period unless you cancel beforehand.</li>
              <li><strong className="text-white">Currency & VAT:</strong> All prices are in EUR. Irish VAT at 23% is added for customers in Ireland. EU B2B customers may provide a VAT number to remove VAT (reverse charge).</li>
              <li><strong className="text-white">Refunds:</strong> EU cooling-off period of 14 days applies from the start of the paid period for new subscriptions. No refunds after 14 days of the paid period.</li>
              <li><strong className="text-white">Price changes:</strong> We will provide 30 days&apos; notice of any price changes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Cancellation</h2>
            <p>You may cancel your subscription at any time via the Billing page in your account. Access continues until the end of the current billing period. No partial refunds for unused time.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. White Label Terms</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>White Label agencies are responsible for ensuring their end users comply with these terms</li>
              <li>Sub-licensing to third parties requires written agreement from SmartDesk.ai</li>
              <li>White Label clients may customise branding but not misrepresent the underlying technology</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Intellectual Property</h2>
            <p>SmartDesk.ai owns all rights to the platform, software, and underlying technology. You own all conversation data you create through the service. You grant SmartDesk.ai a limited licence to process this data solely to provide the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Limitation of Liability</h2>
            <p>To the maximum extent permitted by Irish law, SmartDesk.ai&apos;s total liability to you for any claim arising from use of the service is limited to the fees you paid in the three months preceding the claim. We are not liable for indirect, incidental, or consequential damages.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">11. Governing Law</h2>
            <p>These terms are governed by the laws of the Republic of Ireland. Any disputes shall be subject to the exclusive jurisdiction of the Irish courts.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">12. Contact</h2>
            <p>Legal queries: <a href="mailto:legal@smartdesk.ai" className="text-violet-400">legal@smartdesk.ai</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
