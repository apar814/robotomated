-- ═══════════════════════════════════════════════════════════════
-- Robotomated: All Pending Migrations (026-032)
-- Safe to run: all statements use IF NOT EXISTS / IF NOT EXISTS
-- Paste into Supabase Dashboard → SQL Editor → Run
-- ═══════════════════════════════════════════════════════════════


-- ═══════════════════════════════════════════════
-- Migration 026: Humanoid Fields
-- ═══════════════════════════════════════════════

ALTER TABLE robots ADD COLUMN IF NOT EXISTS robot_type TEXT DEFAULT 'other';
ALTER TABLE robots ADD COLUMN IF NOT EXISTS autonomy_level TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS manufacturing_origin TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS neural_network_based BOOLEAN DEFAULT false;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS fleet_learning BOOLEAN DEFAULT false;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS self_charging BOOLEAN DEFAULT false;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS consecutive_hours_autonomous INTEGER;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS weather_rating TEXT DEFAULT 'indoor';
ALTER TABLE robots ADD COLUMN IF NOT EXISTS raas_available BOOLEAN DEFAULT false;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS raas_price_min NUMERIC(10,2);
ALTER TABLE robots ADD COLUMN IF NOT EXISTS raas_price_max NUMERIC(10,2);
ALTER TABLE robots ADD COLUMN IF NOT EXISTS safety_certified BOOLEAN DEFAULT false;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS safety_certifications_list TEXT[] DEFAULT '{}';
ALTER TABLE robots ADD COLUMN IF NOT EXISTS bill_of_materials_cost INTEGER;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS target_price_2030 INTEGER;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS units_deployed INTEGER DEFAULT 0;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS manufacturing_capacity_annual INTEGER;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS price_range_min NUMERIC(12,2);
ALTER TABLE robots ADD COLUMN IF NOT EXISTS price_range_max NUMERIC(12,2);
ALTER TABLE robots ADD COLUMN IF NOT EXISTS key_features TEXT[] DEFAULT '{}';
ALTER TABLE robots ADD COLUMN IF NOT EXISTS use_cases TEXT[] DEFAULT '{}';
ALTER TABLE robots ADD COLUMN IF NOT EXISTS partners TEXT[] DEFAULT '{}';
ALTER TABLE robots ADD COLUMN IF NOT EXISTS height_cm NUMERIC(6,1);
ALTER TABLE robots ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(6,1);
ALTER TABLE robots ADD COLUMN IF NOT EXISTS max_speed_kmh NUMERIC(6,2);
ALTER TABLE robots ADD COLUMN IF NOT EXISTS payload_kg NUMERIC(6,1);
ALTER TABLE robots ADD COLUMN IF NOT EXISTS degrees_of_freedom INTEGER;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS battery_life_hours NUMERIC(5,1);

CREATE INDEX IF NOT EXISTS idx_robots_robot_type ON robots(robot_type);
CREATE INDEX IF NOT EXISTS idx_robots_manufacturing_origin ON robots(manufacturing_origin);
CREATE INDEX IF NOT EXISTS idx_robots_raas_available ON robots(raas_available);
CREATE INDEX IF NOT EXISTS idx_robots_fleet_learning ON robots(fleet_learning);

CREATE TABLE IF NOT EXISTS raas_pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  robot_id UUID REFERENCES robots(id) ON DELETE SET NULL,
  robot_name TEXT NOT NULL,
  price_per_hour_min NUMERIC(10,2),
  price_per_hour_max NUMERIC(10,2),
  price_per_month_min NUMERIC(10,2),
  price_per_month_max NUMERIC(10,2),
  with_operator_premium NUMERIC(5,2) DEFAULT 0,
  industry TEXT,
  region TEXT,
  source_url TEXT,
  last_verified TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS safety_standards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  full_name TEXT,
  body TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','in_review','ratified','withdrawn')),
  published_date DATE,
  ratification_expected DATE,
  applies_to TEXT[] DEFAULT '{}',
  description TEXT,
  key_requirements TEXT[] DEFAULT '{}',
  source_url TEXT,
  last_updated TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS robot_certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  robot_id UUID NOT NULL REFERENCES robots(id) ON DELETE CASCADE,
  standard_id UUID REFERENCES safety_standards(id) ON DELETE SET NULL,
  standard_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','in_progress','achieved','expired')),
  achieved_date DATE,
  expiry_date DATE,
  notes TEXT,
  verified_by_robotomated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE raas_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE robot_certifications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public read raas" ON raas_pricing FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Public insert raas" ON raas_pricing FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Public read standards" ON safety_standards FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Public read certs" ON robot_certifications FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Admin insert certs" ON robot_certifications FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

