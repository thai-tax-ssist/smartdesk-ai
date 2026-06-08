-- Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  client_email text not null,
  client_name text,
  package_id text not null,
  platform text not null check (platform in ('google', 'microsoft')),
  requirement_brief text,
  stripe_payment_id text,
  stripe_session_id text,
  amount_paid integer,
  status text default 'new' check (status in ('new', 'building', 'qc', 'delivered')),
  document_link text,
  document_output jsonb,
  notes text
);

-- Subscriptions
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  client_email text not null,
  client_name text,
  package_id text not null,
  platform text not null,
  stripe_subscription_id text,
  status text default 'active' check (status in ('active', 'paused', 'cancelled')),
  next_billing_date date,
  documents_used_this_month integer default 0,
  documents_limit integer
);

-- Documents
create table documents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  order_id uuid references orders(id),
  subscription_id uuid references subscriptions(id),
  client_email text not null,
  title text,
  document_type text,
  platform text,
  document_link text,
  claude_output jsonb,
  delivered_at timestamp with time zone
);

-- Chat sessions
create table chat_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  session_id text unique not null,
  messages jsonb default '[]',
  client_email text,
  converted boolean default false,
  package_purchased text
);

-- RLS policies
alter table orders enable row level security;
alter table subscriptions enable row level security;
alter table documents enable row level security;
alter table chat_sessions enable row level security;

-- Allow service role full access (for API routes)
create policy "Service role full access on orders" on orders for all using (true);
create policy "Service role full access on subscriptions" on subscriptions for all using (true);
create policy "Service role full access on documents" on documents for all using (true);
create policy "Service role full access on chat_sessions" on chat_sessions for all using (true);
