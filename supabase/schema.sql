-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- AGENCIES TABLE
CREATE TABLE agencies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#6366f1',
  domain TEXT UNIQUE,
  plan TEXT DEFAULT 'white_label' CHECK (plan IN ('white_label', 'white_label_early_bird')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- USERS TABLE
CREATE TABLE users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'agency_admin', 'super_admin')),
  agency_id UUID REFERENCES agencies(id),
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- USER PROFILES (onboarding data)
CREATE TABLE user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  job_role TEXT,
  use_type TEXT CHECK (use_type IN ('work', 'personal')),
  problem TEXT,
  goal TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SUBSCRIPTIONS
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT DEFAULT 'trial' CHECK (plan IN ('trial', 'starter', 'pro', 'white_label', 'white_label_early_bird')),
  status TEXT DEFAULT 'trialing' CHECK (status IN ('trialing', 'active', 'canceled', 'past_due', 'incomplete')),
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  current_period_end TIMESTAMPTZ,
  card_collected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONVERSATIONS
CREATE TABLE conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  agency_id UUID REFERENCES agencies(id),
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MESSAGES
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'chat' CHECK (message_type IN ('chat', 'interview_question', 'final_answer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- USAGE TRACKING
CREATE TABLE usage_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  queries_used INTEGER DEFAULT 0,
  UNIQUE(user_id, month)
);

-- WHITE LABEL SETTINGS
CREATE TABLE white_label_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE UNIQUE,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#6366f1',
  custom_domain TEXT,
  welcome_message TEXT,
  ai_personality TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EARLY BIRD COUNTER
CREATE TABLE early_bird_counter (
  id INTEGER DEFAULT 1 PRIMARY KEY CHECK (id = 1),
  count INTEGER DEFAULT 0,
  max_count INTEGER DEFAULT 100,
  is_open BOOLEAN DEFAULT TRUE
);

INSERT INTO early_bird_counter (id, count, max_count, is_open) VALUES (1, 0, 100, true);

-- SUPPORT TICKETS
CREATE TABLE support_tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  agency_id UUID REFERENCES agencies(id),
  conversation_history JSONB,
  problem_summary TEXT,
  customer_name TEXT,
  customer_email TEXT,
  current_plan TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE white_label_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users see own user_profile" ON user_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users see own conversations" ON conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own messages" ON messages FOR ALL
  USING (conversation_id IN (SELECT id FROM conversations WHERE user_id = auth.uid()));
CREATE POLICY "Users see own usage" ON usage_tracking FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public read early bird" ON early_bird_counter FOR SELECT TO anon, authenticated USING (true);
