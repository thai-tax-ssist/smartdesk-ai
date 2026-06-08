import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const adminSecret = req.headers.get('x-admin-secret')
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  const total = orders?.length || 0
  const newCount = orders?.filter(o => o.status === 'new').length || 0
  const mrr = orders
    ?.filter(o => ['g_pro', 'g_enterprise', 'm_pro', 'm_enterprise'].includes(o.package_id))
    .reduce((sum, o) => sum + (o.amount_paid || 0), 0) / 100 || 0

  return NextResponse.json({ orders: orders || [], stats: { total, newCount, mrr } })
}
