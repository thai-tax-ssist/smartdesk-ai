'use client';

import Link from 'next/link';

export function TrialExpiredGate() {
  return (
    <div className="absolute inset-0 z-40 bg-gray-950/95 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-5xl">🔒</div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
            Your free trial has ended
          </h2>
          <p className="text-gray-400">
            You used SmartDesk.ai for 14 days. Upgrade now to keep getting accurate answers.
          </p>
        </div>

        <div className="space-y-3">
          <form action="/api/stripe/create-checkout" method="POST">
            <input type="hidden" name="plan" value="starter" />
            <button type="submit" className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-colors">
              Start Starter Plan — €35.67/month (incl. VAT)
            </button>
          </form>
          <form action="/api/stripe/create-checkout" method="POST">
            <input type="hidden" name="plan" value="pro" />
            <button type="submit" className="w-full py-3 border border-violet-500 text-violet-300 hover:bg-violet-500/10 rounded-xl font-medium transition-colors">
              Start Pro Plan — €97.17/month (incl. VAT)
            </button>
          </form>
        </div>

        <p className="text-sm text-gray-500">
          No pressure — if SmartDesk wasn&apos;t right for you, we understand.{' '}
          <Link href="/api/gdpr/delete-account" className="text-gray-400 hover:text-white underline transition-colors">
            Delete my account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default TrialExpiredGate;
