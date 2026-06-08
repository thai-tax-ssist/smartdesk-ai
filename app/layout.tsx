import type { Metadata } from 'next';
import { Sora, DM_Sans } from 'next/font/google';
import './globals.css';
import { SupportWidget } from '@/components/support/SupportWidget';
import { CookieBanner } from '@/components/legal/CookieBanner';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SmartDesk.ai — AI That Actually Understands You',
  description: 'Stop getting generic AI answers. SmartDesk interviews you first, like a doctor diagnosing symptoms, then gives you accurate, actionable answers. 14-day free trial.',
  keywords: 'AI assistant, smart AI, business AI Ireland, AI for SMB, AI interview system',
  openGraph: {
    title: 'SmartDesk.ai — AI That Actually Understands You',
    description: 'Stop getting useless AI answers. SmartDesk asks the right questions first.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    url: 'https://smartdesk.ai',
    type: 'website',
    siteName: 'SmartDesk.ai',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartDesk.ai',
    description: 'AI that interviews you before answering.',
    images: ['/og-image.png'],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://smartdesk.ai'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable} h-full`}>
      <body className="min-h-full bg-slate-950 text-slate-100 font-sans antialiased" style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}>
        {children}
        <SupportWidget />
        <CookieBanner />
      </body>
    </html>
  );
}
