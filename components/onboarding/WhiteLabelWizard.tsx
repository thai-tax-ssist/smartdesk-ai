'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ColorPicker } from '@/components/agency/ColorPicker';
import { useRouter } from 'next/navigation';

interface WizardData {
  logo_url?: string;
  primary_color: string;
  subdomain?: string;
  custom_domain?: string;
  assistant_name?: string;
  ai_personality?: string;
  industry_focus?: string[];
  welcome_message?: string;
  invites?: { email: string; role: string }[];
  onboarding_step?: number;
  onboarding_completed?: boolean;
}

interface WhiteLabelWizardProps {
  agencyName: string;
  initialData?: Partial<WizardData>;
}

const INDUSTRIES = [
  'Marketing & Sales', 'Legal & Compliance', 'Finance & Accounting',
  'Healthcare', 'Technology', 'HR & Recruitment', 'Property & Real Estate',
];

const STEPS = [
  { title: 'Welcome', icon: '🎉' },
  { title: 'Brand Identity', icon: '🎨' },
  { title: 'Custom Domain', icon: '🌐' },
  { title: 'AI Assistant', icon: '🤖' },
  { title: 'Invite Team', icon: '👥' },
  { title: "You're Live!", icon: '🚀' },
];

export function WhiteLabelWizard({ agencyName, initialData = {} }: WhiteLabelWizardProps) {
  const router = useRouter();
  const confettiRef = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState(Math.min(initialData.onboarding_step || 0, 5));
  const [saving, setSaving] = useState(false);
  const [subdomainStatus, setSubdomainStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [newInviteRole, setNewInviteRole] = useState('user');

  const [data, setData] = useState<WizardData>({
    primary_color: '#7c3aed',
    ...initialData,
    invites: [],
  });

  const update = useCallback((key: keyof WizardData, value: unknown) => {
    setData(prev => ({ ...prev, [key]: value }));
  }, []);

  // Confetti on step 0 load
  useEffect(() => {
    if (step !== 0) return;
    import('canvas-confetti').then(m => {
      const confetti = m.default;
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#7c3aed', '#6366f1', '#f59e0b', '#10b981'] });
    });
  }, [step]);

  async function save(nextStep: number) {
    setSaving(true);
    await fetch('/api/agency/onboarding', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, onboarding_step: nextStep }),
    });
    setSaving(false);
  }

  async function goNext() {
    const next = step + 1;
    await save(next);
    setStep(next);
  }

  async function checkSubdomain() {
    if (!data.subdomain) return;
    setSubdomainStatus('checking');
    const res = await fetch(`/api/admin/agencies?subdomain=${data.subdomain}`);
    const list = await res.json();
    setSubdomainStatus(Array.isArray(list) && list.length > 0 ? 'taken' : 'available');
  }

  function toggleIndustry(ind: string) {
    const current = data.industry_focus || [];
    update('industry_focus', current.includes(ind) ? current.filter(i => i !== ind) : [...current, ind]);
  }

  function addInvite() {
    if (!newInviteEmail) return;
    update('invites', [...(data.invites || []), { email: newInviteEmail, role: newInviteRole }]);
    setNewInviteEmail('');
    setNewInviteRole('user');
  }

  function removeInvite(email: string) {
    update('invites', (data.invites || []).filter(i => i.email !== email));
  }

  async function complete() {
    setSaving(true);
    await fetch('/api/agency/onboarding', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, onboarding_step: 5, onboarding_completed: true }),
    });
    setSaving(false);
    setStep(5);
  }

  const color = data.primary_color || '#7c3aed';

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-64 bg-gray-900 border-r border-gray-800 p-6">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>Setup Wizard</h2>
          <p className="text-xs text-gray-400 mt-1">~5 minutes</p>
        </div>
        <div className="space-y-1">
          {STEPS.map((s, i) => (
            <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${i === step ? 'bg-violet-600/20 text-violet-300' : i < step ? 'text-green-400' : 'text-gray-500'}`}>
              <span className="text-base">{i < step ? '✓' : s.icon}</span>
              <span>{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Progress bar */}
        <div className="h-1 bg-gray-800">
          <div className="h-1 bg-violet-500 transition-all duration-500" style={{ width: `${((step + 1) / 6) * 100}%` }} />
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-xl">
            {/* Step 0: Welcome */}
            {step === 0 && (
              <div className="text-center space-y-6">
                <canvas ref={confettiRef} className="pointer-events-none absolute inset-0" />
                <div className="text-6xl">🎉</div>
                <div>
                  <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                    Welcome, {agencyName}!
                  </h1>
                  <p className="text-gray-400 mt-2">Your White Label account is ready. This setup takes about 5 minutes.</p>
                </div>
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 text-left space-y-2">
                  <p className="text-sm font-medium text-gray-300 mb-3">What we&apos;ll set up together:</p>
                  {[
                    'Your brand identity (logo + colours)',
                    'Your custom subdomain',
                    'Your AI assistant\'s name and personality',
                    'Your welcome message for users',
                    'Your first team members',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-400">✅</span> {item}
                    </div>
                  ))}
                </div>
                <button onClick={goNext} disabled={saving}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold text-lg transition-colors disabled:opacity-50">
                  Let&apos;s Get Started →
                </button>
              </div>
            )}

            {/* Step 1: Brand Identity */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Brand Identity 🎨</h2>
                  <p className="text-gray-400 mt-1">Make SmartDesk look like YOUR product</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">Upload Your Logo</label>
                  <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-violet-500 transition-colors cursor-pointer">
                    <p className="text-gray-400 text-sm">Drag & drop or click to upload</p>
                    <p className="text-gray-500 text-xs mt-1">PNG, SVG or JPG · max 2MB · min 200×50px</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-3">Primary Colour</label>
                  <ColorPicker value={color} onChange={v => update('primary_color', v)} />
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <p className="text-xs text-gray-400 mb-3">Live Preview</p>
                  <div className="bg-gray-950 rounded-lg overflow-hidden">
                    <div className="px-4 py-2 flex items-center gap-2" style={{ backgroundColor: `${color}20`, borderBottom: `1px solid ${color}40` }}>
                      <div className="h-6 px-3 rounded font-bold text-white text-xs flex items-center" style={{ backgroundColor: color }}>
                        {agencyName}
                      </div>
                    </div>
                    <div className="p-3 text-xs text-gray-400">
                      <div className="flex gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: color }}>A</div>
                        <div className="bg-gray-800 rounded-lg px-3 py-1.5 text-gray-300">Hi! How can I help?</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="px-6 py-2.5 border border-gray-700 text-gray-300 rounded-xl hover:text-white transition-colors">← Back</button>
                  <button onClick={goNext} disabled={saving} className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50">
                    {saving ? 'Saving...' : 'Continue →'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Custom Domain */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Custom Domain 🌐</h2>
                  <p className="text-gray-400 mt-1">Choose your subdomain or use your own domain</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">Choose your subdomain</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center bg-gray-800 border border-gray-700 rounded-xl overflow-hidden focus-within:border-violet-500">
                      <input
                        value={data.subdomain || ''}
                        onChange={e => { update('subdomain', e.target.value); setSubdomainStatus('idle'); }}
                        placeholder="yourcompany"
                        className="flex-1 bg-transparent px-4 py-2.5 text-white text-sm focus:outline-none"
                      />
                      <span className="text-gray-400 text-sm px-3">.smartdesk.ai</span>
                    </div>
                    <button onClick={checkSubdomain} disabled={!data.subdomain}
                      className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm transition-colors disabled:opacity-40">
                      Check
                    </button>
                  </div>
                  {subdomainStatus === 'available' && <p className="text-green-400 text-xs mt-1">✅ Available!</p>}
                  {subdomainStatus === 'taken' && <p className="text-red-400 text-xs mt-1">❌ Already taken. Try another.</p>}
                  {subdomainStatus === 'checking' && <p className="text-gray-400 text-xs mt-1">Checking...</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">Or use your own domain (optional)</label>
                  <input
                    value={data.custom_domain || ''}
                    onChange={e => update('custom_domain', e.target.value)}
                    placeholder="yourcompany.com"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
                {data.custom_domain && (
                  <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                    <p className="text-xs font-medium text-gray-300 mb-2">📋 DNS Setup</p>
                    <div className="font-mono text-xs text-gray-400 space-y-1 bg-gray-950 rounded p-3">
                      <p>CNAME @ → cname.smartdesk.ai</p>
                      <p>CNAME www → cname.smartdesk.ai</p>
                      <p>TTL: 3600</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">SSL auto-provisioned within 24 hours.</p>
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-6 py-2.5 border border-gray-700 text-gray-300 rounded-xl hover:text-white transition-colors">← Back</button>
                  <button onClick={goNext} disabled={saving} className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50">
                    {saving ? 'Saving...' : 'Continue →'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: AI Assistant */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-white">Your AI Assistant 🤖</h2>
                  <p className="text-gray-400 mt-1">Personalise your AI assistant</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">Assistant Name</label>
                  <input
                    value={data.assistant_name || ''}
                    onChange={e => update('assistant_name', e.target.value)}
                    placeholder='e.g. "Emma", "Max", "Aria"'
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">Personality</label>
                  <textarea
                    value={data.ai_personality || ''}
                    onChange={e => update('ai_personality', e.target.value)}
                    placeholder="Professional but warm. Speaks like a knowledgeable Irish business advisor. Never uses jargon. Always encouraging."
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">Industry Focus</label>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.map(ind => (
                      <button
                        key={ind}
                        onClick={() => toggleIndustry(ind)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${(data.industry_focus || []).includes(ind) ? 'bg-violet-600 border-violet-600 text-white' : 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'}`}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">Welcome Message</label>
                  <textarea
                    value={data.welcome_message || ''}
                    onChange={e => update('welcome_message', e.target.value)}
                    placeholder={`Hi! I'm ${data.assistant_name || 'your assistant'}, your business AI. What's on your mind today?`}
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="px-6 py-2.5 border border-gray-700 text-gray-300 rounded-xl hover:text-white transition-colors">← Back</button>
                  <button onClick={goNext} disabled={saving} className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50">
                    {saving ? 'Saving...' : 'Continue →'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Invite Team */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-white">Invite Your Team 👥</h2>
                  <p className="text-gray-400 mt-1">Add team members to your account</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={newInviteEmail}
                    onChange={e => setNewInviteEmail(e.target.value)}
                    placeholder="Email address"
                    onKeyDown={e => e.key === 'Enter' && addInvite()}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                  <select
                    value={newInviteRole}
                    onChange={e => setNewInviteRole(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button onClick={addInvite} className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm transition-colors">
                    + Add
                  </button>
                </div>
                {(data.invites || []).length > 0 && (
                  <div className="space-y-2">
                    {(data.invites || []).map(invite => (
                      <div key={invite.email} className="flex items-center justify-between bg-gray-900 rounded-xl px-4 py-2.5 border border-gray-800">
                        <span className="text-sm text-gray-300">{invite.email}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 capitalize">{invite.role}</span>
                          <button onClick={() => removeInvite(invite.email)} className="text-gray-600 hover:text-red-400 text-xs transition-colors">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setStep(3)} className="px-6 py-2.5 border border-gray-700 text-gray-300 rounded-xl hover:text-white transition-colors">← Back</button>
                  <button onClick={() => { save(4); goNext(); }} className="px-4 py-2.5 text-gray-400 hover:text-white text-sm transition-colors">
                    Skip for now →
                  </button>
                  <button onClick={complete} disabled={saving} className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50">
                    {saving ? 'Saving...' : 'Send Invites & Continue →'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Done */}
            {step === 5 && (
              <div className="text-center space-y-6">
                <div className="text-6xl animate-bounce">🚀</div>
                <div>
                  <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                    You&apos;re All Set!
                  </h2>
                  <p className="text-gray-400 mt-2">Your SmartDesk White Label is live!</p>
                </div>
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 text-left space-y-3">
                  {data.subdomain && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Your platform</span>
                      <span className="text-violet-400 font-medium">{data.subdomain}.smartdesk.ai</span>
                    </div>
                  )}
                  {data.assistant_name && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Your AI</span>
                      <span className="text-white">{data.assistant_name}</span>
                    </div>
                  )}
                  {(data.invites || []).length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Team members</span>
                      <span className="text-white">{data.invites!.length} invited</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2 text-left">
                  <p className="text-sm font-medium text-gray-300">Quick Start:</p>
                  {data.subdomain && (
                    <a href={`https://${data.subdomain}.smartdesk.ai`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors">
                      → Share this link with your team
                    </a>
                  )}
                  <button onClick={() => router.push('/agency')}
                    className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors">
                    → Go to your Admin Dashboard
                  </button>
                  <a href="https://calendly.com/smartdesk-ai" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors">
                    → Book your 1-hour onboarding call
                  </a>
                </div>
                <p className="text-xs text-gray-500">
                  Need help? Email <a href="mailto:support@smartdesk.ai" className="text-violet-400">support@smartdesk.ai</a>
                </p>
                <button onClick={() => router.push('/agency')}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-colors">
                  Go to Dashboard →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhiteLabelWizard;
