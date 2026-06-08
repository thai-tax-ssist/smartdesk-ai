'use client'

import { Package } from '@/types'

const PACKAGE_ICONS: Record<string, string> = {
  g_trial: '🌱',
  g_basic: '📊',
  g_pro: '⚡',
  g_enterprise: '🏢',
  m_trial: '🌱',
  m_basic: '📈',
  m_pro: '⚡',
  m_enterprise: '🏢',
}

interface PackageCardProps {
  pkg: Package
  onPay?: (pkg: Package) => void
  compact?: boolean
}

export default function PackageCard({ pkg, onPay, compact }: PackageCardProps) {
  const icon = PACKAGE_ICONS[pkg.id] || '📄'

  return (
    <div className={`border rounded-xl p-4 bg-white ${pkg.popular ? 'border-[#1a472a] shadow-md' : 'border-gray-200'} ${compact ? 'text-sm' : ''}`}>
      {pkg.popular && (
        <span className="inline-block bg-[#1a472a] text-white text-xs px-2 py-1 rounded-full mb-2">Most Popular</span>
      )}
      {pkg.bestValue && (
        <span className="inline-block bg-amber-500 text-white text-xs px-2 py-1 rounded-full mb-2">Best Value</span>
      )}
      <div className="text-2xl mb-1">{icon}</div>
      <h3 className="font-bold text-gray-900">{pkg.name}</h3>
      <p className="text-gray-500 text-xs mb-2">{pkg.tagline}</p>
      <div className="mb-3">
        <span className="text-2xl font-bold text-[#1a472a]">€{pkg.price}</span>
        <span className="text-gray-400 text-sm">/{pkg.interval === 'month' ? 'mo' : 'one-time'}</span>
      </div>
      <ul className="space-y-1 mb-4">
        {pkg.features.map((f, i) => (
          <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
            <span className="text-[#1a472a] mt-0.5">✓</span>
            {f}
          </li>
        ))}
      </ul>
      {onPay && (
        <button
          onClick={() => onPay(pkg)}
          className="w-full bg-[#1a472a] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#2d6a4f] transition-colors"
        >
          Pay now →
        </button>
      )}
    </div>
  )
}
