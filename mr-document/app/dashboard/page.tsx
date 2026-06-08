'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Document, Subscription } from '@/types'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ShayChat from '@/components/ShayChat'

export default function DashboardPage() {
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [docs, setDocs] = useState<Document[]>([])
  const [subs, setSubs] = useState<Subscription[]>([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user?.email) {
        loadData(data.user.email)
      }
      setLoading(false)
    })
  }, [])

  async function loadData(email: string) {
    const [docsRes, subsRes] = await Promise.all([
      supabase.from('documents').select('*').eq('client_email', email).order('created_at', { ascending: false }),
      supabase.from('subscriptions').select('*').eq('client_email', email).eq('status', 'active'),
    ])
    if (docsRes.data) setDocs(docsRes.data)
    if (subsRes.data) setSubs(subsRes.data)
  }

  async function signIn(email: string) {
    await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.href } })
    alert(`Magic link sent to ${email}! Check your inbox.`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#1a472a] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 w-full max-w-md text-center">
            <div className="text-4xl mb-4">🔐</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Client Login</h1>
            <p className="text-gray-500 mb-6 text-sm">Enter your email and we&apos;ll send a magic link.</p>
            <form
              onSubmit={e => {
                e.preventDefault()
                const email = (e.target as HTMLFormElement).email.value
                signIn(email)
              }}
              className="space-y-3"
            >
              <input
                name="email"
                type="email"
                required
                placeholder="your@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1a472a]"
              />
              <button type="submit" className="w-full bg-[#1a472a] text-white py-3 rounded-xl font-medium hover:bg-[#2d6a4f] transition-colors">
                Send magic link
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-4">No password needed. Just click the link in your email.</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
          <button
            onClick={() => supabase.auth.signOut().then(() => setUser(null))}
            className="text-sm text-gray-500 hover:text-red-500"
          >
            Sign out
          </button>
        </div>

        {/* Active Subscriptions */}
        {subs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Active Subscriptions</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {subs.map(sub => (
                <div key={sub.id} className="bg-[#f0f7f4] rounded-xl p-4 border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{sub.package_id}</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Active</span>
                  </div>
                  <p className="text-sm text-gray-500">{sub.platform} · {sub.documents_used_this_month}/{sub.documents_limit || '∞'} docs used</p>
                  {sub.next_billing_date && (
                    <p className="text-xs text-gray-400 mt-1">Next billing: {new Date(sub.next_billing_date).toLocaleDateString('en-IE')}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Documents */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Documents</h2>
          {docs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <div className="text-3xl mb-3">📄</div>
              <p className="text-gray-500">No documents yet.</p>
              <p className="text-sm text-gray-400 mt-1">Your delivered documents will appear here.</p>
              <button
                onClick={() => document.dispatchEvent(new CustomEvent('open-shay'))}
                className="mt-4 bg-[#1a472a] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#2d6a4f] transition-colors"
              >
                Chat with Shay →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {docs.map(doc => (
                <div key={doc.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{doc.title || 'Untitled document'}</p>
                    <p className="text-sm text-gray-400">
                      {doc.platform} · {doc.document_type} ·{' '}
                      {doc.delivered_at ? new Date(doc.delivered_at).toLocaleDateString('en-IE') : 'Pending'}
                    </p>
                  </div>
                  {doc.document_link && (
                    <a
                      href={doc.document_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#1a472a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2d6a4f] transition-colors ml-4 flex-shrink-0"
                    >
                      Open ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Support */}
        <section className="bg-[#f0f7f4] rounded-2xl p-6 text-center">
          <p className="font-semibold text-gray-900 mb-1">Need help? Chat with Shay</p>
          <p className="text-sm text-gray-500 mb-4">She can help with your existing documents or new requests.</p>
          <button
            onClick={() => document.dispatchEvent(new CustomEvent('open-shay'))}
            className="bg-[#1a472a] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#2d6a4f] transition-colors"
          >
            💬 Chat with Shay
          </button>
        </section>
      </div>
      <Footer />
      <ShayChat />
    </>
  )
}
