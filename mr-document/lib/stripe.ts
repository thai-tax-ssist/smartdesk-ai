import Stripe from 'stripe'

export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

export const PACKAGES = {
  g_trial: { id: 'g_trial', name: 'Starter Trial', platform: 'google' as const, price: 29, interval: 'one-time' as const, priceEnvKey: 'STRIPE_PRICE_G_TRIAL' },
  g_basic: { id: 'g_basic', name: 'Basic', platform: 'google' as const, price: 75, interval: 'one-time' as const, priceEnvKey: 'STRIPE_PRICE_G_BASIC' },
  g_pro: { id: 'g_pro', name: 'Monthly Pro', platform: 'google' as const, price: 299, interval: 'month' as const, priceEnvKey: 'STRIPE_PRICE_G_PRO' },
  g_enterprise: { id: 'g_enterprise', name: 'Enterprise', platform: 'google' as const, price: 499, interval: 'month' as const, priceEnvKey: 'STRIPE_PRICE_G_ENTERPRISE' },
  m_trial: { id: 'm_trial', name: 'Starter Trial', platform: 'microsoft' as const, price: 39, interval: 'one-time' as const, priceEnvKey: 'STRIPE_PRICE_M_TRIAL' },
  m_basic: { id: 'm_basic', name: 'Basic', platform: 'microsoft' as const, price: 99, interval: 'one-time' as const, priceEnvKey: 'STRIPE_PRICE_M_BASIC' },
  m_pro: { id: 'm_pro', name: 'Monthly Pro', platform: 'microsoft' as const, price: 399, interval: 'month' as const, priceEnvKey: 'STRIPE_PRICE_M_PRO' },
  m_enterprise: { id: 'm_enterprise', name: 'Enterprise', platform: 'microsoft' as const, price: 699, interval: 'month' as const, priceEnvKey: 'STRIPE_PRICE_M_ENTERPRISE' },
}

export function getStripePrice(packageId: string): string {
  const pkg = PACKAGES[packageId as keyof typeof PACKAGES]
  if (!pkg) throw new Error(`Unknown package: ${packageId}`)
  const priceId = process.env[pkg.priceEnvKey]
  if (!priceId) throw new Error(`Missing env var: ${pkg.priceEnvKey}`)
  return priceId
}
