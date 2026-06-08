'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { Order } from '@/types'
import AdminOrderCard from '@/components/AdminOrderCard'

const STATUS_TABS = ['all', 'new', 'building', 'qc', 'delivered'] as const

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<typeof STATUS_TABS[number]>('all')
  const [secret, setSecret] = useState('')
  const [authed, setAuthed] = useState(false)
  const [stats, setStats] = useState({ total: 0, newCount: 0, mrr: 0 })

  function login(e: React.FormEvent) {
    e.preventDefault()
    localStorage.setItem('admin_secret', secret)
    setAuthed(true)
    loadOrders(secret)
  }

  async function loadOrders(s?: string) {
    const adminSecret = s || localStorage.getItem('admin_secret') || ''
    setLoading(true)
    const res = await fetch('/api/admin/orders', { headers: { 'x-admin-secret': adminSecret } })
    if (res.status === 401) { setAuthed(false); setLoading(false); return }
    const data = await res.json()
    setOrders(data.orders || [])
    setStats(data.stats || { total: 0, newCount: 0, mrr: 0 })
    setAuthed(true)
    setLoading(false)
  }

  useEffect(() => {
    const saved = localStorage.getItem('admin_secret')
    if (saved) { setSecret(saved); loadOrders(saved) }
    else setLoading(false)
  }, [])

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={login} className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm space-y-4">
          <h1 className="text-xl font-bold text-gray-900">Admin Login</h1>
          <input
            type="password"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            placeholder="Admin secret key"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1a472a]"
          />
          <button type="submit" className="w-full bg-[#1a472a] text-white py-3 rounded-xl font-medium">Login</button>
        </form>
      </div>
    )
  }

  const filtered = tab === 'all' ? orders : orders.filter(o => o.status === tab)

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button onClick={() => { localStorage.removeItem('admin_secret'); setAuthed(false) }} className="text-sm text-gray-400 hover:text-red-500">Sign out</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Orders', value: stats.total },
            { label: 'New Orders', value: stats.newCount },
            { label: 'Est. MRR', value: `€${stats.mrr}` },
          ].map(s => (
            <div key={s.label} className="bg-[#f0f7f4] rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-[#1a472a]">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {STATUS_TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-[#1a472a] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {t} {t !== 'all' && `(${orders.filter(o => o.status === t).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No orders found.</div>
        ) : (
          <div className="space-y-4">
            {filtered.map(order => (
              <AdminOrderCard key={order.id} order={order} onRefresh={() => loadOrders()} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
