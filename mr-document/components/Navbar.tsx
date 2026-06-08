'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1a472a] rounded-lg flex items-center justify-center text-white font-bold text-sm">M</div>
          <span className="font-bold text-[#1a472a] text-lg">Mr. Document</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/#services" className="hover:text-[#1a472a]">Services</Link>
          <Link href="/#how-it-works" className="hover:text-[#1a472a]">How it works</Link>
          <Link href="/#pricing" className="hover:text-[#1a472a]">Pricing</Link>
          <Link href="/#contact" className="hover:text-[#1a472a]">Contact</Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => document.dispatchEvent(new CustomEvent('open-shay'))}
            className="hidden md:inline-flex items-center gap-2 bg-[#1a472a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2d6a4f] transition-colors"
          >
            <span>💬</span> Chat with Shay
          </button>
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4 text-sm font-medium text-gray-700">
          <Link href="/#services" onClick={() => setMenuOpen(false)}>Services</Link>
          <Link href="/#how-it-works" onClick={() => setMenuOpen(false)}>How it works</Link>
          <Link href="/#pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
          <Link href="/#contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          <button
            onClick={() => { setMenuOpen(false); document.dispatchEvent(new CustomEvent('open-shay')) }}
            className="bg-[#1a472a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2d6a4f] transition-colors w-full"
          >
            💬 Chat with Shay
          </button>
        </div>
      )}
    </nav>
  )
}
