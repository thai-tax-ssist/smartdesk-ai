'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) { setError('Please agree to the Privacy Policy and Terms of Service.'); return; }
    setError('');
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (signUpError) { setError(signUpError.message); setLoading(false); return; }

    // Create user record and subscription via API
    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: data.user?.id, email, fullName }),
      });
    } catch {}

    router.push('/onboarding');
    router.refresh();
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="font-bold text-xl text-white" style={{ fontFamily: 'Sora, sans-serif' }}>SmartDesk.ai</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Start your free trial</h1>
          <p className="text-slate-400 mt-1">No credit card required to start</p>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 mb-6">
          <p className="text-emerald-400 text-sm font-medium text-center">
            ✅ Free for 14 days — No charge until day 15. Cancel anytime before then.
          </p>
          <p className="text-slate-400 text-xs text-center mt-1">
            After trial, Starter plan is €29/month + 23% VAT (€35.67 total)
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-2.5 text-sm font-medium transition-colors mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Sign up with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-xs text-slate-500">or</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <Input label="Full Name" type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Jane Smith" required />
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required />
            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" minLength={8} required />

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 rounded border-slate-600 bg-slate-800 accent-indigo-500" />
              <span className="text-xs text-slate-400">
                I agree to the{' '}
                <Link href="/privacy" className="text-indigo-400 hover:underline">Privacy Policy</Link>
                {' '}and{' '}
                <Link href="/terms" className="text-indigo-400 hover:underline">Terms of Service</Link>
              </span>
            </label>

            {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
            <Button type="submit" className="w-full" size="lg" loading={loading} disabled={!agreed}>
              Create Free Account →
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
