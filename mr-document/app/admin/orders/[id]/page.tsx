'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Order } from '@/types'
import AdminOrderCard from '@/components/AdminOrderCard'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const secret = localStorage.getItem('admin_secret') || ''
    const res = await fetch('/api/admin/orders', { headers: { 'x-admin-secret': secret } })
    const data = await res.json()
    const found = (data.orders || []).find((o: Order) => o.id === id)
    setOrder(found || null)
    setLoading(false)
  }, [id])

  useEffect(() => { load() }, [load])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-[#1a472a] border-t-transparent rounded-full" /></div>

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link href="/admin" className="text-sm text-[#1a472a] hover:underline mb-6 inline-block">← Back to admin</Link>
        {!order ? (
          <p className="text-gray-500">Order not found.</p>
        ) : (
          <AdminOrderCard order={order} onRefresh={load} />
        )}
      </div>
    </>
  )
}
