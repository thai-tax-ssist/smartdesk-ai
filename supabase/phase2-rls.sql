-- ═══════════════════════════════════════════
-- SUPER ADMIN POLICIES
-- ═══════════════════════════════════════════

CREATE POLICY "Super admin sees all users"
  ON users FOR SELECT
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'super_admin'));

CREATE POLICY "Super admin manages agencies"
  ON agencies FOR ALL
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'super_admin'));

CREATE POLICY "Super admin sees all subscriptions"
  ON subscriptions FOR ALL
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'super_admin'));

CREATE POLICY "Super admin sees all conversations"
  ON conversations FOR SELECT
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'super_admin'));

CREATE POLICY "Super admin manages tickets"
  ON support_tickets FOR ALL
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'super_admin'));

CREATE POLICY "Super admin manages early bird"
  ON early_bird_counter FOR ALL
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'super_admin'));

-- ═══════════════════════════════════════════
-- AGENCY ADMIN POLICIES
-- ═══════════════════════════════════════════

CREATE POLICY "Agency admin sees own agency users"
  ON users FOR SELECT
  USING (agency_id IN (
    SELECT agency_id FROM users WHERE id = auth.uid() AND role = 'agency_admin'
  ));

CREATE POLICY "Agency admin manages own white label settings"
  ON white_label_settings FOR ALL
  USING (agency_id IN (
    SELECT agency_id FROM users WHERE id = auth.uid() AND role = 'agency_admin'
  ));

CREATE POLICY "Agency admin sees own agency usage"
  ON usage_tracking FOR SELECT
  USING (user_id IN (
    SELECT u.id FROM users u
    WHERE u.agency_id IN (
      SELECT agency_id FROM users WHERE id = auth.uid() AND role = 'agency_admin'
    )
  ));

CREATE POLICY "Agency admin sees own agency conversations"
  ON conversations FOR SELECT
  USING (agency_id IN (
    SELECT agency_id FROM users WHERE id = auth.uid() AND role = 'agency_admin'
  ));

-- ═══════════════════════════════════════════
-- STORAGE BUCKET FOR AGENCY LOGOS
-- ═══════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public)
VALUES ('agency-logos', 'agency-logos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Agency admins upload logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'agency-logos'
  AND auth.uid() IN (SELECT id FROM users WHERE role IN ('agency_admin', 'super_admin'))
);

CREATE POLICY "Public read agency logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'agency-logos');

-- ═══════════════════════════════════════════
-- PROMOTE YOUR ACCOUNT TO SUPER ADMIN
-- Replace email before running:
-- ═══════════════════════════════════════════

-- UPDATE users SET role = 'super_admin' WHERE email = 'your-email@example.com';