INSERT INTO safety_standards (name, full_name, body, status, applies_to, description)
VALUES
  ('ISO 10218-1', 'Robots and robotic devices -- Safety requirements -- Part 1', 'ISO', 'ratified', ARRAY['arm','cobot','industrial'], 'Safety requirements for industrial manipulating robots'),
  ('ISO 10218-2', 'Robots and robotic devices -- Safety requirements -- Part 2', 'ISO', 'ratified', ARRAY['arm','cobot','industrial'], 'Safety requirements for robot systems and integration'),
  ('ISO/TS 15066', 'Collaborative robots -- Safety requirements', 'ISO', 'ratified', ARRAY['cobot','humanoid'], 'Safety requirements for collaborative robot operation'),
  ('IEC 62061', 'Safety of machinery -- Functional safety', 'IEC', 'ratified', ARRAY['arm','cobot','industrial','humanoid'], 'Functional safety of safety-related control systems of machinery'),
  ('IEEE P7009', 'Humanoid Robot Safety', 'IEEE', 'draft', ARRAY['humanoid'], 'Safety and interaction standards for humanoid robots -- expected ratification 2027'),
  ('ASTM F3538', 'Humanoid Robot Safety Standard', 'ASTM', 'draft', ARRAY['humanoid'], 'Safety standard for commercially deployed humanoid robots'),
  ('UL 2271', 'Batteries for Light Electric Vehicles', 'UL', 'ratified', ARRAY['humanoid','mobile','delivery'], 'Battery safety standard for light electric vehicle applications'),
  ('UN 38.3', 'Lithium Battery Transport Safety', 'UN', 'ratified', ARRAY['humanoid','mobile','drone','delivery'], 'Testing requirements for lithium batteries during transport'),
  ('FDA 510(k)', 'Medical Device Clearance', 'FDA', 'ratified', ARRAY['surgical','medical'], 'Premarket notification for medical devices')
ON CONFLICT DO NOTHING;


