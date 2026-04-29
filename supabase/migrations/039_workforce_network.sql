-- 039_workforce_network.sql
-- Workforce Network Phase 1: employer_intent, cohorts, certification_enrollments

-- ─── Employer Intent ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS employer_intent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  contact_title TEXT,
  role_type TEXT NOT NULL CHECK (role_type IN (
    'robot_tech', 'cobot_programmer', 'amr_fleet', 'drone_pilot', 'safety_inspector', 'other'
  )),
  role_type_other TEXT,
  hires_needed INTEGER NOT NULL DEFAULT 1,
  timeline TEXT NOT NULL CHECK (timeline IN (
    'immediately', '1_3_months', '3_6_months', '6_12_months', 'exploring'
  )),
  salary_min INTEGER,
  salary_max INTEGER,
  willingness_to_pay TEXT CHECK (willingness_to_pay IN (
    'yes_percentage', 'yes_flat_fee', 'not_yet', 'need_more_info'
  )),
  notes TEXT,
  source TEXT DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN (
    'new', 'contacted', 'qualified', 'closed_won', 'closed_lost'
  )),
  contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: public insert (form submission), admin read/update
ALTER TABLE employer_intent ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit employer intent"
  ON employer_intent FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read employer intent"
  ON employer_intent FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update employer intent"
  ON employer_intent FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ─── Cohorts ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 10,
  enrolled_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN (
    'open', 'full', 'in_progress', 'completed'
  )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cohorts"
  ON cohorts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update cohorts"
  ON cohorts FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert cohorts"
  ON cohorts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ─── Certification Enrollments ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS certification_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  cohort_id UUID NOT NULL REFERENCES cohorts(id),
  tier TEXT NOT NULL DEFAULT 'standard' CHECK (tier IN ('early_bird', 'standard')),
  amount_paid_cents INTEGER,
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN (
    'pending', 'paid', 'refunded'
  )),
  completion_status TEXT NOT NULL DEFAULT 'not_started' CHECK (completion_status IN (
    'not_started', 'in_progress', 'completed', 'dropped'
  )),
  placement_status TEXT NOT NULL DEFAULT 'not_applicable' CHECK (placement_status IN (
    'not_applicable', 'seeking', 'matched', 'placed', 'declined'
  )),
  employer_id_placed_with UUID REFERENCES employer_intent(id),
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  placed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE certification_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own enrollments"
  ON certification_enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can read all enrollments"
  ON certification_enrollments FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "System can insert enrollments"
  ON certification_enrollments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update enrollments"
  ON certification_enrollments FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ─── Seed Cohort 1 ────────────────────────────────────────────────
INSERT INTO cohorts (name, slug, start_date, end_date, capacity)
VALUES (
  'Operator Level 1 — Cohort 1',
  'operator-l1-cohort-1',
  (CURRENT_DATE + INTERVAL '28 days')::date,
  (CURRENT_DATE + INTERVAL '56 days')::date,
  10
) ON CONFLICT (slug) DO NOTHING;

-- ─── Updated_at triggers ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_workforce_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER employer_intent_updated_at
  BEFORE UPDATE ON employer_intent
  FOR EACH ROW EXECUTE FUNCTION update_workforce_updated_at();

CREATE TRIGGER certification_enrollments_updated_at
  BEFORE UPDATE ON certification_enrollments
  FOR EACH ROW EXECUTE FUNCTION update_workforce_updated_at();
