-- RSP Storefront Upgrade
-- Migration 032 — Robot familiarity, capabilities, enhanced reviews, case studies, availability, RSP score

-- ══════════════════════════════════════════════
-- ROBOT FAMILIARITY (3-tier system)
-- ══════════════════════════════════════════════

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

-- ══════════════════════════════════════════════
-- CAPABILITIES (verified vs self-reported)
-- ══════════════════════════════════════════════

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

-- ══════════════════════════════════════════════
-- ENHANCED REVIEWS (structured metrics)
-- ══════════════════════════════════════════════

-- Add structured fields to existing robowork_reviews
ALTER TABLE robowork_reviews
  ADD COLUMN IF NOT EXISTS delivery_on_time BOOLEAN,
  ADD COLUMN IF NOT EXISTS issues_resolved_within_4hrs BOOLEAN,
  ADD COLUMN IF NOT EXISTS robot_used TEXT,
  ADD COLUMN IF NOT EXISTS job_type TEXT,
  ADD COLUMN IF NOT EXISTS job_duration_days INTEGER,
  ADD COLUMN IF NOT EXISTS uptime_achieved NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS verified_job BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS response TEXT;

-- ══════════════════════════════════════════════
-- CASE STUDIES
-- ══════════════════════════════════════════════

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

-- ══════════════════════════════════════════════
-- AVAILABILITY SCHEDULE
-- ══════════════════════════════════════════════

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

-- Specific date overrides (holidays, booked dates)
CREATE TABLE IF NOT EXISTS rsp_availability_overrides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rsp_id UUID NOT NULL REFERENCES robot_service_providers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  available BOOLEAN DEFAULT false,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(rsp_id, date)
);

-- ══════════════════════════════════════════════
-- RSP SCORE (computed weekly)
-- ══════════════════════════════════════════════

ALTER TABLE robot_service_providers
  ADD COLUMN IF NOT EXISTS rsp_score INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rsp_score_breakdown JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS rsp_score_updated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rsp_score_percentile INTEGER,
  ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available'
    CHECK (availability_status IN ('available', 'busy', 'unavailable', 'by_appointment'));

-- ══════════════════════════════════════════════
-- RSP CERTIFICATIONS LINK
-- ══════════════════════════════════════════════

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

-- ══════════════════════════════════════════════
-- INDEXES
-- ══════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_rsp_familiarity_rsp ON rsp_robot_familiarity(rsp_id);
CREATE INDEX IF NOT EXISTS idx_rsp_familiarity_tier ON rsp_robot_familiarity(tier);
CREATE INDEX IF NOT EXISTS idx_rsp_capabilities_rsp ON rsp_capabilities(rsp_id);
CREATE INDEX IF NOT EXISTS idx_rsp_capabilities_verified ON rsp_capabilities(verified);
CREATE INDEX IF NOT EXISTS idx_rsp_case_studies_rsp ON rsp_case_studies(rsp_id);
CREATE INDEX IF NOT EXISTS idx_rsp_availability_rsp ON rsp_availability_schedule(rsp_id);
CREATE INDEX IF NOT EXISTS idx_rsp_availability_overrides_rsp ON rsp_availability_overrides(rsp_id);
CREATE INDEX IF NOT EXISTS idx_rsp_certifications_rsp ON rsp_certifications(rsp_id);
CREATE INDEX IF NOT EXISTS idx_rsp_score ON robot_service_providers(rsp_score);

-- ══════════════════════════════════════════════
-- RLS
-- ══════════════════════════════════════════════

ALTER TABLE rsp_robot_familiarity ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsp_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsp_case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsp_availability_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsp_availability_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsp_certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read robot familiarity" ON rsp_robot_familiarity FOR SELECT USING (true);
CREATE POLICY "Public read capabilities" ON rsp_capabilities FOR SELECT USING (true);
CREATE POLICY "Public read case studies" ON rsp_case_studies FOR SELECT USING (published = true);
CREATE POLICY "Public read availability" ON rsp_availability_schedule FOR SELECT USING (true);
CREATE POLICY "Public read availability overrides" ON rsp_availability_overrides FOR SELECT USING (true);
CREATE POLICY "Public read certifications" ON rsp_certifications FOR SELECT USING (true);

-- Owner policies
CREATE POLICY "RSP owner insert familiarity" ON rsp_robot_familiarity FOR INSERT WITH CHECK (true);
CREATE POLICY "RSP owner update familiarity" ON rsp_robot_familiarity FOR UPDATE USING (true);
CREATE POLICY "RSP owner insert capabilities" ON rsp_capabilities FOR INSERT WITH CHECK (true);
CREATE POLICY "RSP owner update capabilities" ON rsp_capabilities FOR UPDATE USING (true);
CREATE POLICY "RSP owner manage case studies" ON rsp_case_studies FOR ALL USING (true);
CREATE POLICY "RSP owner manage availability" ON rsp_availability_schedule FOR ALL USING (true);
CREATE POLICY "RSP owner manage availability overrides" ON rsp_availability_overrides FOR ALL USING (true);
CREATE POLICY "RSP owner manage certifications" ON rsp_certifications FOR ALL USING (true);