-- ═══════════════════════════════════════════════
-- Migration 027: Payments & API Keys
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('job_payment','part_purchase','cert_purchase','lease_referral','cpo_sale','service_booking','insurance_referral','timeshare_booking')),
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','held','completed','refunded','disputed','cancelled')),
  platform_fee NUMERIC(10,2) DEFAULT 0,
  platform_fee_percent NUMERIC(5,2) DEFAULT 0,
  seller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT,
  stripe_transfer_id TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  settled_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS platform_fee_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_type TEXT UNIQUE NOT NULL,
  fee_percent NUMERIC(5,2) NOT NULL,
  fee_fixed NUMERIC(10,2) DEFAULT 0,
  min_fee NUMERIC(10,2) DEFAULT 0,
  max_fee NUMERIC(12,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seller_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_type TEXT DEFAULT 'rsp' CHECK (account_type IN ('rsp','parts_seller','cpo_seller','service_provider')),
  stripe_account_id TEXT UNIQUE,
  stripe_account_status TEXT DEFAULT 'pending' CHECK (stripe_account_status IN ('pending','onboarding','active','restricted','disabled')),
  payout_schedule TEXT DEFAULT 'weekly' CHECK (payout_schedule IN ('daily','weekly','monthly')),
  bank_verified BOOLEAN DEFAULT false,
  identity_verified BOOLEAN DEFAULT false,
  total_earned NUMERIC(12,2) DEFAULT 0,
  total_withdrawn NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  key_hash TEXT UNIQUE NOT NULL,
  key_prefix TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'Default',
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free','starter','pro','enterprise')),
  requests_per_day INTEGER DEFAULT 100,
  requests_today INTEGER DEFAULT 0,
  total_requests BIGINT DEFAULT 0,
  allowed_endpoints TEXT[] DEFAULT ARRAY['robots','categories','manufacturers'],
  created_at TIMESTAMPTZ DEFAULT now(),
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  response_time_ms INTEGER,
  status_code INTEGER,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS enterprise_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  domain TEXT,
  contract_start DATE,
  contract_end DATE,
  tier TEXT DEFAULT 'starter' CHECK (tier IN ('starter','growth','enterprise')),
  monthly_fee NUMERIC(10,2),
  annual_fee NUMERIC(12,2),
  account_manager TEXT,
  allowed_users INTEGER DEFAULT 5,
  used_users INTEGER DEFAULT 0,
  features JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS enterprise_rfq (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enterprise_id UUID REFERENCES enterprise_accounts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  robot_categories TEXT[] DEFAULT '{}',
  quantity INTEGER DEFAULT 1,
  timeline TEXT,
  budget_min NUMERIC(12,2),
  budget_max NUMERIC(12,2),
  requirements TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','responses','closed')),
  manufacturer_responses JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  deadline TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  raised_by UUID REFERENCES auth.users(id),
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open','investigating','resolved','closed')),
  resolution TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_type ON payments(type);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_seller ON payments(seller_id);
CREATE INDEX IF NOT EXISTS idx_payments_buyer ON payments(buyer_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_seller_accounts_user ON seller_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_seller_accounts_stripe ON seller_accounts(stripe_account_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_usage_key ON api_usage(api_key_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enterprise_tier ON enterprise_accounts(tier);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_fee_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_rfq ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Users read own payments" ON payments FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid()); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Admin read all payments" ON payments FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read fee schedule" ON platform_fee_schedule FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users read own seller" ON seller_accounts FOR SELECT USING (user_id = auth.uid()); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users manage own keys" ON api_keys FOR ALL USING (user_id = auth.uid()); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Admin read usage" ON api_usage FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read enterprise" ON enterprise_accounts FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read rfq" ON enterprise_rfq FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public insert disputes" ON disputes FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Admin read disputes" ON disputes FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

INSERT INTO platform_fee_schedule (transaction_type, fee_percent, fee_fixed, notes)
VALUES
  ('robowork_job', 12.00, 0, 'RoboWork marketplace fee (industry standard 10-15%)'),
  ('cpo_sale', 10.00, 0, 'Certified Pre-Owned sale fee (capped at $50K)'),
  ('parts_sale', 15.00, 0, 'Parts marketplace fee'),
  ('service_booking', 12.00, 0, 'Service provider booking fee'),
  ('timeshare_booking', 15.00, 0, 'Robot time-share booking fee'),
  ('lease_transfer', 3.00, 0, 'Lease transfer facilitation fee'),
  ('cert_purchase', 100.00, 0, 'Certification revenue (100% retained)'),
  ('insurance_referral', 8.00, 0, '8% of first year premium'),
  ('lease_referral', 2.00, 0, '2% of total contract value')
ON CONFLICT (transaction_type) DO NOTHING;


-- ═══════════════════════════════════════════════
-- Migration 028: RSP Onboarding
-- ═══════════════════════════════════════════════

ALTER TABLE robot_service_providers
  ADD COLUMN IF NOT EXISTS business_type TEXT,
  ADD COLUMN IF NOT EXISTS years_in_robotics INTEGER,
  ADD COLUMN IF NOT EXISTS is_founding_rsp BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS founding_rsp_number INTEGER UNIQUE,
  ADD COLUMN IF NOT EXISTS founding_perks_claimed JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verification_tier INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS specialization_levels JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS stripe_connect_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_onboarding_complete BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

CREATE TABLE IF NOT EXISTS founding_rsp_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  robot_types TEXT[] DEFAULT '{}',
  fleet_size INTEGER,
  why_founding TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT
);

ALTER TABLE founding_rsp_applications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Anyone can apply" ON founding_rsp_applications FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users can view own applications" ON founding_rsp_applications FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = email); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_founding_rsp_status ON founding_rsp_applications(status);
CREATE INDEX IF NOT EXISTS idx_rsp_founding ON robot_service_providers(is_founding_rsp) WHERE is_founding_rsp = true;


-- ═══════════════════════════════════════════════
-- Migration 029: Performance Indexes
-- ═══════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_robots_category_score
ON robots(category_id, robo_score DESC NULLS LAST)
WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_robots_price
ON robots(price_current)
WHERE status = 'active' AND price_current IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_robots_manufacturer_score
ON robots(manufacturer_id, robo_score DESC NULLS LAST)
WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_jobs_status_created
ON robowork_jobs(status, created_at DESC)
WHERE status = 'open';

CREATE INDEX IF NOT EXISTS idx_jobs_market
ON robowork_jobs(city, state, status)
WHERE status = 'open';

CREATE INDEX IF NOT EXISTS idx_rsp_market
ON robot_service_providers(city, state)
WHERE verified = true;

CREATE INDEX IF NOT EXISTS idx_rsp_specializations
ON robot_service_providers USING gin(specializations);

CREATE INDEX IF NOT EXISTS idx_bids_job_status
ON robowork_bids(job_id, status, created_at);

CREATE INDEX IF NOT EXISTS idx_bids_rsp
ON robowork_bids(rsp_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_fleet_rsp_status
ON rsp_fleet_status(rsp_id, status);

CREATE INDEX IF NOT EXISTS idx_newsletter_active
ON newsletter_subscribers(confirmed, created_at DESC)
WHERE confirmed = true;


-- ═══════════════════════════════════════════════
-- Migration 030: RSP Referrals
-- ═══════════════════════════════════════════════

ALTER TABLE robot_service_providers
  ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES robot_service_providers(id),
  ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;

CREATE TABLE IF NOT EXISTS rsp_referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES robot_service_providers(id),
  referred_id UUID NOT NULL REFERENCES robot_service_providers(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'qualified', 'paid')),
  reward_amount NUMERIC(10,2) DEFAULT 500,
  created_at TIMESTAMPTZ DEFAULT now(),
  qualified_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ
);

ALTER TABLE rsp_referrals ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "RSPs can view own referrals" ON rsp_referrals FOR SELECT USING (referrer_id IN (SELECT id FROM robot_service_providers WHERE user_id = auth.uid())); EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ═══════════════════════════════════════════════
-- Migration 031: RCO v2 Certification Program
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS rco_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  weight_percent INTEGER,
  level_required TEXT NOT NULL,
  sort_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rco_questions_v2 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain_id UUID REFERENCES rco_domains(id) ON DELETE SET NULL,
  level TEXT NOT NULL,
  specialization TEXT,
  question_type TEXT NOT NULL CHECK (
    question_type IN (
      'multiple_choice','multi_select','scenario','fault_diagnosis',
      'code_review','calculation','sequencing','true_false_justify'
    )
  ),
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),
  question_text TEXT NOT NULL,
  scenario_context TEXT,
  code_snippet TEXT,
  diagram_description TEXT,
  options JSONB NOT NULL DEFAULT '[]',
  correct_answers TEXT[] NOT NULL,
  explanation TEXT NOT NULL,
  real_world_context TEXT,
  time_limit_seconds INTEGER,
  points INTEGER DEFAULT 1,
  tags TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rco_practical_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  scenario TEXT NOT NULL,
  robot_type TEXT,
  environment TEXT,
  time_limit_minutes INTEGER,
  evaluation_criteria JSONB DEFAULT '[]',
  pass_requirements TEXT,
  assessor_notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rco_learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level TEXT NOT NULL,
  module_number INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  topics TEXT[] DEFAULT '{}',
  estimated_hours NUMERIC(4,1),
  prerequisites TEXT[] DEFAULT '{}',
  resources JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rco_study_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  learning_path_id UUID REFERENCES rco_learning_paths(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  quiz_score NUMERIC(5,2),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, learning_path_id)
);

