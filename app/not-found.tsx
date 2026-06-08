import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found · SmartDesk.ai',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-gray-800 select-none mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
          404
        </div>
        <div className="text-4xl mb-6">🤔</div>
        <h1 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
          This page doesn&apos;t exist
        </h1>
        <p className="text-gray-400 mb-8">
          Maybe it moved, or you followed a broken link.
        </p>
        <div className="flex gap-3 justify-center mb-8">
          <Link href="/" className="px-5 py-2.5 border border-gray-700 text-gray-300 hover:text-white rounded-xl text-sm transition-colors">
            ← Go to Homepage
          </Link>
          <Link href="/dashboard" className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium transition-colors">
            Go to Dashboard
          </Link>
        </div>
        <p className="text-gray-500 text-sm">
          Or ask our AI assistant — it knows everything about SmartDesk{' '}
          <span className="text-violet-400">→</span>
        </p>
      </div>
    </div>
  );
}
