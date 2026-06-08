'use client';
import { useState } from 'react';

const faqs = [
  { q: 'Why do you ask me questions before answering?', a: 'Most AI tools give generic answers because they don\'t know your specific situation. SmartDesk interviews you first — like a doctor who needs to diagnose symptoms before prescribing. The result is an answer tailored exactly to you.' },
  { q: 'Is my data safe?', a: 'Yes. Your data is stored in Supabase EU (eu-west-1), never sold, and never used to train AI models. We are GDPR compliant as an Irish company.' },
  { q: 'What happens after my free trial?', a: 'After 14 days you\'ll be charged for the Starter plan (€35.67/month incl. VAT). You can cancel anytime before day 15 with no charge.' },
  { q: 'Can I cancel anytime?', a: 'Absolutely. No contracts, no lock-in. Cancel from your billing page and your access continues until the end of the billing period.' },
  { q: 'What is White Label?', a: 'White Label lets agencies and businesses resell SmartDesk under their own brand — custom logo, colors, and subdomain. Your clients see your brand, not ours.' },
  { q: 'Do prices include VAT?', a: 'Prices shown are ex-VAT. 23% Irish VAT is added at checkout. You\'ll always see the full amount before paying.' },
  { q: 'How many questions does SmartDesk ask?', a: 'Usually 3-5 targeted questions, taking about 2 minutes. The more you answer, the more precise your final answer will be.' },
  { q: 'What AI model powers SmartDesk?', a: 'We use Anthropic\'s Claude — one of the most capable AI models available, known for accuracy and nuance.' },
  { q: 'Is there a query limit?', a: 'Trial: 50 queries. Starter: 200/month. Pro: unlimited. Queries reset on the 1st of each month.' },
  { q: 'Can I use SmartDesk for my team?', a: 'The White Label plan supports unlimited users under your agency. Individual plans (Starter/Pro) are for 1 user each.' },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-slate-700/50 rounded-xl overflow-hidden bg-slate-800/30"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left text-white font-medium hover:bg-slate-800/50 transition-colors"
              >
                {faq.q}
                <span className={`ml-4 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {open === i && (
                <div className="px-6 pb-4 text-slate-400 leading-relaxed text-sm">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
