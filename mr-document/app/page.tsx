'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PricingSection from '@/components/PricingSection'
import ShayChat from '@/components/ShayChat'

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-[#f0f7f4] py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block bg-[#1a472a] text-white text-xs px-3 py-1.5 rounded-full mb-4 font-medium">
              🍀 Based in Cork, Ireland
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Your documents,<br />
              <span className="text-[#1a472a]">sorted.</span>
            </h1>
            <p className="text-xl text-gray-500 mb-8 max-w-lg mx-auto lg:mx-0">
              Custom Google Sheets, Excel workbooks, Docs and Word templates — built to your exact needs and delivered within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button
                onClick={() => document.dispatchEvent(new CustomEvent('open-shay'))}
                className="bg-[#1a472a] text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-[#2d6a4f] transition-colors text-base"
              >
                💬 Chat with Shay
              </button>
              <a href="#pricing" className="border-2 border-[#1a472a] text-[#1a472a] px-6 py-3.5 rounded-xl font-semibold hover:bg-[#f0f7f4] transition-colors text-base text-center">
                View pricing →
              </a>
            </div>
          </div>

          {/* Shay card */}
          <div className="flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-72 border border-green-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-[#f0f7f4] flex items-center justify-center text-3xl">🤝</div>
                <div>
                  <p className="font-bold text-gray-900">Shay</p>
                  <p className="text-sm text-[#1a472a]">AI Sales Assistant</p>
                  <span className="inline-flex items-center gap-1 text-xs text-green-600">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" /> Online now
                  </span>
                </div>
              </div>
              <div className="bg-[#f0f7f4] rounded-xl p-3 text-sm text-gray-700 mb-4">
                👋 Hi! I&apos;m Shay. What does your business do?
              </div>
              <button
                onClick={() => document.dispatchEvent(new CustomEvent('open-shay'))}
                className="w-full bg-[#1a472a] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#2d6a4f] transition-colors"
              >
                Start chatting →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { value: '24hr', label: 'Turnaround' },
              { value: '€29', label: 'Starting from' },
              { value: '100%', label: 'Irish-based' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-[#1a472a]">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What we build</h2>
            <p className="text-gray-500 text-lg">Everything from simple trackers to full automation systems</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '📊', title: 'Google Sheets', desc: 'Trackers, invoices, job sheets, databases — with formulas and Apps Script automation' },
              { icon: '📝', title: 'Google Docs', desc: 'Contracts, templates, letterheads — professional formatting and placeholders' },
              { icon: '📈', title: 'Excel Workbooks', desc: 'Complex workbooks with pivot tables, VBA macros, and Power Automate flows' },
              { icon: '📄', title: 'Word Templates', desc: 'Quote templates, service agreements, reports — ready to use and rebrand' },
            ].map(s => (
              <div key={s.title} className="bg-[#f0f7f4] rounded-2xl p-6">
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How it works</h2>
          <p className="text-gray-500 text-lg mb-12">Three steps and you&apos;re sorted</p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '1', icon: '💬', title: 'Chat with Shay', desc: "Tell Shay what your business needs. She'll find the right package in 2 minutes." },
              { step: '2', icon: '⚙️', title: 'We build it', desc: 'Our team builds your custom document — formulas, automation, everything.' },
              { step: '3', icon: '🔗', title: 'You get the link', desc: 'Your document is delivered within 24 hours with a plain-English guide.' },
            ].map(s => (
              <div key={s.step} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#1a472a] text-white text-lg font-bold flex items-center justify-center mb-4">{s.step}</div>
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PricingSection />

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What our clients say</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { name: 'Dave Foley', company: 'Avondhu Blackwater Partnership', text: 'Shay had our grant tracker built within a day. Saved us hours every week — exactly what we needed.' },
              { name: "Mary O'Brien", company: "O'Brien's Butchers Cork", text: 'Our stock sheet was a mess of paper. Now it\'s a proper spreadsheet that anyone on the team can use.' },
              { name: 'Seán Murphy', company: 'Murphy Electrical Cork', text: 'Got a quote template and invoice system sorted in one go. Brilliant service, fair price.' },
            ].map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-3">
                  {Array(5).fill(0).map((_, i) => <span key={i} className="text-amber-400">★</span>)}
                </div>
                <p className="text-gray-700 text-sm mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                <p className="text-gray-400 text-xs">{t.company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section id="contact" className="py-16 bg-[#1a472a]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to sort your documents?</h2>
          <p className="text-green-200 text-lg mb-8">Chat with Shay now — she&apos;ll have you sorted in minutes.</p>
          <button
            onClick={() => document.dispatchEvent(new CustomEvent('open-shay'))}
            className="bg-white text-[#1a472a] px-8 py-4 rounded-xl font-bold text-base hover:bg-green-50 transition-colors"
          >
            💬 Chat with Shay now
          </button>
        </div>
      </section>

      <Footer />
      <ShayChat />
    </>
  )
}
