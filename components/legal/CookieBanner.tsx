'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'cookie-consent';
const EXPIRY_MONTHS = 12;

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState({ functional: true, analytics: false });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) { setShow(true); return; }
    try {
      const parsed: CookiePreferences = JSON.parse(stored);
      const age = Date.now() - new Date(parsed.timestamp).getTime();
      if (age > EXPIRY_MONTHS * 30 * 24 * 60 * 60 * 1000) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  function save(functional: boolean, analytics: boolean) {
    const consent: CookiePreferences = { necessary: true, functional, analytics, timestamp: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-4">
        {!expanded ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="flex-1 text-sm text-gray-300">
              <span className="mr-1">🍪</span>
              We use essential cookies to run SmartDesk.ai. We don&apos;t track you or sell your data.{' '}
              <Link href="/cookies" className="text-violet-400 hover:text-violet-300 underline">Learn more</Link>
            </p>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setExpanded(true)}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-600 rounded-lg transition-colors"
              >
                Manage Cookies
              </button>
              <button
                onClick={() => save(true, true)}
                className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
              >
                Accept All ✓
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Cookie Preferences</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <div>
                  <p className="text-sm text-white font-medium">Strictly Necessary</p>
                  <p className="text-xs text-gray-400">Authentication and session management. Cannot be disabled.</p>
                </div>
                <div className="w-10 h-6 bg-violet-600 rounded-full relative cursor-not-allowed opacity-60">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <div>
                  <p className="text-sm text-white font-medium">Functional</p>
                  <p className="text-xs text-gray-400">Remember your preferences and settings.</p>
                </div>
                <button
                  onClick={() => setPrefs(p => ({ ...p, functional: !p.functional }))}
                  className={`w-10 h-6 rounded-full relative transition-colors ${prefs.functional ? 'bg-violet-600' : 'bg-gray-600'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${prefs.functional ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-white font-medium">Analytics</p>
                  <p className="text-xs text-gray-400">Help us understand how SmartDesk.ai is used.</p>
                </div>
                <button
                  onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}
                  className={`w-10 h-6 rounded-full relative transition-colors ${prefs.analytics ? 'bg-violet-600' : 'bg-gray-600'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${prefs.analytics ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => save(prefs.functional, prefs.analytics)}
                className="flex-1 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
              >
                Save Preferences
              </button>
              <button
                onClick={() => save(true, true)}
                className="flex-1 py-2 text-sm border border-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CookieBanner;
