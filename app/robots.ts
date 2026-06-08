import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://smartdesk.ai';
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/privacy', '/terms', '/cookies'],
      disallow: ['/admin', '/agency', '/dashboard', '/api', '/onboarding', '/billing', '/chat'],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
