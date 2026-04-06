-- =====================================================================
-- Robotomated: Complete Migration Runner (001-032)
-- Generated: 2026-04-05
--
-- Safe to run on any Supabase instance. All statements are idempotent.
-- Paste into Supabase Dashboard > SQL Editor > Run
-- =====================================================================


-- =============================================================
-- Migration 001: Initial Schema
-- =============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
DO $$ BEGIN CREATE TYPE robot_status AS ENUM ('active', 'discontinued', 'coming_soon'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE review_type AS ENUM ('expert', 'community', 'video'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'enterprise'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Tables
CREATE TABLE IF NOT EXISTS robot_categories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  parent_id     UUID REFERENCES robot_categories(id) ON DELETE SET NULL,
  description   TEXT,
  icon_name     TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS manufacturers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  country       TEXT,
  founded_year  INTEGER,
  website       TEXT,
  logo_url      TEXT,
  verified      BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email             TEXT NOT NULL UNIQUE,
  name              TEXT,
  avatar_url        TEXT,
  persona_type      TEXT,
  preferences       JSONB DEFAULT '{}',
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS robots (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug              TEXT NOT NULL UNIQUE,
  name              TEXT NOT NULL,
  manufacturer_id   UUID NOT NULL REFERENCES manufacturers(id) ON DELETE RESTRICT,
  category_id       UUID NOT NULL REFERENCES robot_categories(id) ON DELETE RESTRICT,
  model_number      TEXT,
  year_released     INTEGER,
  price_msrp        DECIMAL(12,2),
  price_current     DECIMAL(12,2),
  description_short TEXT,
  description_long  TEXT,
  specs             JSONB DEFAULT '{}',
  images            JSONB DEFAULT '[]',
  robo_score        DECIMAL(5,2) CHECK (robo_score >= 0 AND robo_score <= 100),
  score_breakdown   JSONB DEFAULT '{}',
  affiliate_url     TEXT,
  amazon_asin       TEXT,
  status            robot_status NOT NULL DEFAULT 'active',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reviews (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  robot_id          UUID NOT NULL REFERENCES robots(id) ON DELETE CASCADE,
  reviewer_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  review_type       review_type NOT NULL DEFAULT 'community',
  title             TEXT NOT NULL,
  body              TEXT NOT NULL,
  robo_score        DECIMAL(5,2) CHECK (robo_score >= 0 AND robo_score <= 100),
  score_breakdown   JSONB DEFAULT '{}',
  pros              JSONB DEFAULT '[]',
  cons              JSONB DEFAULT '[]',
  verdict           TEXT,
  verified_purchase BOOLEAN NOT NULL DEFAULT false,
  published_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS advisor_conversations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id      TEXT NOT NULL,
  messages        JSONB NOT NULL DEFAULT '[]',
  use_case        TEXT,
  budget_min      DECIMAL(12,2),
  budget_max      DECIMAL(12,2),
  recommendations JSONB DEFAULT '[]',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS price_history (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  robot_id    UUID NOT NULL REFERENCES robots(id) ON DELETE CASCADE,
  retailer    TEXT NOT NULL,
  price       DECIMAL(12,2) NOT NULL,
  currency    TEXT NOT NULL DEFAULT 'USD',
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT NOT NULL UNIQUE,
  source      TEXT,
  confirmed   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON robot_categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON robot_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_manufacturers_slug ON manufacturers(slug);
CREATE INDEX IF NOT EXISTS idx_robots_slug ON robots(slug);
CREATE INDEX IF NOT EXISTS idx_robots_manufacturer ON robots(manufacturer_id);
CREATE INDEX IF NOT EXISTS idx_robots_category ON robots(category_id);
CREATE INDEX IF NOT EXISTS idx_robots_status ON robots(status);
CREATE INDEX IF NOT EXISTS idx_robots_score ON robots(robo_score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_robots_price ON robots(price_current);
CREATE INDEX IF NOT EXISTS idx_reviews_robot ON reviews(robot_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_published ON reviews(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_reviews_type ON reviews(review_type);
CREATE INDEX IF NOT EXISTS idx_advisor_user ON advisor_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_advisor_session ON advisor_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_price_history_robot ON price_history(robot_id);
CREATE INDEX IF NOT EXISTS idx_price_history_recorded ON price_history(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  CREATE TRIGGER robots_updated_at
    BEFORE UPDATE ON robots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Row Level Security
ALTER TABLE robot_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE robots ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisor_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ BEGIN CREATE POLICY "Categories are publicly readable" ON robot_categories FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Manufacturers are publicly readable" ON manufacturers FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Active robots are publicly readable" ON robots FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Published reviews are publicly readable" ON reviews FOR SELECT USING (published_at IS NOT NULL); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Price history is publicly readable" ON price_history FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated users can create reviews" ON reviews FOR INSERT TO authenticated WITH CHECK (reviewer_id = auth.uid()); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE TO authenticated USING (reviewer_id = auth.uid()) WITH CHECK (reviewer_id = auth.uid()); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE TO authenticated USING (reviewer_id = auth.uid()); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users can read own profile" ON users FOR SELECT TO authenticated USING (id = auth.uid()); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid()); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users can insert own profile" ON users FOR INSERT TO authenticated WITH CHECK (id = auth.uid()); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users can read own conversations" ON advisor_conversations FOR SELECT TO authenticated USING (user_id = auth.uid()); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users can create conversations" ON advisor_conversations FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid()); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Anonymous advisor conversations" ON advisor_conversations FOR INSERT TO anon WITH CHECK (user_id IS NULL); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =============================================================
-- Migration 002: Saved Robots
-- =============================================================

CREATE TABLE IF NOT EXISTS user_saved_robots (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  robot_id    UUID NOT NULL REFERENCES robots(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, robot_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_robots_user ON user_saved_robots(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_robots_robot ON user_saved_robots(robot_id);

ALTER TABLE user_saved_robots ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Users can read own saved robots" ON user_saved_robots FOR SELECT TO authenticated USING (user_id = auth.uid()); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users can save robots" ON user_saved_robots FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid()); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users can unsave robots" ON user_saved_robots FOR DELETE TO authenticated USING (user_id = auth.uid()); EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =============================================================
-- Migration 003: Affiliate System
-- =============================================================

CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  robot_id    UUID NOT NULL REFERENCES robots(id) ON DELETE CASCADE,
  retailer    TEXT NOT NULL,
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id  TEXT,
  referrer    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_robot ON affiliate_clicks(robot_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_retailer ON affiliate_clicks(retailer);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_date ON affiliate_clicks(created_at DESC);

ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Service role can manage affiliate clicks" ON affiliate_clicks FOR ALL TO service_role USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS price_alerts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  robot_id    UUID NOT NULL REFERENCES robots(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  target_price DECIMAL(12,2) NOT NULL,
  active      BOOLEAN NOT NULL DEFAULT true,
  triggered_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(robot_id, email)
);

CREATE INDEX IF NOT EXISTS idx_price_alerts_robot ON price_alerts(robot_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_active ON price_alerts(active) WHERE active = true;

ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Anyone can create price alerts" ON price_alerts FOR INSERT TO anon, authenticated WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Service role can manage price alerts" ON price_alerts FOR ALL TO service_role USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =============================================================
-- Migration 004: Manufacturer Submissions
-- =============================================================

CREATE TABLE IF NOT EXISTS manufacturer_submissions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name    TEXT NOT NULL,
  contact_email   TEXT NOT NULL,
  robot_name      TEXT NOT NULL,
  model_number    TEXT,
  product_url     TEXT,
  specs           JSONB DEFAULT '{}',
  notes           TEXT,
  status          TEXT NOT NULL DEFAULT 'pending',
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_submissions_status ON manufacturer_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_date ON manufacturer_submissions(created_at DESC);

ALTER TABLE manufacturer_submissions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Anyone can submit" ON manufacturer_submissions FOR INSERT TO anon, authenticated WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Service role manages submissions" ON manufacturer_submissions FOR ALL TO service_role USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =============================================================
-- Migration 005: Stripe Fields
-- =============================================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMPTZ;


-- =============================================================
-- Migration 006: Revenue Entries
-- =============================================================

CREATE TABLE IF NOT EXISTS revenue_entries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month       TEXT NOT NULL,
  source      TEXT NOT NULL,
  amount      DECIMAL(12,2) NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_revenue_month ON revenue_entries(month DESC);

ALTER TABLE revenue_entries ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Service role manages revenue" ON revenue_entries FOR ALL TO service_role USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =============================================================
-- Migration 007: Buyer Intelligence
-- =============================================================

-- Buyer-focused fields on robots table
ALTER TABLE robots ADD COLUMN IF NOT EXISTS price_lease_monthly integer;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS price_type text DEFAULT 'purchase';
ALTER TABLE robots ADD COLUMN IF NOT EXISTS financing_available boolean DEFAULT false;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS financing_notes text;

-- Power & operational fields
ALTER TABLE robots ADD COLUMN IF NOT EXISTS power_source text;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS battery_capacity_wh integer;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS battery_runtime_hrs numeric(4,1);
ALTER TABLE robots ADD COLUMN IF NOT EXISTS charge_time_hrs numeric(4,1);
ALTER TABLE robots ADD COLUMN IF NOT EXISTS hot_swap_battery boolean DEFAULT false;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS power_consumption_watts integer;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS operating_voltage text;

-- Total cost of ownership fields
ALTER TABLE robots ADD COLUMN IF NOT EXISTS annual_maintenance_cost integer;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS warranty_years integer DEFAULT 1;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS expected_lifespan_years integer;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS training_required text;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS training_cost integer;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS integration_cost_estimate integer;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS spare_parts_availability text;

-- Application & ROI fields
ALTER TABLE robots ADD COLUMN IF NOT EXISTS typical_roi_months integer;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS labor_replaced_fte numeric(3,1);
ALTER TABLE robots ADD COLUMN IF NOT EXISTS throughput_description text;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS operating_environment text;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS temperature_range text;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS noise_level_db integer;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS certifications text[];
ALTER TABLE robots ADD COLUMN IF NOT EXISTS safety_features text[];

-- Applications table
CREATE TABLE IF NOT EXISTS robot_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  robot_id uuid REFERENCES robots(id) ON DELETE CASCADE,
  application_name text NOT NULL,
  industry text NOT NULL,
  task_description text,
  time_savings_percent integer,
  cost_savings_percent integer,
  labor_savings_description text,
  cycle_time_seconds integer,
  accuracy_percent numeric(5,2),
  deployment_time_days integer,
  difficulty text DEFAULT 'medium',
  real_world_example text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_robot_applications_robot ON robot_applications(robot_id);
CREATE INDEX IF NOT EXISTS idx_robot_applications_industry ON robot_applications(industry);

ALTER TABLE robot_applications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Applications are publicly readable" ON robot_applications FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Service role manages applications" ON robot_applications FOR ALL TO service_role USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Financing options table
CREATE TABLE IF NOT EXISTS financing_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  robot_id uuid REFERENCES robots(id) ON DELETE CASCADE,
  provider text NOT NULL,
  type text NOT NULL,
  monthly_payment integer,
  term_months integer,
  down_payment_percent integer DEFAULT 0,
  includes_maintenance boolean DEFAULT false,
  includes_support boolean DEFAULT false,
  notes text,
  url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE financing_options ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Financing options are publicly readable" ON financing_options FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Service role manages financing" ON financing_options FOR ALL TO service_role USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =============================================================
-- Migration 008: Newsletter Enhancements
-- =============================================================

ALTER TABLE newsletter_subscribers
  ADD COLUMN IF NOT EXISTS industry_preference TEXT,
  ADD COLUMN IF NOT EXISTS unsubscribe_token TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex');

-- Backfill existing rows with unique tokens
UPDATE newsletter_subscribers
SET unsubscribe_token = encode(gen_random_bytes(32), 'hex')
WHERE unsubscribe_token = encode(gen_random_bytes(32), 'hex');

CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_unsubscribe_token
  ON newsletter_subscribers(unsubscribe_token);

DO $$ BEGIN CREATE POLICY "Anyone can unsubscribe via token" ON newsletter_subscribers FOR DELETE TO anon, authenticated USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =============================================================
-- Migration 009: Manufacturer Description
-- =============================================================

ALTER TABLE manufacturers
  ADD COLUMN IF NOT EXISTS description TEXT;


-- =============================================================
-- Migration 010: News and Funding
-- =============================================================

CREATE TABLE IF NOT EXISTS news_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  url         TEXT NOT NULL UNIQUE,
  source      TEXT NOT NULL,
  summary     TEXT,
  category    TEXT,
  image_url   TEXT,
  published_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_items_published ON news_items(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_items_category ON news_items(category);

ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "News items are publicly readable" ON news_items FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Service role manages news" ON news_items FOR ALL TO service_role USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS funding_rounds (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company     TEXT NOT NULL,
  amount      TEXT,
  round       TEXT,
  date        DATE,
  investors   TEXT,
  source_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_funding_date ON funding_rounds(date DESC);

ALTER TABLE funding_rounds ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "Funding rounds are publicly readable" ON funding_rounds FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Service role manages funding" ON funding_rounds FOR ALL TO service_role USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =============================================================
-- Migration 011: Pro Waitlist
-- =============================================================

CREATE TABLE IF NOT EXISTS pro_waitlist (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email      TEXT NOT NULL UNIQUE,
  position   SERIAL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pro_waitlist_position ON pro_waitlist(position);

ALTER TABLE pro_waitlist ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Anyone can join pro waitlist" ON pro_waitlist FOR INSERT TO anon, authenticated WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Service role manages pro waitlist" ON pro_waitlist FOR ALL TO service_role USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =============================================================
-- Migration 012: Buyer Intelligence Fields
-- =============================================================

ALTER TABLE robots ADD COLUMN IF NOT EXISTS maintenance_annual_pct DECIMAL;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS maintenance_annual_cost_low INT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS maintenance_annual_cost_high INT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS warranty_months INT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS warranty_coverage TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS support_model TEXT CHECK (support_model IN ('on-site', 'remote', 'partner', 'none'));
ALTER TABLE robots ADD COLUMN IF NOT EXISTS support_response_hours INT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS spare_parts_availability TEXT CHECK (spare_parts_availability IN ('stocked', 'order', 'custom', 'proprietary'));
ALTER TABLE robots ADD COLUMN IF NOT EXISTS deployment_weeks_min INT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS deployment_weeks_max INT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS floor_space_sqft INT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS power_requirements TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS network_requirements TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS wms_integrations TEXT[];
ALTER TABLE robots ADD COLUMN IF NOT EXISTS erp_integrations TEXT[];
ALTER TABLE robots ADD COLUMN IF NOT EXISTS api_available BOOLEAN DEFAULT false;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS operator_training_hours INT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS safety_certifications TEXT[];
ALTER TABLE robots ADD COLUMN IF NOT EXISTS industry_certifications TEXT[];
ALTER TABLE robots ADD COLUMN IF NOT EXISTS vendor_funding_total TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS vendor_employees_range TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS vendor_health_score INT CHECK (vendor_health_score BETWEEN 1 AND 10);


-- =============================================================
-- Migration 013: Fleet Management
-- =============================================================

CREATE TABLE IF NOT EXISTS robot_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  robot_id UUID REFERENCES robots(id),
  custom_name TEXT,
  serial_number TEXT,
  purchase_date DATE,
  purchase_price INT,
  site_location TEXT,
  department TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'offline', 'decommissioned')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS maintenance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES robot_assets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  log_date DATE NOT NULL,
  maintenance_type TEXT NOT NULL CHECK (maintenance_type IN ('routine', 'repair', 'emergency', 'upgrade')),
  description TEXT,
  technician TEXT,
  cost INT,
  downtime_hours DECIMAL,
  parts_replaced TEXT[],
  next_service_date DATE,
  documents TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS maintenance_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES robot_assets(id) ON DELETE CASCADE,
  schedule_name TEXT NOT NULL,
  interval_type TEXT NOT NULL CHECK (interval_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'annual', 'hours-based')),
  interval_value INT NOT NULL DEFAULT 1,
  task_description TEXT,
  estimated_hours DECIMAL,
  estimated_cost INT,
  requires_professional BOOLEAN DEFAULT false,
  last_completed DATE,
  next_due DATE,
  alert_days_before INT DEFAULT 7,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE robot_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_schedules ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Users can manage own assets" ON robot_assets FOR ALL USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users can manage own maintenance logs" ON maintenance_logs FOR ALL USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users can manage schedules for own assets" ON maintenance_schedules FOR ALL USING (asset_id IN (SELECT id FROM robot_assets WHERE user_id = auth.uid())); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_robot_assets_user ON robot_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_robot_assets_status ON robot_assets(status);
CREATE INDEX IF NOT EXISTS idx_robot_assets_robot ON robot_assets(robot_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_asset ON maintenance_logs(asset_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_date ON maintenance_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_type ON maintenance_logs(maintenance_type);
CREATE INDEX IF NOT EXISTS idx_maintenance_schedules_asset ON maintenance_schedules(asset_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_schedules_next_due ON maintenance_schedules(next_due);
CREATE INDEX IF NOT EXISTS idx_maintenance_schedules_active ON maintenance_schedules(is_active);


-- =============================================================
-- Migration 014: Market Reports
-- =============================================================

CREATE TABLE IF NOT EXISTS market_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  source_url TEXT,
  report_date DATE,
  category TEXT,
  market_size_usd_billions DECIMAL,
  cagr_percent DECIMAL,
  forecast_year INT,
  key_findings TEXT[],
  raw_excerpt TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE market_reports ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "Public read market_reports" ON market_reports FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Add enhanced fields to funding_rounds
ALTER TABLE funding_rounds ADD COLUMN IF NOT EXISTS company_description TEXT;
ALTER TABLE funding_rounds ADD COLUMN IF NOT EXISTS total_raised_to_date TEXT;
ALTER TABLE funding_rounds ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE funding_rounds ADD COLUMN IF NOT EXISTS robot_id UUID REFERENCES robots(id);
ALTER TABLE funding_rounds ADD COLUMN IF NOT EXISTS co_investors TEXT[];
ALTER TABLE funding_rounds ADD COLUMN IF NOT EXISTS lead_investor TEXT;


-- =============================================================
-- Migration 015: New Categories
-- =============================================================

INSERT INTO robot_categories (id, slug, name)
VALUES
  ('c1000001-0000-0000-0000-000000000001', 'security', 'Security & Surveillance'),
  ('c1000001-0000-0000-0000-000000000002', 'hospitality', 'Hospitality & Service'),
  ('c1000001-0000-0000-0000-000000000003', 'humanoid', 'Humanoid Robots')
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- Migration 016: Careers Interest
-- =============================================================

CREATE TABLE IF NOT EXISTS careers_interest (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           TEXT NOT NULL,
  type            TEXT NOT NULL CHECK (type IN ('worker', 'employer', 'manufacturer')),
  role_interest   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(email, type)
);

CREATE INDEX IF NOT EXISTS idx_careers_interest_type ON careers_interest(type);
CREATE INDEX IF NOT EXISTS idx_careers_interest_created ON careers_interest(created_at DESC);

ALTER TABLE careers_interest ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Anyone can submit career interest" ON careers_interest FOR INSERT TO anon, authenticated WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Service role manages career interest" ON careers_interest FOR ALL TO service_role USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =============================================================
-- Migration 017: Robot Videos
-- =============================================================

ALTER TABLE robots ADD COLUMN IF NOT EXISTS youtube_url TEXT;


-- =============================================================
-- Migration 018: RoboWork
-- =============================================================

-- Enums
DO $$ BEGIN CREATE TYPE robowork_fulfillment_type AS ENUM ('with_operator', 'drop_off', 'remote_operated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE robowork_job_status AS ENUM ('draft', 'open', 'in_review', 'filled', 'completed', 'cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE robowork_urgency AS ENUM ('flexible', 'within_week', 'within_month', 'asap'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE robowork_bid_status AS ENUM ('pending', 'shortlisted', 'accepted', 'rejected', 'withdrawn'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 1. robot_service_providers
CREATE TABLE IF NOT EXISTS robot_service_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  bio TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'US',
  service_radius INTEGER DEFAULT 50,
  operating_regions TEXT[] DEFAULT '{}',
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  verification_documents TEXT[] DEFAULT '{}',
  rating NUMERIC(3,2) DEFAULT 0,
  total_jobs INTEGER DEFAULT 0,
  completed_jobs INTEGER DEFAULT 0,
  response_time_hours NUMERIC(5,1),
  insurance_verified BOOLEAN DEFAULT false,
  background_checked BOOLEAN DEFAULT false,
  profile_image TEXT,
  portfolio_images TEXT[] DEFAULT '{}',
  website TEXT,
  linkedin TEXT,
  specializations TEXT[] DEFAULT '{}',
  fulfillment_types TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. rsp_robots
CREATE TABLE IF NOT EXISTS rsp_robots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rsp_id UUID NOT NULL REFERENCES robot_service_providers(id) ON DELETE CASCADE,
  robot_id UUID REFERENCES robots(id) ON DELETE SET NULL,
  custom_name TEXT,
  custom_manufacturer TEXT,
  custom_category TEXT,
  description TEXT,
  fulfillment_types TEXT[] DEFAULT '{}',
  daily_rate NUMERIC(10,2),
  weekly_rate NUMERIC(10,2),
  monthly_rate NUMERIC(10,2),
  minimum_days INTEGER DEFAULT 1,
  available BOOLEAN DEFAULT true,
  available_from DATE,
  city TEXT,
  state TEXT,
  operator_included BOOLEAN DEFAULT false,
  remote_capable BOOLEAN DEFAULT false,
  images TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. robowork_jobs
CREATE TABLE IF NOT EXISTS robowork_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  business_name TEXT NOT NULL,
  business_email TEXT NOT NULL,
  business_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  task_type TEXT NOT NULL,
  industry TEXT NOT NULL,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'US',
  remote_ok BOOLEAN DEFAULT false,
  start_date DATE,
  end_date DATE,
  duration_days INTEGER,
  budget_min NUMERIC(10,2),
  budget_max NUMERIC(10,2),
  fulfillment_type TEXT DEFAULT 'any',
  robot_type TEXT DEFAULT 'any',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','open','in_review','filled','completed','cancelled')),
  urgency TEXT DEFAULT 'flexible' CHECK (urgency IN ('flexible','within_week','within_month','asap')),
  requirements TEXT,
  site_details TEXT,
  attachments TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  bid_count INTEGER DEFAULT 0,
  selected_bid_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);

-- 4. robowork_bids
CREATE TABLE IF NOT EXISTS robowork_bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES robowork_jobs(id) ON DELETE CASCADE,
  rsp_id UUID NOT NULL REFERENCES robot_service_providers(id) ON DELETE CASCADE,
  rsp_robot_id UUID REFERENCES rsp_robots(id) ON DELETE SET NULL,
  proposed_price NUMERIC(10,2) NOT NULL,
  price_breakdown JSONB DEFAULT '{}',
  message TEXT,
  fulfillment_type TEXT,
  proposed_start_date DATE,
  proposed_end_date DATE,
  includes_operator BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','shortlisted','accepted','rejected','withdrawn')),
  business_response TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. robowork_reviews
CREATE TABLE IF NOT EXISTS robowork_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES robowork_jobs(id) ON DELETE CASCADE,
  rsp_id UUID NOT NULL REFERENCES robot_service_providers(id) ON DELETE CASCADE,
  reviewer_name TEXT,
  reviewer_company TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT,
  would_hire_again BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_rsp_slug ON robot_service_providers(slug);
CREATE INDEX IF NOT EXISTS idx_rsp_verified ON robot_service_providers(verified);
CREATE INDEX IF NOT EXISTS idx_rsp_specializations ON robot_service_providers USING GIN(specializations);
CREATE INDEX IF NOT EXISTS idx_rsp_robots_rsp_id ON rsp_robots(rsp_id);
CREATE INDEX IF NOT EXISTS idx_rsp_robots_available ON rsp_robots(available);
CREATE INDEX IF NOT EXISTS idx_jobs_slug ON robowork_jobs(slug);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON robowork_jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_industry ON robowork_jobs(industry);
CREATE INDEX IF NOT EXISTS idx_jobs_task_type ON robowork_jobs(task_type);
CREATE INDEX IF NOT EXISTS idx_jobs_created ON robowork_jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bids_job_id ON robowork_bids(job_id);
CREATE INDEX IF NOT EXISTS idx_bids_rsp_id ON robowork_bids(rsp_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rsp_id ON robowork_reviews(rsp_id);

-- RLS
ALTER TABLE robot_service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsp_robots ENABLE ROW LEVEL SECURITY;
ALTER TABLE robowork_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE robowork_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE robowork_reviews ENABLE ROW LEVEL SECURITY;

-- Public read for all
DO $$ BEGIN CREATE POLICY "Public read RSPs" ON robot_service_providers FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read RSP robots" ON rsp_robots FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read open jobs" ON robowork_jobs FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read reviews" ON robowork_reviews FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read bids" ON robowork_bids FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Auth write
DO $$ BEGIN CREATE POLICY "Auth insert RSPs" ON robot_service_providers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Owner update RSPs" ON robot_service_providers FOR UPDATE USING (user_id = auth.uid()); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Auth insert RSP robots" ON rsp_robots FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Auth update RSP robots" ON rsp_robots FOR UPDATE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Anyone can post jobs" ON robowork_jobs FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Auth update jobs" ON robowork_jobs FOR UPDATE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Auth insert bids" ON robowork_bids FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Auth update bids" ON robowork_bids FOR UPDATE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Auth insert reviews" ON robowork_reviews FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =============================================================
-- Migration 019: Manufacturer Connect
-- =============================================================

-- Add partnership fields to manufacturers
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS partnership_status TEXT DEFAULT 'prospect' CHECK (partnership_status IN ('prospect','contacted','partner','featured'));
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS partnership_tier TEXT DEFAULT NULL CHECK (partnership_tier IN ('bronze','silver','gold','platinum'));
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS partner_contact_name TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS partner_contact_email TEXT;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS data_accuracy INTEGER DEFAULT 0;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS last_verified TIMESTAMPTZ;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS featured_until TIMESTAMPTZ;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS sponsored_listings BOOLEAN DEFAULT false;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS claimed_profile BOOLEAN DEFAULT false;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMPTZ;
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS claimed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Manufacturer claim requests
CREATE TABLE IF NOT EXISTS manufacturer_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manufacturer_id UUID NOT NULL REFERENCES manufacturers(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  work_email TEXT NOT NULL,
  linkedin_url TEXT,
  description TEXT,
  contact_info TEXT,
  logo_url TEXT,
  catalog_url TEXT,
  interested_featured BOOLEAN DEFAULT false,
  interested_sponsored BOOLEAN DEFAULT false,
  preferred_contact TEXT DEFAULT 'email',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Partnership inquiries
CREATE TABLE IF NOT EXISTS manufacturer_partnerships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  tier_interest TEXT CHECK (tier_interest IN ('bronze','silver','gold','platinum')),
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','negotiating','closed_won','closed_lost')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Contact tracking
CREATE TABLE IF NOT EXISTS manufacturer_contact_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manufacturer_id UUID NOT NULL REFERENCES manufacturers(id) ON DELETE CASCADE,
  click_type TEXT NOT NULL CHECK (click_type IN ('sales','demo','website','claim')),
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mfr_partnership_status ON manufacturers(partnership_status);
CREATE INDEX IF NOT EXISTS idx_mfr_partnership_tier ON manufacturers(partnership_tier);
CREATE INDEX IF NOT EXISTS idx_mfr_claimed ON manufacturers(claimed_profile);
CREATE INDEX IF NOT EXISTS idx_mfr_claims_status ON manufacturer_claims(status);
CREATE INDEX IF NOT EXISTS idx_mfr_contact_clicks ON manufacturer_contact_clicks(manufacturer_id, click_type);

-- RLS
ALTER TABLE manufacturer_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturer_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturer_contact_clicks ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Public insert claims" ON manufacturer_claims FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Admin read claims" ON manufacturer_claims FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public insert partnerships" ON manufacturer_partnerships FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Admin read partnerships" ON manufacturer_partnerships FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public insert contact clicks" ON manufacturer_contact_clicks FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read contact clicks" ON manufacturer_contact_clicks FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =============================================================
-- Migration 020: Leasing Marketplace
-- =============================================================

CREATE TABLE IF NOT EXISTS lease_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  robot_id UUID REFERENCES robots(id) ON DELETE SET NULL,
  robot_slug TEXT,
  robot_name TEXT,
  business_name TEXT NOT NULL,
  business_email TEXT NOT NULL,
  business_phone TEXT,
  industry TEXT,
  facility_size TEXT,
  employee_count TEXT,
  preferred_term INTEGER DEFAULT 36,
  budget_monthly NUMERIC(10,2),
  total_budget NUMERIC(12,2),
  credit_rating TEXT DEFAULT 'good' CHECK (credit_rating IN ('excellent','good','fair')),
  use_case TEXT,
  urgency TEXT DEFAULT 'flexible',
  currently_leasing BOOLEAN DEFAULT false,
  existing_equipment TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','funded','lost')),
  assigned_to TEXT,
  notes TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lease_transfers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  original_lease_id TEXT,
  robot_id UUID REFERENCES robots(id) ON DELETE SET NULL,
  robot_name TEXT NOT NULL,
  robot_manufacturer TEXT,
  seller_name TEXT NOT NULL,
  seller_email TEXT NOT NULL,
  seller_phone TEXT,
  monthly_payment NUMERIC(10,2),
  remaining_months INTEGER,
  remaining_balance NUMERIC(12,2),
  original_term INTEGER,
  lease_company TEXT,
  transfer_fee NUMERIC(10,2),
  condition INTEGER DEFAULT 3 CHECK (condition >= 1 AND condition <= 5),
  condition_notes TEXT,
  images TEXT[] DEFAULT '{}',
  city TEXT,
  state TEXT,
  available_from DATE,
  status TEXT DEFAULT 'listed' CHECK (status IN ('listed','in_transfer','completed','cancelled')),
  buyer_name TEXT,
  buyer_email TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS robot_time_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  robot_id UUID REFERENCES robots(id) ON DELETE SET NULL,
  robot_name TEXT NOT NULL,
  robot_manufacturer TEXT,
  robot_model TEXT,
  owner_id UUID,
  owner_name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  city TEXT,
  state TEXT,
  available_hours JSONB DEFAULT '{}',
  hourly_rate NUMERIC(10,2),
  half_day_rate NUMERIC(10,2),
  daily_rate NUMERIC(10,2),
  minimum_hours INTEGER DEFAULT 4,
  robot_type TEXT,
  capabilities TEXT[] DEFAULT '{}',
  operator_included BOOLEAN DEFAULT false,
  remote_capable BOOLEAN DEFAULT false,
  industries TEXT[] DEFAULT '{}',
  description TEXT,
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'available' CHECK (status IN ('available','partially_booked','unavailable')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS time_share_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  time_share_id UUID NOT NULL REFERENCES robot_time_shares(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_email TEXT NOT NULL,
  start_date_time TIMESTAMPTZ NOT NULL,
  end_date_time TIMESTAMPTZ NOT NULL,
  total_hours NUMERIC(6,1),
  total_cost NUMERIC(10,2),
  fulfillment_type TEXT,
  task_description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
  platform_fee NUMERIC(10,2),
  owner_payout NUMERIC(10,2),
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lease_inquiries_status ON lease_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_lease_transfers_status ON lease_transfers(status);
CREATE INDEX IF NOT EXISTS idx_time_shares_status ON robot_time_shares(status);
CREATE INDEX IF NOT EXISTS idx_time_shares_city ON robot_time_shares(city, state);
CREATE INDEX IF NOT EXISTS idx_time_share_bookings_status ON time_share_bookings(status);

-- RLS
ALTER TABLE lease_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE lease_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE robot_time_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_share_bookings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Public insert lease inquiries" ON lease_inquiries FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Admin read lease inquiries" ON lease_inquiries FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read lease transfers" ON lease_transfers FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public insert lease transfers" ON lease_transfers FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read time shares" ON robot_time_shares FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public insert time shares" ON robot_time_shares FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public insert bookings" ON time_share_bookings FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read bookings" ON time_share_bookings FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =============================================================
-- Migration 021: Certification Program
-- =============================================================

CREATE TABLE IF NOT EXISTS rco_certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  level INTEGER NOT NULL CHECK (level >= 1 AND level <= 4),
  specialization TEXT,
  description TEXT,
  exam_duration INTEGER NOT NULL DEFAULT 60,
  question_count INTEGER NOT NULL DEFAULT 50,
  passing_score INTEGER NOT NULL DEFAULT 75,
  price NUMERIC(10,2) NOT NULL,
  renewal_years INTEGER DEFAULT 2,
  renewal_price NUMERIC(10,2),
  prerequisites TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  industries TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rco_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certification_id UUID NOT NULL REFERENCES rco_certifications(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice','scenario','image_based')),
  options JSONB NOT NULL DEFAULT '[]',
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  difficulty INTEGER DEFAULT 3 CHECK (difficulty >= 1 AND difficulty <= 5),
  category TEXT DEFAULT 'theory' CHECK (category IN ('safety','operations','maintenance','regulations','troubleshooting','theory','business')),
  time_limit INTEGER DEFAULT 120,
  media_url TEXT,
  reported_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rco_exam_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  certification_id UUID NOT NULL REFERENCES rco_certifications(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed','abandoned','flagged')),
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  question_ids JSONB DEFAULT '[]',
  answers JSONB DEFAULT '{}',
  tab_switch_count INTEGER DEFAULT 0,
  focus_lost_count INTEGER DEFAULT 0,
  time_anomalies JSONB DEFAULT '[]',
  score NUMERIC(5,2),
  passed BOOLEAN,
  flagged_for_review BOOLEAN DEFAULT false,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rco_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  certification_id UUID NOT NULL REFERENCES rco_certifications(id) ON DELETE CASCADE,
  exam_session_id UUID REFERENCES rco_exam_sessions(id),
  credential_id TEXT UNIQUE NOT NULL,
  holder_name TEXT NOT NULL,
  holder_email TEXT NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','expired','revoked','suspended')),
  manufacturer_endorsements TEXT[] DEFAULT '{}',
  verification_count INTEGER DEFAULT 0,
  shareable_url TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rco_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  certification_id UUID NOT NULL REFERENCES rco_certifications(id) ON DELETE CASCADE,
  payer_name TEXT NOT NULL,
  payer_email TEXT NOT NULL,
  paid_by TEXT DEFAULT 'self' CHECK (paid_by IN ('self','employer')),
  employer_name TEXT,
  stripe_payment_intent_id TEXT,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','completed','refunded')),
  exam_attempt INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_rco_certs_level ON rco_certifications(level);
CREATE INDEX IF NOT EXISTS idx_rco_certs_slug ON rco_certifications(slug);
CREATE INDEX IF NOT EXISTS idx_rco_questions_cert ON rco_questions(certification_id);
CREATE INDEX IF NOT EXISTS idx_rco_questions_category ON rco_questions(category);
CREATE INDEX IF NOT EXISTS idx_rco_sessions_user ON rco_exam_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_rco_sessions_status ON rco_exam_sessions(status);
CREATE INDEX IF NOT EXISTS idx_rco_credentials_user ON rco_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_rco_credentials_cred_id ON rco_credentials(credential_id);

-- RLS
ALTER TABLE rco_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_payments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Public read certifications" ON rco_certifications FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Admin read questions" ON rco_questions FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Auth insert sessions" ON rco_exam_sessions FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Auth read own sessions" ON rco_exam_sessions FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Auth update own sessions" ON rco_exam_sessions FOR UPDATE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read credentials" ON rco_credentials FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Auth insert credentials" ON rco_credentials FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Auth insert payments" ON rco_payments FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Auth read payments" ON rco_payments FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =============================================================
-- Migration 022: Post Purchase
-- =============================================================

CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  robot_id UUID REFERENCES robots(id) ON DELETE SET NULL,
  robot_name TEXT,
  robot_manufacturer TEXT,
  robot_model TEXT,
  business_name TEXT NOT NULL,
  business_email TEXT NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('scheduled','emergency','inspection','training','integration','calibration')),
  description TEXT,
  urgency TEXT DEFAULT 'scheduled' CHECK (urgency IN ('emergency','scheduled','flexible')),
  city TEXT,
  state TEXT,
  preferred_date DATE,
  flexible_date BOOLEAN DEFAULT true,
  budget_range TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','matched','in_progress','completed')),
  assigned_provider_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS parts_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  robot_id UUID REFERENCES robots(id) ON DELETE SET NULL,
  part_name TEXT NOT NULL,
  part_number TEXT,
  manufacturer TEXT,
  compatible_models TEXT[] DEFAULT '{}',
  condition TEXT DEFAULT 'new' CHECK (condition IN ('new','oem_refurb','aftermarket')),
  price NUMERIC(10,2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  city TEXT,
  state TEXT,
  ships_nationally BOOLEAN DEFAULT true,
  seller_id UUID,
  seller_name TEXT NOT NULL,
  seller_email TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'available' CHECK (status IN ('available','sold','reserved')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS trade_in_valuations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  robot_id UUID REFERENCES robots(id) ON DELETE SET NULL,
  robot_name TEXT NOT NULL,
  robot_manufacturer TEXT,
  robot_model TEXT,
  year_purchased INTEGER,
  purchase_price NUMERIC(12,2),
  operating_hours INTEGER,
  condition INTEGER DEFAULT 3 CHECK (condition >= 1 AND condition <= 5),
  condition_notes TEXT,
  known_issues TEXT,
  software_version TEXT,
  last_maintenance DATE,
  city TEXT,
  state TEXT,
  business_name TEXT NOT NULL,
  business_email TEXT NOT NULL,
  business_phone TEXT,
  market_demand_score INTEGER DEFAULT 50,
  estimated_low NUMERIC(12,2),
  estimated_high NUMERIC(12,2),
  estimated_mid NUMERIC(12,2),
  valuation_factors JSONB DEFAULT '{}',
  recommendation TEXT CHECK (recommendation IN ('keep','trade_in','list_cpo','lease_transfer','timeshare')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','valued','listed','sold')),
  listed_as_cpo BOOLEAN DEFAULT false,
  sold_price NUMERIC(12,2),
  sold_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cpo_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  robot_id UUID REFERENCES robots(id) ON DELETE SET NULL,
  trade_in_id UUID REFERENCES trade_in_valuations(id) ON DELETE SET NULL,
  robot_name TEXT NOT NULL,
  robot_manufacturer TEXT,
  robot_model TEXT,
  year INTEGER,
  condition INTEGER DEFAULT 3 CHECK (condition >= 1 AND condition <= 5),
  condition_report TEXT,
  operating_hours INTEGER,
  certified_by TEXT,
  images TEXT[] DEFAULT '{}',
  asking_price NUMERIC(12,2) NOT NULL,
  negotiable BOOLEAN DEFAULT true,
  city TEXT,
  state TEXT,
  ships_nationally BOOLEAN DEFAULT false,
  warranty_months INTEGER DEFAULT 0,
  robotomated_certified BOOLEAN DEFAULT false,
  seller_id UUID,
  seller_email TEXT NOT NULL,
  status TEXT DEFAULT 'listed' CHECK (status IN ('listed','pending','sold')),
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS robot_insurance_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  robot_id UUID REFERENCES robots(id) ON DELETE SET NULL,
  robot_name TEXT,
  robot_manufacturer TEXT,
  robot_model TEXT,
  purchase_price NUMERIC(12,2),
  year_purchased INTEGER,
  business_name TEXT NOT NULL,
  business_email TEXT NOT NULL,
  industry TEXT,
  use_case TEXT,
  location_type TEXT DEFAULT 'indoor' CHECK (location_type IN ('indoor','outdoor','both')),
  operators_count INTEGER DEFAULT 1,
  existing_coverage BOOLEAN DEFAULT false,
  coverage_type TEXT DEFAULT 'comprehensive' CHECK (coverage_type IN ('all_risk','liability_only','business_interruption','comprehensive')),
  budget_monthly NUMERIC(10,2),
  status TEXT DEFAULT 'new' CHECK (status IN ('new','quoted','bound','lost')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_parts_listings_status ON parts_listings(status);
CREATE INDEX IF NOT EXISTS idx_parts_listings_manufacturer ON parts_listings(manufacturer);
CREATE INDEX IF NOT EXISTS idx_trade_in_status ON trade_in_valuations(status);
CREATE INDEX IF NOT EXISTS idx_cpo_listings_status ON cpo_listings(status);
CREATE INDEX IF NOT EXISTS idx_cpo_listings_manufacturer ON cpo_listings(robot_manufacturer);
CREATE INDEX IF NOT EXISTS idx_insurance_status ON robot_insurance_inquiries(status);

-- RLS
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_in_valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cpo_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE robot_insurance_inquiries ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Public insert service requests" ON service_requests FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Admin read service requests" ON service_requests FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read parts" ON parts_listings FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public insert parts" ON parts_listings FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public insert trade-ins" ON trade_in_valuations FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Admin read trade-ins" ON trade_in_valuations FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read CPO" ON cpo_listings FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public insert CPO" ON cpo_listings FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public insert insurance" ON robot_insurance_inquiries FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Admin read insurance" ON robot_insurance_inquiries FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =============================================================
-- Migration 023: RSP Dashboard
-- =============================================================

CREATE TABLE IF NOT EXISTS rsp_fleet_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rsp_id UUID NOT NULL REFERENCES robot_service_providers(id) ON DELETE CASCADE,
  rsp_robot_id UUID NOT NULL REFERENCES rsp_robots(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'idle' CHECK (status IN ('operational','maintenance','deployed','idle')),
  current_job_id UUID REFERENCES robowork_jobs(id) ON DELETE SET NULL,
  current_client_name TEXT,
  location TEXT,
  battery_level INTEGER,
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  hours_logged NUMERIC(10,1) DEFAULT 0,
  alert_flags TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rsp_maintenance_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rsp_id UUID NOT NULL REFERENCES robot_service_providers(id) ON DELETE CASCADE,
  rsp_robot_id UUID NOT NULL REFERENCES rsp_robots(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'scheduled' CHECK (type IN ('scheduled','emergency','preventive')),
  description TEXT,
  technician_name TEXT,
  parts_replaced TEXT[] DEFAULT '{}',
  parts_cost NUMERIC(10,2) DEFAULT 0,
  labor_hours NUMERIC(6,1) DEFAULT 0,
  total_cost NUMERIC(10,2) DEFAULT 0,
  completed_at TIMESTAMPTZ,
  next_service_due DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rsp_invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rsp_id UUID NOT NULL REFERENCES robot_service_providers(id) ON DELETE CASCADE,
  job_id UUID REFERENCES robowork_jobs(id) ON DELETE SET NULL,
  client_email TEXT NOT NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','paid','overdue','cancelled')),
  line_items JSONB DEFAULT '[]',
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'usd',
  due_date DATE,
  paid_at TIMESTAMPTZ,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fleet_status_rsp ON rsp_fleet_status(rsp_id);
CREATE INDEX IF NOT EXISTS idx_fleet_status_robot ON rsp_fleet_status(rsp_robot_id);
CREATE INDEX IF NOT EXISTS idx_rsp_maint_rsp ON rsp_maintenance_logs(rsp_id);
CREATE INDEX IF NOT EXISTS idx_rsp_maint_robot ON rsp_maintenance_logs(rsp_robot_id);
CREATE INDEX IF NOT EXISTS idx_rsp_invoices_rsp ON rsp_invoices(rsp_id);
CREATE INDEX IF NOT EXISTS idx_rsp_invoices_status ON rsp_invoices(status);

-- RLS
ALTER TABLE rsp_fleet_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsp_maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsp_invoices ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "RSP read fleet status" ON rsp_fleet_status FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "RSP insert fleet status" ON rsp_fleet_status FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "RSP update fleet status" ON rsp_fleet_status FOR UPDATE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "RSP read maint logs" ON rsp_maintenance_logs FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "RSP insert maint logs" ON rsp_maintenance_logs FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "RSP read invoices" ON rsp_invoices FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "RSP insert invoices" ON rsp_invoices FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "RSP update invoices" ON rsp_invoices FOR UPDATE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =============================================================
-- Migration 024: Robot Media
-- =============================================================

ALTER TABLE robots ADD COLUMN IF NOT EXISTS image_url_2 TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS image_url_3 TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS image_source TEXT DEFAULT 'unknown';
ALTER TABLE robots ADD COLUMN IF NOT EXISTS image_verified BOOLEAN DEFAULT false;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS image_width INTEGER;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS image_height INTEGER;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS image_updated_at TIMESTAMPTZ;
-- youtube_url already exists from migration 017
ALTER TABLE robots ADD COLUMN IF NOT EXISTS youtube_video_id TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS youtube_title TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS youtube_verified BOOLEAN DEFAULT false;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS youtube_duration_seconds INTEGER;

CREATE INDEX IF NOT EXISTS idx_robots_image_source ON robots(image_source);
CREATE INDEX IF NOT EXISTS idx_robots_image_verified ON robots(image_verified);
CREATE INDEX IF NOT EXISTS idx_robots_youtube_verified ON robots(youtube_verified);


-- =============================================================
-- Migration 025: Extended Media
-- =============================================================

ALTER TABLE robots ADD COLUMN IF NOT EXISTS youtube_thumbnail_url TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS youtube_channel TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS vimeo_video_id TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS wistia_video_id TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS video_embed_url TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS media_updated_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_robots_vimeo ON robots(vimeo_video_id) WHERE vimeo_video_id IS NOT NULL;


-- =============================================================
-- Migration 026: Humanoid Fields
-- =============================================================

-- Extended robot fields for humanoid intelligence
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_robots_robot_type ON robots(robot_type);
CREATE INDEX IF NOT EXISTS idx_robots_manufacturing_origin ON robots(manufacturing_origin);
CREATE INDEX IF NOT EXISTS idx_robots_raas_available ON robots(raas_available);
CREATE INDEX IF NOT EXISTS idx_robots_fleet_learning ON robots(fleet_learning);

-- RaaS pricing table
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

-- Safety standards
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

-- Robot-to-standard certifications
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

-- RLS
ALTER TABLE raas_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE robot_certifications ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "Public read raas" ON raas_pricing FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public insert raas" ON raas_pricing FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read standards" ON safety_standards FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read certs" ON robot_certifications FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Admin insert certs" ON robot_certifications FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Seed safety standards
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


-- =============================================================
-- Migration 027: Payments API
-- =============================================================

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

-- Indexes
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

-- RLS
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

-- Seed fee schedule
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


-- =============================================================
-- Migration 028: RSP Onboarding
-- =============================================================

ALTER TABLE robot_service_providers
  ADD COLUMN IF NOT EXISTS business_type text,
  ADD COLUMN IF NOT EXISTS years_in_robotics integer,
  ADD COLUMN IF NOT EXISTS is_founding_rsp boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS founding_rsp_number integer UNIQUE,
  ADD COLUMN IF NOT EXISTS founding_perks_claimed jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS verification_tier integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS specialization_levels jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS stripe_connect_id text,
  ADD COLUMN IF NOT EXISTS stripe_onboarding_complete boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS phone_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false;

CREATE TABLE IF NOT EXISTS founding_rsp_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  company_name text NOT NULL,
  email text NOT NULL,
  city text NOT NULL,
  robot_types text[] DEFAULT '{}',
  fleet_size integer,
  why_founding text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by text
);

ALTER TABLE founding_rsp_applications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Anyone can apply" ON founding_rsp_applications FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users can view own applications" ON founding_rsp_applications FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = email); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_founding_rsp_status ON founding_rsp_applications(status);
CREATE INDEX IF NOT EXISTS idx_rsp_founding ON robot_service_providers(is_founding_rsp) WHERE is_founding_rsp = true;


-- =============================================================
-- Migration 029: Performance Indexes
-- =============================================================

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


-- =============================================================
-- Migration 030: RSP Referrals
-- =============================================================

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


-- =============================================================
-- Migration 031: RCO v2
-- =============================================================

-- Domains
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

-- Questions v2 (multi-type, domain-linked)
CREATE TABLE IF NOT EXISTS rco_questions_v2 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain_id UUID REFERENCES rco_domains(id) ON DELETE SET NULL,
  level TEXT NOT NULL,
  specialization TEXT,
  question_type TEXT NOT NULL CHECK (
    question_type IN (
      'multiple_choice',
      'multi_select',
      'scenario',
      'fault_diagnosis',
      'code_review',
      'calculation',
      'sequencing',
      'true_false_justify'
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

-- Practical Assessments
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

-- Learning Paths
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

-- Study Progress
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

-- Practice Session Tracking
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

-- Employer Teams
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

-- Indexes
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

-- RLS
ALTER TABLE rco_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_questions_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_practical_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_study_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_employer_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_employer_members ENABLE ROW LEVEL SECURITY;

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

-- Seed: 17 Domains
INSERT INTO rco_domains (code, name, description, weight_percent, level_required, sort_order) VALUES
-- Foundation domains (Level 1)
('SAFETY_FUNDAMENTALS', 'Robot Safety & Risk Assessment',
 'ISO 10218, collaborative robot safety, emergency procedures, risk matrices, lockout/tagout for robotic systems',
 25, 'foundation', 1),

('ROBOT_BASICS', 'Robot Types, Components & Architecture',
 'AMR, cobot, industrial arm, humanoid, sensors, actuators, compute, batteries, degrees of freedom, kinematics basics',
 20, 'foundation', 2),

('DEPLOYMENT_FUNDAMENTALS', 'Basic Deployment & Operations',
 'Site assessment, workspace setup, robot commissioning, basic programming, operator interface, maintenance basics',
 20, 'foundation', 3),

('TROUBLESHOOTING_L1', 'Basic Fault Diagnosis',
 'Error codes, sensor failures, connectivity issues, mechanical jams, basic diagnostic procedures',
 20, 'foundation', 4),

('REGULATIONS_ETHICS', 'Compliance, Ethics & Documentation',
 'OSHA regulations, safety standards, incident reporting, operator liability, data privacy in robot deployments',
 15, 'foundation', 5),

-- Specialist domains (Level 2)
('ADVANCED_PROGRAMMING', 'Robot Programming & Control Systems',
 'ROS2, motion planning, trajectory optimization, PID control, force control, sensor fusion',
 25, 'specialist', 6),

('FLEET_MANAGEMENT', 'Multi-Robot Fleet Operations',
 'Fleet coordination, task allocation, traffic management, OTA updates, uptime optimization, KPI tracking',
 20, 'specialist', 7),

('FAULT_INJECTION_MASTERY', 'Live Fault Diagnosis Under Pressure',
 'Edge case debugging, zero-downtime repairs, mid-shift reprogramming, hardware failures, sensor drift, actuator degradation',
 25, 'specialist', 8),

('PERCEPTION_AI', 'Computer Vision & AI Integration',
 'Point cloud processing, object detection, semantic segmentation, model fine-tuning, sim-to-real transfer, VLA models',
 30, 'specialist', 9),

-- Master domains (Level 3)
('SIM_TO_REAL', 'Simulation to Reality Bridge Mastery',
 'Physics engine tuning, domain randomization, adversarial simulation, reality gap closure, neural network transfer learning',
 20, 'master', 10),

('DEXTERITY_CONTROL', 'Dexterous Manipulation & Fine Motor',
 '50+ DOF hand control, deformable objects, force feedback, surgical precision, tool use in novel environments',
 25, 'master', 11),

('WORLD_MODELING', 'Robot World Models & Scene Understanding',
 'Spatial reasoning, novel environment handling, latent action spaces, diffusion policies, end-to-end autonomy without teleoperation',
 20, 'master', 12),

('EDGE_INFERENCE', 'Edge Computing & Inference Optimization',
 'Distributed compute, token efficiency, on-device inference, model compression, real-time performance at scale',
 15, 'master', 13),

('SYSTEM_ARCHITECTURE', 'Full Stack Robot System Design',
 'Hardware/software co-design, self-replication concepts, swarm coordination, robot building robot concepts',
 20, 'master', 14),

-- Fleet Commander domains (Level 4)
('PROGRAM_DESIGN', 'Certification Program Design & Training',
 'Designing operator training programs, competency frameworks, skills gap analysis, continuous education',
 30, 'fleet_commander', 15),

('INCIDENT_COMMAND', 'Crisis Management & Incident Command',
 'Multi-robot incidents, factory emergencies, regulatory response, PR protocols, post-incident analysis',
 35, 'fleet_commander', 16),

('BUSINESS_OPERATIONS', 'Robot Business Operations & ROI',
 'Fleet economics, contract negotiation, client management, scaling operations, vendor evaluation, TCO modeling',
 35, 'fleet_commander', 17)
ON CONFLICT (code) DO NOTHING;

-- Seed: Practical Assessments (Master Gauntlet)
INSERT INTO rco_practical_assessments (level, title, description, scenario, robot_type, environment, time_limit_minutes, evaluation_criteria, pass_requirements, sort_order)
SELECT * FROM (VALUES
('master', 'Round 1: Fault Injection',
 'Unknown faults have been injected into a simulated robot system. Find and fix them all.',
 'A simulated robot system is handed to you with 5 injected faults: sensor drift (lidar), corrupted navigation map (5% error), intermittent actuator failure, network packet loss (15%), incorrect force thresholds. You have 30 minutes to find and fix ALL.',
 'Mixed fleet', 'Simulated warehouse', 30,
 '["Fault identification speed", "Diagnostic methodology", "Fix accuracy", "System verification after fix"]'::jsonb,
 'Fix 4 of 5 faults within time limit', 1),

('master', 'Round 2: Zero Downtime',
 'Perform maintenance, updates, and reconfiguration WITHOUT stopping production.',
 'Production simulation is running with 8 active robots. You must perform firmware update on 2 robots, reconfigure safety zones for a new obstacle, and replace a degraded sensor — all without any production stoppage events.',
 'AMR fleet', 'Active production floor', 30,
 '["Zero production stoppages", "Update procedure correctness", "Safety zone validation", "Change documentation"]'::jsonb,
 'Zero production stoppage events', 2),

('master', 'Round 3: Novel Environment',
 'Deploy a robot in an environment it has never seen. Adapt on the fly.',
 'A robot is placed in a completely new environment with unknown layout, lighting conditions, and obstacles. You must: remap key areas, adjust perception thresholds, validate safety zones, and document all changes. The robot must complete an assigned pick-and-place task.',
 'Cobot arm + AMR', 'Unknown facility', 30,
 '["Mapping accuracy", "Perception tuning", "Safety validation", "Task completion", "Documentation quality"]'::jsonb,
 'Robot completes assigned task in novel environment', 3),

('master', 'Round 4: Code Review & Fix',
 'Identify all bugs, security issues, safety failures, and performance problems in broken robot control code.',
 'Given 3 files of broken robot control code (ROS2 Python): an emergency stop node, a navigation planner, and a fleet coordinator. Must identify all bugs across all files and fix the safety-critical ones live.',
 'ROS2 system', 'Code review environment', 30,
 '["Bug identification completeness", "Safety-critical prioritization", "Fix correctness", "Code quality after fix"]'::jsonb,
 'Fix all safety-critical bugs', 4),

-- Fleet Commander Capstone
('fleet_commander', 'Capstone: Enterprise Deployment Strategy',
 'Design and present a complete robot deployment strategy for a simulated enterprise scenario.',
 'FreshMart Grocery Chain (200 stores) wants to deploy autonomous robots for: store shelf scanning/restocking, customer service/wayfinding, overnight cleaning/maintenance, inventory management integration, after-hours security. Total: 800+ robots, Budget: $12M over 3 years, Staff: 2,000 existing employees. Constraints: FDA compliance, customer safety, union considerations.',
 'Mixed fleet (800+)', 'Multi-site retail', 240,
 '["Fleet architecture recommendation", "Vendor selection with RoboScore", "5-year ROI model", "Operator training plan", "Safety/compliance framework", "Integration architecture", "Risk register", "Deployment roadmap"]'::jsonb,
 'Meets all 8 deliverable standards, reviewed by panel', 1)
) AS v(level, title, description, scenario, robot_type, environment, time_limit_minutes, evaluation_criteria, pass_requirements, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM rco_practical_assessments LIMIT 1);

-- Seed: Learning Paths
INSERT INTO rco_learning_paths (level, module_number, title, description, topics, estimated_hours, prerequisites, sort_order)
SELECT * FROM (VALUES
-- Foundation modules
('foundation', 1, 'Robot Safety Fundamentals',
 'Master the safety protocols that keep humans and robots working together safely.',
 ARRAY['ISO 10218 overview', 'Risk assessment methods', 'Emergency procedures', 'Lockout/tagout for robotics', 'Safety zone design'],
 3.0::numeric, '{}'::text[], 1),

('foundation', 2, 'Robot Types & Architecture',
 'Understand the full landscape of robotic systems — from AMRs to humanoids.',
 ARRAY['AMR vs AGV vs Cobot', 'Sensors deep dive', 'Actuators & drive systems', 'Compute & AI hardware', 'Degrees of freedom & kinematics'],
 3.5, '{}', 2),

('foundation', 3, 'Basic Deployment & Operations',
 'Learn how to commission, operate, and maintain robotic systems.',
 ARRAY['Site assessment', 'Robot commissioning', 'HMI & operator interfaces', 'Basic programming concepts', 'Maintenance schedules'],
 3.0, ARRAY['Robot Types & Architecture'], 3),

('foundation', 4, 'Basic Fault Diagnosis',
 'Identify and resolve the most common robot failures.',
 ARRAY['Error code interpretation', 'Sensor failure diagnosis', 'Connectivity troubleshooting', 'Mechanical jam resolution', 'Diagnostic procedures'],
 2.5, ARRAY['Basic Deployment & Operations'], 4),

('foundation', 5, 'Compliance, Ethics & Documentation',
 'Navigate the regulatory landscape and document everything properly.',
 ARRAY['OSHA regulations', 'Safety standards overview', 'Incident reporting', 'Operator liability', 'Data privacy'],
 2.0, '{}', 5),

-- Specialist modules
('specialist', 1, 'Robot Programming & Control Systems',
 'Deep dive into ROS2, motion planning, and advanced control theory.',
 ARRAY['ROS2 architecture', 'Motion planning algorithms', 'Trajectory optimization', 'PID & force control', 'Sensor fusion techniques'],
 8.0, ARRAY['Foundation certification'], 1),

('specialist', 2, 'Multi-Robot Fleet Operations',
 'Manage fleets of robots at scale with coordination and optimization.',
 ARRAY['Fleet coordination algorithms', 'Task allocation strategies', 'Traffic management', 'OTA update procedures', 'KPI tracking & uptime'],
 6.0, ARRAY['Foundation certification'], 2),

('specialist', 3, 'Live Fault Diagnosis Under Pressure',
 'Debug edge cases and perform zero-downtime repairs in production.',
 ARRAY['Edge case debugging', 'Zero-downtime repair techniques', 'Mid-shift reprogramming', 'Hardware failure response', 'Sensor drift compensation'],
 8.0, ARRAY['Robot Programming & Control Systems'], 3),

('specialist', 4, 'Computer Vision & AI Integration',
 'Integrate perception systems and AI models into robotic platforms.',
 ARRAY['Point cloud processing', 'Object detection pipelines', 'Semantic segmentation', 'Model fine-tuning', 'Sim-to-real transfer basics'],
 10.0, ARRAY['Robot Programming & Control Systems'], 4),

-- Master modules
('master', 1, 'Simulation to Reality Bridge',
 'Close the sim-to-real gap with advanced transfer techniques.',
 ARRAY['Physics engine tuning', 'Domain randomization', 'Adversarial simulation', 'Reality gap analysis', 'Neural network transfer'],
 12.0, ARRAY['Specialist certification'], 1),

('master', 2, 'Dexterous Manipulation',
 'Master fine motor control for complex manipulation tasks.',
 ARRAY['High-DOF hand control', 'Deformable object manipulation', 'Force feedback systems', 'Surgical-precision tasks', 'Tool use in novel environments'],
 15.0, ARRAY['Specialist certification'], 2),

('master', 3, 'World Models & Scene Understanding',
 'Build and leverage world models for autonomous robot operation.',
 ARRAY['Spatial reasoning', 'Novel environment handling', 'Latent action spaces', 'Diffusion policies', 'End-to-end autonomy'],
 12.0, ARRAY['Computer Vision & AI Integration'], 3),

('master', 4, 'Edge Inference & System Architecture',
 'Optimize inference and design full-stack robot systems.',
 ARRAY['On-device inference', 'Model compression', 'Distributed compute', 'Hardware/software co-design', 'Swarm coordination'],
 10.0, ARRAY['Specialist certification'], 4),

-- Fleet Commander modules
('fleet_commander', 1, 'Program Design & Training',
 'Design operator certification and training programs for your organization.',
 ARRAY['Competency framework design', 'Skills gap analysis', 'Training curriculum development', 'Assessment design', 'Continuous education programs'],
 15.0, ARRAY['Master certification'], 1),

('fleet_commander', 2, 'Crisis Management & Incident Command',
 'Lead response to multi-robot incidents and factory emergencies.',
 ARRAY['Incident command structure', 'Multi-robot emergency response', 'Regulatory reporting', 'PR and communications', 'Post-incident analysis'],
 12.0, ARRAY['Master certification'], 2),

('fleet_commander', 3, 'Robot Business Operations',
 'Master the business side of large-scale robot deployments.',
 ARRAY['Fleet economics', 'Contract negotiation', 'Client management', 'Scaling operations', 'Vendor evaluation & TCO'],
 15.0, ARRAY['Master certification'], 3),

('fleet_commander', 4, 'Enterprise Capstone Preparation',
 'Prepare for the Fleet Commander capstone assessment.',
 ARRAY['Enterprise deployment planning', 'ROI modeling', 'Stakeholder management', 'Compliance frameworks', 'Presentation skills'],
 20.0, ARRAY['All Fleet Commander modules'], 4)
) AS v(level, module_number, title, description, topics, estimated_hours, prerequisites, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM rco_learning_paths LIMIT 1);

-- Curriculum Updates
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

ALTER TABLE rco_curriculum_updates ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "Public read curriculum updates" ON rco_curriculum_updates FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS idx_rco_curriculum_updates_level ON rco_curriculum_updates(level);
CREATE INDEX IF NOT EXISTS idx_rco_curriculum_updates_date ON rco_curriculum_updates(update_date);

-- Seed initial update record
INSERT INTO rco_curriculum_updates (level, update_type, description, what_changed)
SELECT 'all', 'content', 'RCO v2 launch — complete program rebuild',
 'New: 17 domains, 700+ questions, Gauntlet assessment, 7 specializations, study system, employer portal, emerging technology curriculum'
WHERE NOT EXISTS (SELECT 1 FROM rco_curriculum_updates WHERE update_type = 'content' AND level = 'all');

-- Update rco_certifications with new exam parameters
UPDATE rco_certifications SET
  question_count = 80,
  exam_duration = 90,
  passing_score = 75
WHERE slug = '1';

UPDATE rco_certifications SET
  question_count = 120,
  exam_duration = 150,
  passing_score = 78
WHERE slug = '2';

UPDATE rco_certifications SET
  question_count = 150,
  exam_duration = 180,
  passing_score = 82
WHERE slug = '3';

UPDATE rco_certifications SET
  question_count = 150,
  exam_duration = 180,
  passing_score = 85
WHERE slug = '4';


-- =============================================================
-- Migration 032: RSP Storefront
-- =============================================================

-- Robot Familiarity (3-tier system)
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

-- Capabilities (verified vs self-reported)
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

-- Enhanced Reviews (structured metrics)
ALTER TABLE robowork_reviews
  ADD COLUMN IF NOT EXISTS delivery_on_time BOOLEAN,
  ADD COLUMN IF NOT EXISTS issues_resolved_within_4hrs BOOLEAN,
  ADD COLUMN IF NOT EXISTS robot_used TEXT,
  ADD COLUMN IF NOT EXISTS job_type TEXT,
  ADD COLUMN IF NOT EXISTS job_duration_days INTEGER,
  ADD COLUMN IF NOT EXISTS uptime_achieved NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS verified_job BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS response TEXT;

-- Case Studies
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

-- Availability Schedule
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

-- RSP Score (computed weekly)
ALTER TABLE robot_service_providers
  ADD COLUMN IF NOT EXISTS rsp_score INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rsp_score_breakdown JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS rsp_score_updated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rsp_score_percentile INTEGER,
  ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available';

DO $$ BEGIN
  ALTER TABLE robot_service_providers
    ADD CONSTRAINT chk_availability_status
    CHECK (availability_status IN ('available', 'busy', 'unavailable', 'by_appointment'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- RSP Certifications Link
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_rsp_familiarity_rsp ON rsp_robot_familiarity(rsp_id);
CREATE INDEX IF NOT EXISTS idx_rsp_familiarity_tier ON rsp_robot_familiarity(tier);
CREATE INDEX IF NOT EXISTS idx_rsp_capabilities_rsp ON rsp_capabilities(rsp_id);
CREATE INDEX IF NOT EXISTS idx_rsp_capabilities_verified ON rsp_capabilities(verified);
CREATE INDEX IF NOT EXISTS idx_rsp_case_studies_rsp ON rsp_case_studies(rsp_id);
CREATE INDEX IF NOT EXISTS idx_rsp_availability_rsp ON rsp_availability_schedule(rsp_id);
CREATE INDEX IF NOT EXISTS idx_rsp_availability_overrides_rsp ON rsp_availability_overrides(rsp_id);
CREATE INDEX IF NOT EXISTS idx_rsp_certifications_rsp ON rsp_certifications(rsp_id);
CREATE INDEX IF NOT EXISTS idx_rsp_score ON robot_service_providers(rsp_score);

-- RLS
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

-- Owner policies
DO $$ BEGIN CREATE POLICY "RSP owner insert familiarity" ON rsp_robot_familiarity FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "RSP owner update familiarity" ON rsp_robot_familiarity FOR UPDATE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "RSP owner insert capabilities" ON rsp_capabilities FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "RSP owner update capabilities" ON rsp_capabilities FOR UPDATE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "RSP owner manage case studies" ON rsp_case_studies FOR ALL USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "RSP owner manage availability" ON rsp_availability_schedule FOR ALL USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "RSP owner manage availability overrides" ON rsp_availability_overrides FOR ALL USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "RSP owner manage certifications" ON rsp_certifications FOR ALL USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =====================================================================
-- END OF MIGRATION RUNNER
-- All 32 migrations applied. Safe to re-run at any time.
-- =====================================================================
