'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';

const examples = [
  { bad: 'How do I grow my business?', good: 'A 3-step LinkedIn strategy for Irish B2B consultants targeting SMEs...' },
  { bad: 'Write me an email', good: 'A follow-up email for a €15k proposal to a Dublin tech startup CFO...' },
  { bad: 'Help me with marketing', good: 'A Google Ads campaign structure for a €500/month budget in the Irish market...' },
];

export function Hero() {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<'bad' | 'interview' | 'good'>('bad');

  useEffect(() => {
    const cycle = () => {
      setPhase('bad');
      setTimeout(() => setPhase('interview'), 2000);
      setTimeout(() => setPhase('good'), 4000);
      setTimeout(() => {
        setIdx(i => (i + 1) % examples.length);
        setPhase('bad');
      }, 7000);
    };
    cycle();
    const id = setInterval(cycle, 7000);
    return () => clearInterval(id);
  }, []);

  const ex = examples[idx];

  return (
    <section className="relative pt-32 pb-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 to-transparent pointer-events-none" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 text-sm text-indigo-300 mb-6">
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
          AI-Powered Smart Interview System
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
          Stop Getting{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
            Useless AI Answers.
          </span>
        </h1>

        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          SmartDesk interviews you first — like a doctor diagnosing symptoms — then gives you answers that actually work.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link href="/signup">
            <Button size="lg" className="w-full sm:w-auto">
              Start Free 14-Day Trial →
            </Button>
          </Link>
          <a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors">
            See how it works ↓
          </a>
        </div>

        <p className="text-sm text-slate-500 mb-12">
          🔒 No judging. No data selling. Just better answers.
        </p>

        {/* Animated demo */}
        <div className="max-w-2xl mx-auto bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 text-left">
          <div className="space-y-3 min-h-[120px]">
            {phase === 'bad' && (
              <div className="flex gap-3 animate-fadeIn">
                <div className="w-8 h-8 rounded-full bg-slate-600 flex-shrink-0 flex items-center justify-center text-sm">👤</div>
                <div className="bg-slate-700 rounded-lg rounded-tl-none px-4 py-2.5 text-slate-300 text-sm">
                  {ex.bad}
                </div>
              </div>
            )}
            {phase === 'interview' && (
              <>
                <div className="flex gap-3 animate-fadeIn">
                  <div className="w-8 h-8 rounded-full bg-slate-600 flex-shrink-0 flex items-center justify-center text-sm">👤</div>
                  <div className="bg-slate-700 rounded-lg rounded-tl-none px-4 py-2.5 text-slate-300 text-sm">{ex.bad}</div>
                </div>
                <div className="flex gap-3 justify-end animate-fadeIn">
                  <div className="bg-indigo-600/80 rounded-lg rounded-tr-none px-4 py-2.5 text-white text-sm max-w-xs">
                    To give you the most accurate answer, I need to understand a few things first 🗺️ — what is your specific situation?
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex-shrink-0 flex items-center justify-center text-sm font-bold text-white">S</div>
                </div>
              </>
            )}
            {phase === 'good' && (
              <div className="flex gap-3 justify-end animate-fadeIn">
                <div className="bg-indigo-600/80 rounded-lg rounded-tr-none px-4 py-2.5 text-white text-sm max-w-sm">
                  ✅ <strong>Here is your tailored answer:</strong><br />
                  {ex.good}
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex-shrink-0 flex items-center justify-center text-sm font-bold text-white">S</div>
              </div>
            )}
          </div>
          <div className="flex gap-1.5 mt-4">
            {['bad', 'interview', 'good'].map(p => (
              <div key={p} className={`h-1 rounded-full transition-all ${phase === p ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-600'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
