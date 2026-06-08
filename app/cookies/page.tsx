import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy — SmartDesk.ai',
  description: 'How SmartDesk.ai uses cookies and how to manage your preferences.',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-violet-400 hover:text-violet-300 text-sm mb-8 inline-block">← SmartDesk.ai</Link>
        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>Cookie Policy</h1>
        <p className="text-gray-400 text-sm mb-12">Last updated: June 2025</p>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">What Are Cookies?</h2>
            <p>Cookies are small text files stored in your browser when you visit a website. We also use localStorage (browser storage) for some preferences. We do not use cookies for advertising or to track you across other websites.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Cookies We Use</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-800 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-gray-900 text-left">
                    <th className="px-4 py-3 text-gray-400 font-medium">Category</th>
                    <th className="px-4 py-3 text-gray-400 font-medium">Cookies</th>
                    <th className="px-4 py-3 text-gray-400 font-medium">Purpose</th>
                    <th className="px-4 py-3 text-gray-400 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {[
                    ['Strictly Necessary', 'supabase-auth-token, sb-*', 'Authentication and session management. Required for the site to function.', 'Session'],
                    ['Functional', 'user-preferences, cookie-consent', 'Remember your settings and cookie preferences.', '1 year'],
                    ['Analytics', '_ga, _gid', 'Understand how visitors use SmartDesk.ai (only if you consent).', '2 years'],
                    ['Marketing', 'None', 'We do not use advertising or tracking cookies.', '—'],
                  ].map(([cat, cookies, purpose, duration]) => (
                    <tr key={cat} className="hover:bg-gray-900/50">
                      <td className="px-4 py-3 font-medium text-white">{cat}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">{cookies}</td>
                      <td className="px-4 py-3 text-gray-300">{purpose}</td>
                      <td className="px-4 py-3 text-gray-400">{duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Your Choices</h2>
            <p className="mb-3">You can manage your cookie preferences at any time:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use the cookie banner on our website to set your preferences</li>
              <li>Clear cookies via your browser settings (this will log you out)</li>
              <li>Use your browser&apos;s Do Not Track setting</li>
            </ul>
            <p className="mt-3 text-sm text-gray-400">Note: Disabling strictly necessary cookies will prevent you from logging in to SmartDesk.ai.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">How to Manage Cookies in Your Browser</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300">Apple Safari</a></li>
              <li><a href="https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300">Microsoft Edge</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Contact</h2>
            <p>Questions? Email <a href="mailto:privacy@smartdesk.ai" className="text-violet-400">privacy@smartdesk.ai</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