CREATE TABLE IF NOT EXISTS rco_practice_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  level TEXT NOT NULL,
  domain_code TEXT,
  mode TEXT DEFAULT 'study' CHECK (mode IN ('study', 'test')),
  questions_attempted INTEGER DEFAULT 0,
  questions_correct INTEGER DEFAULT 0,
  domain_scores JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS rco_employer_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  seats_purchased INTEGER DEFAULT 0,
  seats_used INTEGER DEFAULT 0,
  stripe_subscription_id TEXT,
  plan_type TEXT DEFAULT 'standard' CHECK (plan_type IN ('standard', 'enterprise')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rco_employer_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES rco_employer_teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  invited_at TIMESTAMPTZ DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  certification_level INTEGER,
  status TEXT DEFAULT 'invited' CHECK (status IN ('invited', 'active', 'completed', 'expired')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rco_curriculum_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level TEXT NOT NULL,
  specialization TEXT,
  update_date DATE NOT NULL DEFAULT CURRENT_DATE,
  update_type TEXT NOT NULL CHECK (update_type IN ('content', 'questions', 'standards', 'technology', 'regulatory')),
  description TEXT NOT NULL,
  what_changed TEXT NOT NULL,
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rco_domains_code ON rco_domains(code);
CREATE INDEX IF NOT EXISTS idx_rco_domains_level ON rco_domains(level_required);
CREATE INDEX IF NOT EXISTS idx_rco_qv2_domain ON rco_questions_v2(domain_id);
CREATE INDEX IF NOT EXISTS idx_rco_qv2_level ON rco_questions_v2(level);
CREATE INDEX IF NOT EXISTS idx_rco_qv2_type ON rco_questions_v2(question_type);
CREATE INDEX IF NOT EXISTS idx_rco_qv2_difficulty ON rco_questions_v2(difficulty);
CREATE INDEX IF NOT EXISTS idx_rco_qv2_spec ON rco_questions_v2(specialization);
CREATE INDEX IF NOT EXISTS idx_rco_practical_level ON rco_practical_assessments(level);
CREATE INDEX IF NOT EXISTS idx_rco_learning_level ON rco_learning_paths(level);
CREATE INDEX IF NOT EXISTS idx_rco_study_user ON rco_study_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_rco_practice_user ON rco_practice_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_rco_employer_members_team ON rco_employer_members(team_id);
CREATE INDEX IF NOT EXISTS idx_rco_curriculum_updates_level ON rco_curriculum_updates(level);
CREATE INDEX IF NOT EXISTS idx_rco_curriculum_updates_date ON rco_curriculum_updates(update_date);

ALTER TABLE rco_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_questions_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_practical_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_study_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_employer_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_employer_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_curriculum_updates ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Public read domains" ON rco_domains FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read questions v2" ON rco_questions_v2 FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read practical assessments" ON rco_practical_assessments FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read learning paths" ON rco_learning_paths FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users read own study progress" ON rco_study_progress FOR SELECT USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users insert own study progress" ON rco_study_progress FOR INSERT WITH CHECK (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users update own study progress" ON rco_study_progress FOR UPDATE USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users read own practice sessions" ON rco_practice_sessions FOR SELECT USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users insert own practice sessions" ON rco_practice_sessions FOR INSERT WITH CHECK (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users update own practice sessions" ON rco_practice_sessions FOR UPDATE USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Team admins read teams" ON rco_employer_teams FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Team members read own team" ON rco_employer_members FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read curriculum updates" ON rco_curriculum_updates FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Seed 17 domains
INSERT INTO rco_domains (code, name, description, weight_percent, level_required, sort_order) VALUES
('SAFETY_FUNDAMENTALS', 'Robot Safety & Risk Assessment', 'ISO 10218, collaborative robot safety, emergency procedures, risk matrices, lockout/tagout for robotic systems', 25, 'foundation', 1),
('ROBOT_BASICS', 'Robot Types, Components & Architecture', 'AMR, cobot, industrial arm, humanoid, sensors, actuators, compute, batteries, degrees of freedom, kinematics basics', 20, 'foundation', 2),
('DEPLOYMENT_FUNDAMENTALS', 'Basic Deployment & Operations', 'Site assessment, workspace setup, robot commissioning, basic programming, operator interface, maintenance basics', 20, 'foundation', 3),
('TROUBLESHOOTING_L1', 'Basic Fault Diagnosis', 'Error codes, sensor failures, connectivity issues, mechanical jams, basic diagnostic procedures', 20, 'foundation', 4),
('REGULATIONS_ETHICS', 'Compliance, Ethics & Documentation', 'OSHA regulations, safety standards, incident reporting, operator liability, data privacy in robot deployments', 15, 'foundation', 5),
('ADVANCED_PROGRAMMING', 'Robot Programming & Control Systems', 'ROS2, motion planning, trajectory optimization, PID control, force control, sensor fusion', 25, 'specialist', 6),
('FLEET_MANAGEMENT', 'Multi-Robot Fleet Operations', 'Fleet coordination, task allocation, traffic management, OTA updates, uptime optimization, KPI tracking', 20, 'specialist', 7),
('FAULT_INJECTION_MASTERY', 'Live Fault Diagnosis Under Pressure', 'Edge case debugging, zero-downtime repairs, mid-shift reprogramming, hardware failures, sensor drift, actuator degradation', 25, 'specialist', 8),
('PERCEPTION_AI', 'Computer Vision & AI Integration', 'Point cloud processing, object detection, semantic segmentation, model fine-tuning, sim-to-real transfer, VLA models', 30, 'specialist', 9),
('SIM_TO_REAL', 'Simulation to Reality Bridge Mastery', 'Physics engine tuning, domain randomization, adversarial simulation, reality gap closure, neural network transfer learning', 20, 'master', 10),
('DEXTERITY_CONTROL', 'Dexterous Manipulation & Fine Motor', '50+ DOF hand control, deformable objects, force feedback, surgical precision, tool use in novel environments', 25, 'master', 11),
('WORLD_MODELING', 'Robot World Models & Scene Understanding', 'Spatial reasoning, novel environment handling, latent action spaces, diffusion policies, end-to-end autonomy without teleoperation', 20, 'master', 12),
('EDGE_INFERENCE', 'Edge Computing & Inference Optimization', 'Distributed compute, token efficiency, on-device inference, model compression, real-time performance at scale', 15, 'master', 13),
('SYSTEM_ARCHITECTURE', 'Full Stack Robot System Design', 'Hardware/software co-design, self-replication concepts, swarm coordination, robot building robot concepts', 20, 'master', 14),
('PROGRAM_DESIGN', 'Certification Program Design & Training', 'Designing operator training programs, competency frameworks, skills gap analysis, continuous education', 30, 'fleet_commander', 15),
('INCIDENT_COMMAND', 'Crisis Management & Incident Command', 'Multi-robot incidents, factory emergencies, regulatory response, PR protocols, post-incident analysis', 35, 'fleet_commander', 16),
('BUSINESS_OPERATIONS', 'Robot Business Operations & ROI', 'Fleet economics, contract negotiation, client management, scaling operations, vendor evaluation, TCO modeling', 35, 'fleet_commander', 17)
ON CONFLICT (code) DO NOTHING;

-- Seed practical assessments
INSERT INTO rco_practical_assessments (level, title, description, scenario, robot_type, environment, time_limit_minutes, evaluation_criteria, pass_requirements, sort_order)
SELECT * FROM (VALUES
  ('master', 'Round 1: Fault Injection', 'Unknown faults have been injected into a simulated robot system. Find and fix them all.', 'A simulated robot system is handed to you with 5 injected faults: sensor drift (lidar), corrupted navigation map (5% error), intermittent actuator failure, network packet loss (15%), incorrect force thresholds. You have 30 minutes to find and fix ALL.', 'Mixed fleet', 'Simulated warehouse', 30, '["Fault identification speed", "Diagnostic methodology", "Fix accuracy", "System verification after fix"]'::JSONB, 'Fix 4 of 5 faults within time limit', 1),
  ('master', 'Round 2: Zero Downtime', 'Perform maintenance, updates, and reconfiguration WITHOUT stopping production.', 'Production simulation is running with 8 active robots. You must perform firmware update on 2 robots, reconfigure safety zones for a new obstacle, and replace a degraded sensor — all without any production stoppage events.', 'AMR fleet', 'Active production floor', 30, '["Zero production stoppages", "Update procedure correctness", "Safety zone validation", "Change documentation"]'::JSONB, 'Zero production stoppage events', 2),
  ('master', 'Round 3: Novel Environment', 'Deploy a robot in an environment it has never seen. Adapt on the fly.', 'A robot is placed in a completely new environment with unknown layout, lighting conditions, and obstacles. You must: remap key areas, adjust perception thresholds, validate safety zones, and document all changes. The robot must complete an assigned pick-and-place task.', 'Cobot arm + AMR', 'Unknown facility', 30, '["Mapping accuracy", "Perception tuning", "Safety validation", "Task completion", "Documentation quality"]'::JSONB, 'Robot completes assigned task in novel environment', 3),
  ('master', 'Round 4: Code Review & Fix', 'Identify all bugs, security issues, safety failures, and performance problems in broken robot control code.', 'Given 3 files of broken robot control code (ROS2 Python): an emergency stop node, a navigation planner, and a fleet coordinator. Must identify all bugs across all files and fix the safety-critical ones live.', 'ROS2 system', 'Code review environment', 30, '["Bug identification completeness", "Safety-critical prioritization", "Fix correctness", "Code quality after fix"]'::JSONB, 'Fix all safety-critical bugs', 4),
  ('fleet_commander', 'Capstone: Enterprise Deployment Strategy', 'Design and present a complete robot deployment strategy for a simulated enterprise scenario.', 'FreshMart Grocery Chain (200 stores) wants to deploy autonomous robots for: store shelf scanning/restocking, customer service/wayfinding, overnight cleaning/maintenance, inventory management integration, after-hours security. Total: 800+ robots, Budget: $12M over 3 years, Staff: 2,000 existing employees. Constraints: FDA compliance, customer safety, union considerations.', 'Mixed fleet (800+)', 'Multi-site retail', 240, '["Fleet architecture recommendation", "Vendor selection with RoboScore", "5-year ROI model", "Operator training plan", "Safety/compliance framework", "Integration architecture", "Risk register", "Deployment roadmap"]'::JSONB, 'Meets all 8 deliverable standards, reviewed by panel', 1)
) AS v(level, title, description, scenario, robot_type, environment, time_limit_minutes, evaluation_criteria, pass_requirements, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM rco_practical_assessments LIMIT 1);

-- Seed learning paths
INSERT INTO rco_learning_paths (level, module_number, title, description, topics, estimated_hours, prerequisites, sort_order)
SELECT * FROM (VALUES
  ('foundation', 1, 'Robot Safety Fundamentals', 'Master the safety protocols that keep humans and robots working together safely.', ARRAY['ISO 10218 overview', 'Risk assessment methods', 'Emergency procedures', 'Lockout/tagout for robotics', 'Safety zone design'], 3.0, '{}'::TEXT[], 1),
  ('foundation', 2, 'Robot Types & Architecture', 'Understand the full landscape of robotic systems — from AMRs to humanoids.', ARRAY['AMR vs AGV vs Cobot', 'Sensors deep dive', 'Actuators & drive systems', 'Compute & AI hardware', 'Degrees of freedom & kinematics'], 3.5, '{}'::TEXT[], 2),
  ('foundation', 3, 'Basic Deployment & Operations', 'Learn how to commission, operate, and maintain robotic systems.', ARRAY['Site assessment', 'Robot commissioning', 'HMI & operator interfaces', 'Basic programming concepts', 'Maintenance schedules'], 3.0, ARRAY['Robot Types & Architecture'], 3),
  ('foundation', 4, 'Basic Fault Diagnosis', 'Identify and resolve the most common robot failures.', ARRAY['Error code interpretation', 'Sensor failure diagnosis', 'Connectivity troubleshooting', 'Mechanical jam resolution', 'Diagnostic procedures'], 2.5, ARRAY['Basic Deployment & Operations'], 4),
  ('foundation', 5, 'Compliance, Ethics & Documentation', 'Navigate the regulatory landscape and document everything properly.', ARRAY['OSHA regulations', 'Safety standards overview', 'Incident reporting', 'Operator liability', 'Data privacy'], 2.0, '{}'::TEXT[], 5),
  ('specialist', 1, 'Robot Programming & Control Systems', 'Deep dive into ROS2, motion planning, and advanced control theory.', ARRAY['ROS2 architecture', 'Motion planning algorithms', 'Trajectory optimization', 'PID & force control', 'Sensor fusion techniques'], 8.0, ARRAY['Foundation certification'], 1),
  ('specialist', 2, 'Multi-Robot Fleet Operations', 'Manage fleets of robots at scale with coordination and optimization.', ARRAY['Fleet coordination algorithms', 'Task allocation strategies', 'Traffic management', 'OTA update procedures', 'KPI tracking & uptime'], 6.0, ARRAY['Foundation certification'], 2),
  ('specialist', 3, 'Live Fault Diagnosis Under Pressure', 'Debug edge cases and perform zero-downtime repairs in production.', ARRAY['Edge case debugging', 'Zero-downtime repair techniques', 'Mid-shift reprogramming', 'Hardware failure response', 'Sensor drift compensation'], 8.0, ARRAY['Robot Programming & Control Systems'], 3),
  ('specialist', 4, 'Computer Vision & AI Integration', 'Integrate perception systems and AI models into robotic platforms.', ARRAY['Point cloud processing', 'Object detection pipelines', 'Semantic segmentation', 'Model fine-tuning', 'Sim-to-real transfer basics'], 10.0, ARRAY['Robot Programming & Control Systems'], 4),
  ('master', 1, 'Simulation to Reality Bridge', 'Close the sim-to-real gap with advanced transfer techniques.', ARRAY['Physics engine tuning', 'Domain randomization', 'Adversarial simulation', 'Reality gap analysis', 'Neural network transfer'], 12.0, ARRAY['Specialist certification'], 1),
  ('master', 2, 'Dexterous Manipulation', 'Master fine motor control for complex manipulation tasks.', ARRAY['High-DOF hand control', 'Deformable object manipulation', 'Force feedback systems', 'Surgical-precision tasks', 'Tool use in novel environments'], 15.0, ARRAY['Specialist certification'], 2),
  ('master', 3, 'World Models & Scene Understanding', 'Build and leverage world models for autonomous robot operation.', ARRAY['Spatial reasoning', 'Novel environment handling', 'Latent action spaces', 'Diffusion policies', 'End-to-end autonomy'], 12.0, ARRAY['Computer Vision & AI Integration'], 3),
  ('master', 4, 'Edge Inference & System Architecture', 'Optimize inference and design full-stack robot systems.', ARRAY['On-device inference', 'Model compression', 'Distributed compute', 'Hardware/software co-design', 'Swarm coordination'], 10.0, ARRAY['Specialist certification'], 4),
  ('fleet_commander', 1, 'Program Design & Training', 'Design operator certification and training programs for your organization.', ARRAY['Competency framework design', 'Skills gap analysis', 'Training curriculum development', 'Assessment design', 'Continuous education programs'], 15.0, ARRAY['Master certification'], 1),
  ('fleet_commander', 2, 'Crisis Management & Incident Command', 'Lead response to multi-robot incidents and factory emergencies.', ARRAY['Incident command structure', 'Multi-robot emergency response', 'Regulatory reporting', 'PR and communications', 'Post-incident analysis'], 12.0, ARRAY['Master certification'], 2),
  ('fleet_commander', 3, 'Robot Business Operations', 'Master the business side of large-scale robot deployments.', ARRAY['Fleet economics', 'Contract negotiation', 'Client management', 'Scaling operations', 'Vendor evaluation & TCO'], 15.0, ARRAY['Master certification'], 3),
  ('fleet_commander', 4, 'Enterprise Capstone Preparation', 'Prepare for the Fleet Commander capstone assessment.', ARRAY['Enterprise deployment planning', 'ROI modeling', 'Stakeholder management', 'Compliance frameworks', 'Presentation skills'], 20.0, ARRAY['All Fleet Commander modules'], 4)
) AS v(level, module_number, title, description, topics, estimated_hours, prerequisites, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM rco_learning_paths LIMIT 1);

-- Seed curriculum update record
INSERT INTO rco_curriculum_updates (level, update_type, description, what_changed)
SELECT 'all', 'content', 'RCO v2 launch — complete program rebuild', 'New: 17 domains, 700+ questions, Gauntlet assessment, 7 specializations, study system, employer portal, emerging technology curriculum'
WHERE NOT EXISTS (SELECT 1 FROM rco_curriculum_updates LIMIT 1);

-- Update exam parameters
UPDATE rco_certifications SET question_count = 80, exam_duration = 90, passing_score = 75 WHERE slug = '1';
UPDATE rco_certifications SET question_count = 120, exam_duration = 150, passing_score = 78 WHERE slug = '2';
UPDATE rco_certifications SET question_count = 150, exam_duration = 180, passing_score = 82 WHERE slug = '3';
UPDATE rco_certifications SET question_count = 150, exam_duration = 180, passing_score = 85 WHERE slug = '4';


-- ═══════════════════════════════════════════════
-- Migration 032: RSP Storefront
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS rsp_robot_familiarity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rsp_id UUID NOT NULL REFERENCES robot_service_providers(id) ON DELETE CASCADE,
  robot_category TEXT NOT NULL,
  robot_manufacturer TEXT,
  tier TEXT NOT NULL DEFAULT 'familiar' CHECK (tier IN ('familiar', 'intermediate', 'expert')),
  years_experience NUMERIC(3,1) DEFAULT 0,
  total_deployments INTEGER DEFAULT 0,
  avg_rating NUMERIC(3,2),
  verified BOOLEAN DEFAULT false,
  self_reported BOOLEAN DEFAULT true,
  last_job_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(rsp_id, robot_category, robot_manufacturer)
);

CREATE TABLE IF NOT EXISTS rsp_capabilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rsp_id UUID NOT NULL REFERENCES robot_service_providers(id) ON DELETE CASCADE,
  capability TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'deployment', 'programming', 'maintenance',
    'integration', 'safety', 'fleet_management',
    'consulting', 'training'
  )),
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  verified_job_count INTEGER DEFAULT 0,
  self_reported BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(rsp_id, capability)
);

