'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

function SuccessContent() {
  const params = useSearchParams()
  const sessionId = params.get('session_id')

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        Thanks! Shay will be in touch within 24 hours.
      </h1>
      <p className="text-gray-500 text-lg mb-3 max-w-lg">
        Your payment was successful and your order has been created.
      </p>
      {sessionId && (
        <p className="text-sm text-gray-400 mb-8 font-mono bg-gray-100 px-3 py-1.5 rounded">
          Order ref: {sessionId.slice(0, 20)}...
        </p>
      )}

      <div className="bg-[#f0f7f4] rounded-2xl p-8 max-w-md w-full mb-8 text-left">
        <h2 className="font-bold text-gray-900 mb-4">What happens next</h2>
        <ol className="space-y-3">
          {[
            'Our team reviews your requirements',
            'We build your custom document using your brief',
            'You receive your document link within 24 hours',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="w-6 h-6 rounded-full bg-[#1a472a] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        <Link href="/dashboard" className="bg-[#1a472a] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#2d6a4f] transition-colors">
          Go to dashboard →
        </Link>
        <Link href="/" className="border border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
          Back to home
        </Link>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </>
  )
}
