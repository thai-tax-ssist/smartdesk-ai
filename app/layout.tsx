import type { Metadata } from 'next';
import { Sora, DM_Sans } from 'next/font/google';
import './globals.css';
import { SupportWidget } from '@/components/support/SupportWidget';

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
  description: 'Stop getting useless AI answers. SmartDesk interviews you first, then delivers answers that actually work.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable} h-full`}>
      <body className="min-h-full bg-slate-950 text-slate-100 font-sans antialiased" style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}>
        {children}
        <SupportWidget />
      </body>
    </html>
  );
}