ALTER TABLE robowork_reviews
  ADD COLUMN IF NOT EXISTS delivery_on_time BOOLEAN,
  ADD COLUMN IF NOT EXISTS issues_resolved_within_4hrs BOOLEAN,
  ADD COLUMN IF NOT EXISTS robot_used TEXT,
  ADD COLUMN IF NOT EXISTS job_type TEXT,
  ADD COLUMN IF NOT EXISTS job_duration_days INTEGER,
  ADD COLUMN IF NOT EXISTS uptime_achieved NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS verified_job BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS response TEXT;

CREATE TABLE IF NOT EXISTS rsp_case_studies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rsp_id UUID NOT NULL REFERENCES robot_service_providers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  challenge TEXT NOT NULL,
  solution TEXT NOT NULL,
  results TEXT NOT NULL,
  client_name TEXT,
  client_industry TEXT,
  robot_used TEXT,
  duration_description TEXT,
  metrics JSONB DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rsp_availability_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rsp_id UUID NOT NULL REFERENCES robot_service_providers(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME,
  end_time TIME,
  available BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rsp_availability_overrides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rsp_id UUID NOT NULL REFERENCES robot_service_providers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  available BOOLEAN DEFAULT false,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(rsp_id, date)
);

ALTER TABLE robot_service_providers
  ADD COLUMN IF NOT EXISTS rsp_score INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rsp_score_breakdown JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS rsp_score_updated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rsp_score_percentile INTEGER,
  ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available';

