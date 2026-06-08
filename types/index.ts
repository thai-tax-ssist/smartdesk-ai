export type PlanKey = 'trial' | 'starter' | 'pro' | 'white_label' | 'white_label_early_bird';
export type SubscriptionStatus = 'trialing' | 'active' | 'canceled' | 'past_due' | 'incomplete';
export type UserRole = 'user' | 'agency_admin' | 'super_admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  agency_id?: string;
  full_name?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  job_role?: string;
  use_type?: 'work' | 'personal';
  problem?: string;
  goal?: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  plan: PlanKey;
  status: SubscriptionStatus;
  trial_ends_at?: string;
  current_period_end?: string;
  card_collected: boolean;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  agency_id?: string;
  title?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  message_type: 'chat' | 'interview_question' | 'final_answer';
  created_at: string;
}

export interface UsageTracking {
  id: string;
  user_id: string;
  month: string;
  queries_used: number;
}

export interface EarlyBirdCounter {
  id: number;
  count: number;
  max_count: number;
  is_open: boolean;
}
