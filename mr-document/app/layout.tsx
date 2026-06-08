import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mr. Document — Your Documents, Sorted.',
  description: 'Professional document automation for Irish businesses. Google Sheets, Excel, Google Docs, Word — built and delivered within 24 hours. Based in Cork, Ireland.',
  keywords: 'document automation, Google Sheets, Excel, Cork Ireland, SMB, sole trader',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
