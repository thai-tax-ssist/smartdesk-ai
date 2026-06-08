'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">⚡</div>
        <h1 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
          Something went wrong
        </h1>
        <p className="text-gray-400 mb-2">
          Something went wrong on our end. Our team has been notified automatically.
        </p>
        <p className="text-gray-500 text-sm mb-8">Usually fixed within minutes.</p>
        <div className="flex gap-3 justify-center mb-8">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Try Again
          </button>
          <Link href="/" className="px-5 py-2.5 border border-gray-700 text-gray-300 hover:text-white rounded-xl text-sm transition-colors">
            ← Go Home
          </Link>
        </div>
        <p className="text-gray-500 text-sm">
          If this keeps happening, chat with us{' '}
          <span className="text-violet-400">→</span>
        </p>
      </div>
    </div>
  );
}
