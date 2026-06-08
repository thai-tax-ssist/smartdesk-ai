'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [jobRole, setJobRole] = useState('');
  const [useType, setUseType] = useState<'work' | 'personal' | ''>('');
  const [problem, setProblem] = useState('');
  const [goal, setGoal] = useState('');
  const [thanks, setThanks] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function completeOnboarding() {
    setLoading(true);
    await fetch('/api/onboarding', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobRole, useType, problem, goal }),
    });
    router.push('/chat');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="font-bold text-xl text-white" style={{ fontFamily: 'Sora, sans-serif' }}>SmartDesk.ai</span>
          </div>

          <Card className="text-left mb-6">
            <p className="text-indigo-400 font-semibold mb-2">🔒 Why do we ask you questions?</p>
            <div className="text-slate-300 text-sm leading-relaxed space-y-1">
              <p>Not to judge you.</p>
              <p>Not to collect your personal data.</p>
              <br />
              <p>Like a doctor who needs to know your symptoms before giving the right medicine — the more you tell us, the more accurate your answer will be.</p>
              <br />
              <p className="text-slate-400">Your answers are only used in this conversation. Nothing else.</p>
            </div>
          </Card>

          <div className="flex gap-2 justify-center mb-6">
            {[0, 1].map(i => (
              <div key={i} className={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-indigo-500' : i < step ? 'w-2 bg-indigo-700' : 'w-2 bg-slate-700'}`} />
            ))}
          </div>
        </div>

        {thanks && (
          <div className="text-center mb-4 animate-fadeIn">
            <p className="text-emerald-400 text-sm font-medium">Thank you — this helps us understand exactly what you need 🙏</p>
          </div>
        )}

        {step === 0 && (
          <Card glow>
            <h2 className="text-xl font-bold text-white mb-1">Introduce Yourself 🧑‍💼</h2>
            <p className="text-slate-400 text-sm mb-6">Before we begin, tell us about yourself so we can give you the most relevant answers</p>

            <div className="space-y-4">
              <Input
                label="What is your job or role?"
                placeholder="e.g. Marketing Manager, Freelancer, Business Owner..."
                value={jobRole}
                onChange={e => setJobRole(e.target.value)}
              />

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">Is this for work or personal use?</label>
                <div className="flex gap-3">
                  {(['work', 'personal'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setUseType(type)}
                      className={`flex-1 py-2.5 rounded-lg border text-sm font-medium capitalize transition-all ${
                        useType === type
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                          : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {type === 'work' ? '💼 Work' : '👤 Personal'}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full mt-2"
                onClick={() => { setStep(1); setThanks(true); setTimeout(() => setThanks(false), 3000); }}
                disabled={!jobRole || !useType}
              >
                Next →
              </Button>
            </div>
          </Card>
        )}

        {step === 1 && (
          <Card glow>
            <h2 className="text-xl font-bold text-white mb-1">Your Goal 🎯</h2>
            <p className="text-slate-400 text-sm mb-6">The clearer your problem, the better our answer</p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1.5">What is your main problem or challenge?</label>
                <textarea
                  value={problem}
                  onChange={e => setProblem(e.target.value)}
                  placeholder="Describe the problem you're trying to solve..."
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1.5">What result do you want to achieve?</label>
                <textarea
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  placeholder="What does success look like for you?..."
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
                />
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(0)}>← Back</Button>
                <Button className="flex-1" onClick={completeOnboarding} loading={loading} disabled={!problem || !goal}>
                  Start SmartDesk →
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
