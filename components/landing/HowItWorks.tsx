const steps = [
  {
    icon: '🧑‍💼',
    title: 'Tell us who you are',
    desc: 'Quick 2-minute profile setup so we understand your context, role, and goals.',
  },
  {
    icon: '🎯',
    title: 'We ask the right questions',
    desc: 'Our AI interviews you like a GPS needs your location — no context, no accurate answer.',
  },
  {
    icon: '✅',
    title: 'Get your accurate answer',
    desc: 'Structured, detailed, actionable results tailored exactly to your situation.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            How SmartDesk Works
          </h2>
          <p className="text-slate-400 text-lg">Three simple steps to answers that actually help</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-slate-700 to-transparent z-0" />
              )}
              <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center hover:border-indigo-500/30 transition-colors">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Step {i + 1}</div>
                <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