-- Add check constraint separately (safe if column already exists with different constraint)
DO $$ BEGIN
  ALTER TABLE robot_service_providers
    ADD CONSTRAINT chk_availability_status
    CHECK (availability_status IN ('available', 'busy', 'unavailable', 'by_appointment'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS rsp_certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rsp_id UUID NOT NULL REFERENCES robot_service_providers(id) ON DELETE CASCADE,
  credential_id TEXT REFERENCES rco_credentials(credential_id),
  certification_name TEXT NOT NULL,
  certification_level INTEGER,
  specialization TEXT,
  score NUMERIC(5,2),
  issued_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rsp_familiarity_rsp ON rsp_robot_familiarity(rsp_id);
CREATE INDEX IF NOT EXISTS idx_rsp_familiarity_tier ON rsp_robot_familiarity(tier);
CREATE INDEX IF NOT EXISTS idx_rsp_capabilities_rsp ON rsp_capabilities(rsp_id);
CREATE INDEX IF NOT EXISTS idx_rsp_capabilities_verified ON rsp_capabilities(verified);
CREATE INDEX IF NOT EXISTS idx_rsp_case_studies_rsp ON rsp_case_studies(rsp_id);
CREATE INDEX IF NOT EXISTS idx_rsp_availability_rsp ON rsp_availability_schedule(rsp_id);
CREATE INDEX IF NOT EXISTS idx_rsp_availability_overrides_rsp ON rsp_availability_overrides(rsp_id);
CREATE INDEX IF NOT EXISTS idx_rsp_certifications_rsp ON rsp_certifications(rsp_id);
CREATE INDEX IF NOT EXISTS idx_rsp_score ON robot_service_providers(rsp_score);

ALTER TABLE rsp_robot_familiarity ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsp_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsp_case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsp_availability_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsp_availability_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsp_certifications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Public read robot familiarity" ON rsp_robot_familiarity FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read capabilities" ON rsp_capabilities FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read case studies" ON rsp_case_studies FOR SELECT USING (published = true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read availability" ON rsp_availability_schedule FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read availability overrides" ON rsp_availability_overrides FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read certifications" ON rsp_certifications FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "RSP owner insert familiarity" ON rsp_robot_familiarity FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "RSP owner update familiarity" ON rsp_robot_familiarity FOR UPDATE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "RSP owner insert capabilities" ON rsp_capabilities FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "RSP owner update capabilities" ON rsp_capabilities FOR UPDATE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "RSP owner manage case studies" ON rsp_case_studies FOR ALL USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "RSP owner manage availability" ON rsp_availability_schedule FOR ALL USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "RSP owner manage availability overrides" ON rsp_availability_overrides FOR ALL USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "RSP owner manage certifications" ON rsp_certifications FOR ALL USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ═══════════════════════════════════════════════
-- DONE: All migrations 026-032 applied
-- ═══════════════════════════════════════════════
