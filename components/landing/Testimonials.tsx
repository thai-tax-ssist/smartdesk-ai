const testimonials = [
  {
    name: 'Siobhán Murphy',
    role: 'Marketing Director, Dublin',
    text: 'I was getting terrible AI answers until I tried SmartDesk. The interview process is a game-changer — it actually understands what I need.',
    avatar: 'SM',
  },
  {
    name: 'Ciarán O\'Brien',
    role: 'Business Consultant, Cork',
    text: 'The white label version is perfect for my agency. My clients think it\'s our own product. Genuinely saves us hours every week.',
    avatar: 'CO',
  },
  {
    name: 'Emma Fitzgerald',
    role: 'Freelance Designer, Galway',
    text: 'Worth every cent. I use it for client proposals, content, and strategy. The answers are so specific to my situation it\'s almost spooky.',
    avatar: 'EF',
  },
];

export function Testimonials() {
  return (
    <section className="py-24 px-4 bg-slate-950/50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            Trusted by 200+ Businesses
          </h2>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400 mt-6">
            <span>🔒 GDPR Compliant — Data stored in EU</span>
            <span>🇮🇪 Built for Irish & European businesses</span>
            <span>✅ Cancel anytime — no contracts</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <p className="text-slate-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
