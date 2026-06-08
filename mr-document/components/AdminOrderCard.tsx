'use client'

import { useState } from 'react'
import { Order, DocumentOutput } from '@/types'

const QC_ITEMS = [
  'Document opens correctly',
  'All formulas/macros working',
  'Data validation in place',
  'User guide included',
  'Formatting matches brief',
]

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  building: 'bg-yellow-100 text-yellow-700',
  qc: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
}

interface AdminOrderCardProps {
  order: Order
  onRefresh: () => void
}

export default function AdminOrderCard({ order, onRefresh }: AdminOrderCardProps) {
  const [building, setBuilding] = useState(false)
  const [output, setOutput] = useState<DocumentOutput | null>(order.document_output || null)
  const [qcChecked, setQcChecked] = useState<boolean[]>(Array(5).fill(false))
  const [docLink, setDocLink] = useState(order.document_link || '')
  const [delivering, setDelivering] = useState(false)
  const [expanded, setExpanded] = useState(false)

  async function buildWithClaude() {
    setBuilding(true)
    const adminSecret = typeof window !== 'undefined' ? localStorage.getItem('admin_secret') || '' : ''
    try {
      const res = await fetch('/api/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': adminSecret },
        body: JSON.stringify({ orderId: order.id }),
      })
      const data = await res.json()
      if (data.output) setOutput(data.output)
    } finally {
      setBuilding(false)
    }
  }

  async function markDelivered() {
    if (!docLink) return alert('Add document link first')
    setDelivering(true)
    const adminSecret = typeof window !== 'undefined' ? localStorage.getItem('admin_secret') || '' : ''
    try {
      const res = await fetch('/api/admin/deliver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': adminSecret },
        body: JSON.stringify({ orderId: order.id, documentLink: docLink }),
      })
      if (res.ok) onRefresh()
    } finally {
      setDelivering(false)
    }
  }

  const allQcPassed = qcChecked.every(Boolean)

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
              {order.status}
            </span>
            <span className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('en-IE')}</span>
          </div>
          <p className="font-semibold text-gray-900">{order.client_email}</p>
          <p className="text-sm text-gray-500">{order.package_id} · {order.platform} · €{(order.amount_paid || 0) / 100}</p>
        </div>
        <button onClick={() => setExpanded(e => !e)} className="text-[#1a472a] text-sm font-medium">
          {expanded ? 'Collapse ↑' : 'Expand ↓'}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-5 space-y-5">
          {order.requirement_brief && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Client Brief</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{order.requirement_brief}</p>
            </div>
          )}

          {!output && order.status !== 'delivered' && (
            <button
              onClick={buildWithClaude}
              disabled={building}
              className="w-full bg-[#1a472a] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#2d6a4f] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              {building ? (
                <><span className="animate-spin">⚙</span> Building with AI...</>
              ) : (
                '🤖 Build with Claude'
              )}
            </button>
          )}

          {output && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Claude&apos;s Output</p>
              <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-2">
                <p><strong>Type:</strong> {output.type}</p>
                <p><strong>Title:</strong> {output.title}</p>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                {output.tabs && (
                  <div>
                    <strong>Tabs:</strong>
                    <ul className="list-disc ml-4 mt-1">
                      {output.tabs.map((t, i) => <li key={i}>{t.name}: {t.purpose}</li>)}
                    </ul>
                  </div>
                )}
                {output.setupSteps && (
                  <div>
                    <strong>Setup Steps:</strong>
                    <ol className="list-decimal ml-4 mt-1">
                      {output.setupSteps.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                  </div>
                )}
                {(output.automationScript || output.vbaCode) && (
                  <details>
                    <summary className="cursor-pointer font-medium text-[#1a472a]">View Script</summary>
                    <pre className="mt-2 text-xs overflow-auto max-h-40 bg-gray-900 text-green-300 rounded p-2">
                      {output.automationScript || output.vbaCode}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          )}

          {output && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">QC Checklist</p>
              <div className="space-y-2">
                {QC_ITEMS.map((item, i) => (
                  <label key={i} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={qcChecked[i]}
                      onChange={e => setQcChecked(prev => { const n = [...prev]; n[i] = e.target.checked; return n })}
                      className="w-4 h-4 accent-[#1a472a]"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
          )}

          {output && allQcPassed && order.status !== 'delivered' && (
            <div className="space-y-2">
              <input
                type="url"
                value={docLink}
                onChange={e => setDocLink(e.target.value)}
                placeholder="https://docs.google.com/..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a472a]"
              />
              <button
                onClick={markDelivered}
                disabled={delivering || !docLink}
                className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-60 transition-colors"
              >
                {delivering ? 'Delivering...' : '✅ Mark as Delivered'}
              </button>
            </div>
          )}

          {order.status === 'delivered' && order.document_link && (
            <a href={order.document_link} target="_blank" rel="noopener noreferrer" className="text-[#1a472a] text-sm underline">
              View delivered document →
            </a>
          )}
        </div>
      )}
    </div>
  )
}
