'use client'

import { useState } from 'react'
import { Package, Platform } from '@/types'

const GOOGLE_PACKAGES: Package[] = [
  {
    id: 'g_trial',
    name: 'Starter Trial',
    tagline: 'Try us out risk-free',
    price: 29,
    interval: 'one-time',
    platform: 'google',
    stripeKey: 'STRIPE_PRICE_G_TRIAL',
    features: ['1 simple Google Sheet or Doc', 'Delivered within 48 hours', 'Standard formatting'],
  },
  {
    id: 'g_basic',
    name: 'Basic',
    tagline: 'For a single custom document',
    price: 75,
    interval: 'one-time',
    platform: 'google',
    stripeKey: 'STRIPE_PRICE_G_BASIC',
    features: ['1 custom Google Sheet or Doc', 'All formulas included', 'User guide PDF', 'Delivered within 24 hours'],
  },
  {
    id: 'g_pro',
    name: 'Monthly Pro',
    tagline: 'Ongoing document support',
    price: 299,
    interval: 'month',
    platform: 'google',
    stripeKey: 'STRIPE_PRICE_G_PRO',
    popular: true,
    features: ['5 Sheets or Docs per month', 'Advanced automation', 'WhatsApp support', 'Free setup call', 'Priority 24hr turnaround'],
  },
  {
    id: 'g_enterprise',
    name: 'Enterprise',
    tagline: 'Full automation, unlimited support',
    price: 499,
    interval: 'month',
    platform: 'google',
    stripeKey: 'STRIPE_PRICE_G_ENTERPRISE',
    bestValue: true,
    features: ['50 files per month', 'Full Google Apps Script automation', 'Dedicated live support', 'Same-day turnaround', 'Monthly review call'],
  },
]

const MICROSOFT_PACKAGES: Package[] = [
  {
    id: 'm_trial',
    name: 'Starter Trial',
    tagline: 'Try us out risk-free',
    price: 39,
    interval: 'one-time',
    platform: 'microsoft',
    stripeKey: 'STRIPE_PRICE_M_TRIAL',
    features: ['1 simple Excel or Word file', 'Delivered within 48 hours', 'Standard formatting'],
  },
  {
    id: 'm_basic',
    name: 'Basic',
    tagline: 'For a single custom document',
    price: 99,
    interval: 'one-time',
    platform: 'microsoft',
    stripeKey: 'STRIPE_PRICE_M_BASIC',
    features: ['1 custom Excel or Word file', 'Formulas & macros included', 'User guide PDF', 'Delivered within 24 hours'],
  },
  {
    id: 'm_pro',
    name: 'Monthly Pro',
    tagline: 'Ongoing document support',
    price: 399,
    interval: 'month',
    platform: 'microsoft',
    stripeKey: 'STRIPE_PRICE_M_PRO',
    popular: true,
    features: ['5 files per month', 'VBA automation included', 'WhatsApp support', 'Free setup call', 'Priority 24hr turnaround'],
  },
  {
    id: 'm_enterprise',
    name: 'Enterprise',
    tagline: 'Full automation, unlimited support',
    price: 699,
    interval: 'month',
    platform: 'microsoft',
    stripeKey: 'STRIPE_PRICE_M_ENTERPRISE',
    bestValue: true,
    features: ['50 files per month', 'Full VBA + Power Automate', 'Dedicated live support', 'Same-day turnaround', 'Monthly review call'],
  },
]

async function startCheckout(packageId: string) {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ packageId }),
  })
  const data = await res.json()
  if (data.url) window.location.href = data.url
}

export default function PricingSection() {
  const [platform, setPlatform] = useState<Platform>('google')
  const packages = platform === 'google' ? GOOGLE_PACKAGES : MICROSOFT_PACKAGES

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-500 text-lg mb-8">All prices include VAT. No hidden fees.</p>

          <div className="inline-flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setPlatform('google')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${platform === 'google' ? 'bg-white shadow text-[#1a472a] font-semibold' : 'text-gray-500'}`}
            >
              🟢 Google Workspace
            </button>
            <button
              onClick={() => setPlatform('microsoft')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${platform === 'microsoft' ? 'bg-white shadow text-[#1a472a] font-semibold' : 'text-gray-500'}`}
            >
              🔵 Microsoft Office
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-2xl p-6 flex flex-col border-2 transition-all ${pkg.popular ? 'border-[#1a472a] shadow-xl scale-105' : 'border-gray-100 shadow'}`}
            >
              {pkg.popular && (
                <span className="inline-block bg-[#1a472a] text-white text-xs px-3 py-1 rounded-full mb-3 self-start">Most Popular</span>
              )}
              {pkg.bestValue && (
                <span className="inline-block bg-amber-500 text-white text-xs px-3 py-1 rounded-full mb-3 self-start">Best Value</span>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{pkg.tagline}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#1a472a]">€{pkg.price}</span>
                <span className="text-gray-400 text-sm ml-1">/{pkg.interval === 'month' ? 'month' : 'one-time'}</span>
              </div>
              <ul className="space-y-2 mb-8 flex-1">
                {pkg.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-[#1a472a] font-bold mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => startCheckout(pkg.id)}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors ${pkg.popular ? 'bg-[#1a472a] text-white hover:bg-[#2d6a4f]' : 'bg-gray-100 text-[#1a472a] hover:bg-[#f0f7f4]'}`}
              >
                Get started →
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          Not sure which plan? <button onClick={() => document.dispatchEvent(new CustomEvent('open-shay'))} className="text-[#1a472a] underline font-medium">Chat with Shay</button>
        </p>
      </div>
    </section>
  )
}
