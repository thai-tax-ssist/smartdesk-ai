'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';

const plans = [
  {
    key: 'trial',
    name: 'Free Trial',
    price: '€0',
    period: '14 days',
    desc: 'Try everything, no commitment',
    queries: '50 queries',
    features: ['50 queries', 'AI Interview System', 'Conversation history', 'Email support'],
    cta: 'Start Free Trial',
    href: '/signup',
    highlight: false,
  },
  {
    key: 'starter',
    name: 'Starter',
    price: '€29',
    period: '/month',
    vatNote: '+ VAT (€35.67 total)',
    desc: 'For professionals & freelancers',
    queries: '200 queries/month',
    features: ['200 queries per month', '1 user', 'Email support', 'AI Interview System', 'Conversation history'],
    cta: 'Get Started',
    href: '/signup?plan=starter',
    highlight: false,
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '€79',
    period: '/month',
    vatNote: '+ VAT (€97.17 total)',
    desc: 'For power users & teams',
    queries: 'Unlimited queries',
    features: ['Unlimited queries', '1 user', 'Priority support', 'Advanced AI features', 'Saved responses', 'API access'],
    cta: 'Go Pro',
    href: '/signup?plan=pro',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    key: 'white_label',
    name: 'White Label',
    price: '€249',
    period: '/month',
    vatNote: '+ VAT + €500 setup',
    desc: 'For agencies & resellers',
    queries: 'Unlimited queries',
    features: ['Custom logo + brand colors', 'Custom subdomain', 'Agency admin dashboard', 'Unlimited users', 'Dedicated support', '1 hour onboarding call'],
    cta: 'Contact Us',
    href: '/signup?plan=white_label',
    highlight: false,
    earlyBird: true,
  },
];

export function PricingTable({ earlyBirdCount = 47 }: { earlyBirdCount?: number }) {
  return (
    <section id="pricing" className="py-24 px-4 bg-slate-950/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-400">All prices shown exclude VAT. 23% Irish VAT applies.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {plans.map(plan => (
            <div
              key={plan.key}
              className={`relative flex flex-col rounded-2xl p-6 border transition-all ${
                plan.highlight
                  ? 'bg-indigo-600/10 border-indigo-500 shadow-xl shadow-indigo-500/20'
                  : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">{plan.badge}</span>
                </div>
              )}
              {plan.earlyBird && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-1.5 mb-3 text-center">
                  <p className="text-amber-400 text-xs font-medium">⚡ Early Bird: {earlyBirdCount}/100 spots taken</p>
                </div>
              )}
              <div className="mb-4">
                <h3 className="font-semibold text-white text-lg">{plan.name}</h3>
                <p className="text-slate-400 text-sm mt-1">{plan.desc}</p>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-400 text-sm">{plan.period}</span>
                {plan.vatNote && <p className="text-xs text-slate-500 mt-0.5">{plan.vatNote}</p>}
              </div>
              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-indigo-400 mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href}>
                <Button
                  variant={plan.highlight ? 'primary' : 'secondary'}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
