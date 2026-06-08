export type Platform = 'google' | 'microsoft'

export type OrderStatus = 'new' | 'building' | 'qc' | 'delivered'

export type SubscriptionStatus = 'active' | 'paused' | 'cancelled'

export interface Order {
  id: string
  created_at: string
  client_email: string
  client_name?: string
  package_id: string
  platform: Platform
  requirement_brief?: string
  stripe_payment_id?: string
  stripe_session_id?: string
  amount_paid?: number
  status: OrderStatus
  document_link?: string
  document_output?: DocumentOutput
  notes?: string
}

export interface Subscription {
  id: string
  created_at: string
  client_email: string
  client_name?: string
  package_id: string
  platform: Platform
  stripe_subscription_id?: string
  status: SubscriptionStatus
  next_billing_date?: string
  documents_used_this_month: number
  documents_limit?: number
}

export interface Document {
  id: string
  created_at: string
  order_id?: string
  subscription_id?: string
  client_email: string
  title?: string
  document_type?: string
  platform?: string
  document_link?: string
  claude_output?: DocumentOutput
  delivered_at?: string
}

export interface ChatSession {
  id: string
  created_at: string
  session_id: string
  messages: ChatMessage[]
  client_email?: string
  converted: boolean
  package_purchased?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface Package {
  id: string
  name: string
  tagline: string
  price: number
  interval: 'one-time' | 'month'
  platform: Platform
  features: string[]
  popular?: boolean
  bestValue?: boolean
  stripeKey: string
}

export interface DocumentOutput {
  type: 'google_sheets' | 'excel' | 'google_docs' | 'word'
  title: string
  description?: string
  tabs?: SheetTab[]
  sections?: DocSection[]
  automationScript?: string
  vbaCode?: string
  setupSteps?: string[]
  guideContent?: string
}

export interface SheetTab {
  name: string
  purpose: string
  columns: SheetColumn[]
  conditionalFormatting?: string[]
  tips?: string[]
}

export interface SheetColumn {
  col: string
  header: string
  type: 'text' | 'number' | 'date' | 'formula' | 'dropdown'
  example?: string
  formula?: string
  validation?: string
}

export interface DocSection {
  heading: string
  content: string
  formatting?: string
}
