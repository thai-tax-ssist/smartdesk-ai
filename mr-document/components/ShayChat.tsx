'use client'

import { useState, useEffect, useRef } from 'react'
import { Package } from '@/types'
import PackageCard from './PackageCard'

const GOOGLE_PACKAGES: Record<string, Package> = {
  g_trial: { id: 'g_trial', name: 'Starter Trial', tagline: '1 simple Google Sheet or Doc', price: 29, interval: 'one-time', platform: 'google', stripeKey: '', features: ['1 simple Google Sheet or Doc', 'Delivered within 48 hours'] },
  g_basic: { id: 'g_basic', name: 'Basic', tagline: '1 custom Sheet or Doc, formulas, guide', price: 75, interval: 'one-time', platform: 'google', stripeKey: '', features: ['1 custom Sheet or Doc', 'All formulas', 'User guide', '24hr delivery'] },
  g_pro: { id: 'g_pro', name: 'Monthly Pro', tagline: '5 files/month, automation, WhatsApp support', price: 299, interval: 'month', platform: 'google', stripeKey: '', popular: true, features: ['5 files/month', 'Automation', 'WhatsApp support', 'Free setup'] },
  g_enterprise: { id: 'g_enterprise', name: 'Enterprise', tagline: '50 files, full Apps Script, live support', price: 499, interval: 'month', platform: 'google', stripeKey: '', bestValue: true, features: ['50 files/month', 'Full Apps Script', 'Live support'] },
}

const MICROSOFT_PACKAGES: Record<string, Package> = {
  m_trial: { id: 'm_trial', name: 'Starter Trial', tagline: '1 simple Excel or Word file', price: 39, interval: 'one-time', platform: 'microsoft', stripeKey: '', features: ['1 simple Excel or Word file', 'Delivered within 48 hours'] },
  m_basic: { id: 'm_basic', name: 'Basic', tagline: '1 custom Excel or Word, macros, guide', price: 99, interval: 'one-time', platform: 'microsoft', stripeKey: '', features: ['1 custom Excel or Word', 'Macros included', 'User guide', '24hr delivery'] },
  m_pro: { id: 'm_pro', name: 'Monthly Pro', tagline: '5 files/month, VBA, WhatsApp support', price: 399, interval: 'month', platform: 'microsoft', stripeKey: '', popular: true, features: ['5 files/month', 'VBA automation', 'WhatsApp support', 'Free setup'] },
  m_enterprise: { id: 'm_enterprise', name: 'Enterprise', tagline: '50 files, full VBA + Power Automate', price: 699, interval: 'month', platform: 'microsoft', stripeKey: '', bestValue: true, features: ['50 files/month', 'VBA + Power Automate', 'Live support'] },
}

function getPackage(id: string): Package | null {
  return GOOGLE_PACKAGES[id] || MICROSOFT_PACKAGES[id] || null
}

async function initiateCheckout(packageId: string) {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ packageId }),
  })
  const data = await res.json()
  if (data.url) window.location.href = data.url
}

interface DisplayMessage {
  role: 'user' | 'assistant'
  content: string
  packageId?: string
}

export default function ShayChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<DisplayMessage[]>([
    { role: 'assistant', content: "Hi! I'm Shay from Mr. Document 👋 What does your business do?" },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(1)
  const [sessionId] = useState(() => Math.random().toString(36).slice(2))
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setOpen(true)
    document.addEventListener('open-shay', handler)
    return () => document.removeEventListener('open-shay', handler)
  }, [])

  useEffect(() => {
    if (open) {
      setUnread(0)
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [open, messages])

  async function send() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    const newMessages: DisplayMessage[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      const rawContent: string = data.content || "Sorry, I'm having a wee technical issue. Try again in a moment!"

      const packageMatch = rawContent.match(/SHOW_PACKAGE:(\w+)/)
      const cleanContent = rawContent.replace(/SHOW_PACKAGE:\w+/g, '').trim()

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: cleanContent, packageId: packageMatch?.[1] },
      ])

      if (!open) setUnread(n => n + 1)
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having a wee issue there. Give it another go!" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-14 h-14 rounded-full bg-[#1a472a] shadow-lg flex items-center justify-center hover:bg-[#2d6a4f] transition-colors relative"
        >
          <span className="text-2xl">💬</span>
          {unread > 0 && !open && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
              {unread}
            </span>
          )}
        </button>
      </div>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[370px] h-[560px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-[#1a472a] px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2d6a4f] flex items-center justify-center text-xl">🤝</div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">Shay</p>
              <p className="text-green-200 text-xs">Mr. Document · Cork, Ireland</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-green-200 hover:text-white text-xl leading-none">×</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-[#1a472a] text-white rounded-br-sm'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Package card */}
            {messages[messages.length - 1]?.packageId && (() => {
              const pkg = getPackage(messages[messages.length - 1].packageId!)
              return pkg ? (
                <div className="mt-2">
                  <PackageCard pkg={pkg} onPay={(p) => initiateCheckout(p.id)} compact />
                </div>
              ) : null
            })()}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white shadow-sm border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Type a message..."
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1a472a]"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="bg-[#1a472a] text-white px-3 py-2 rounded-xl hover:bg-[#2d6a4f] disabled:opacity-40 transition-colors"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  )
}
