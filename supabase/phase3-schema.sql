-- Phase 3: Invoices + Email Logs tables

-- INVOICES TABLE
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  agency_id UUID REFERENCES agencies(id),
  stripe_invoice_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  invoice_number TEXT UNIQUE,

  customer_name TEXT,
  customer_email TEXT,
  customer_address TEXT,
  customer_vat_number TEXT,

  plan_name TEXT,
  description TEXT,

  amount_excl_vat INTEGER,
  vat_rate DECIMAL DEFAULT 0.23,
  vat_amount INTEGER,
  amount_incl_vat INTEGER,

  setup_fee_excl_vat INTEGER DEFAULT 0,
  setup_fee_vat INTEGER DEFAULT 0,
  setup_fee_incl_vat INTEGER DEFAULT 0,

  status TEXT DEFAULT 'paid' CHECK (status IN ('paid', 'unpaid', 'void')),
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  due_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ
);

CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL THEN
    NEW.invoice_number := 'SDI-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('invoice_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_invoice_number ON invoices;
CREATE TRIGGER set_invoice_number
  BEFORE INSERT ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION generate_invoice_number();

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own invoices" ON invoices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Super admin manages invoices" ON invoices FOR ALL
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'super_admin'));

-- EMAIL LOGS TABLE
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  email_type TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT
);

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Super admin sees email logs" ON email_logs FOR ALL
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'super_admin'));

-- Add onboarding_step column to white_label_settings
ALTER TABLE white_label_settings ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0;
ALTER TABLE white_label_settings ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE white_label_settings ADD COLUMN IF NOT EXISTS assistant_name TEXT;
ALTER TABLE white_label_settings ADD COLUMN IF NOT EXISTS industry_focus TEXT[];
