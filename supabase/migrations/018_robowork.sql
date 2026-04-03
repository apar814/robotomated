-- RoboWork: Two-Sided Robot Service Marketplace
-- Migration 018

-- Enums
CREATE TYPE robowork_fulfillment_type AS ENUM ('with_operator', 'drop_off', 'remote_operated');
CREATE TYPE robowork_job_status AS ENUM ('draft', 'open', 'in_review', 'filled', 'completed', 'cancelled');
CREATE TYPE robowork_urgency AS ENUM ('flexible', 'within_week', 'within_month', 'asap');
CREATE TYPE robowork_bid_status AS ENUM ('pending', 'shortlisted', 'accepted', 'rejected', 'withdrawn');

-- 1. robot_service_providers
CREATE TABLE robot_service_providers (
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
CREATE TABLE rsp_robots (
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
CREATE TABLE robowork_jobs (
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
CREATE TABLE robowork_bids (
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
CREATE TABLE robowork_reviews (
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
CREATE INDEX idx_rsp_slug ON robot_service_providers(slug);
CREATE INDEX idx_rsp_verified ON robot_service_providers(verified);
CREATE INDEX idx_rsp_specializations ON robot_service_providers USING GIN(specializations);
CREATE INDEX idx_rsp_robots_rsp_id ON rsp_robots(rsp_id);
CREATE INDEX idx_rsp_robots_available ON rsp_robots(available);
CREATE INDEX idx_jobs_slug ON robowork_jobs(slug);
CREATE INDEX idx_jobs_status ON robowork_jobs(status);
CREATE INDEX idx_jobs_industry ON robowork_jobs(industry);
CREATE INDEX idx_jobs_task_type ON robowork_jobs(task_type);
CREATE INDEX idx_jobs_created ON robowork_jobs(created_at DESC);
CREATE INDEX idx_bids_job_id ON robowork_bids(job_id);
CREATE INDEX idx_bids_rsp_id ON robowork_bids(rsp_id);
CREATE INDEX idx_reviews_rsp_id ON robowork_reviews(rsp_id);

-- RLS
ALTER TABLE robot_service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsp_robots ENABLE ROW LEVEL SECURITY;
ALTER TABLE robowork_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE robowork_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE robowork_reviews ENABLE ROW LEVEL SECURITY;

-- Public read for all
CREATE POLICY "Public read RSPs" ON robot_service_providers FOR SELECT USING (true);
CREATE POLICY "Public read RSP robots" ON rsp_robots FOR SELECT USING (true);
CREATE POLICY "Public read open jobs" ON robowork_jobs FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON robowork_reviews FOR SELECT USING (true);
-- Bids: public can view bid count, but only RSP owner and job business see details
CREATE POLICY "Public read bids" ON robowork_bids FOR SELECT USING (true);

-- Auth write
CREATE POLICY "Auth insert RSPs" ON robot_service_providers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Owner update RSPs" ON robot_service_providers FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Auth insert RSP robots" ON rsp_robots FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth update RSP robots" ON rsp_robots FOR UPDATE USING (true);
CREATE POLICY "Anyone can post jobs" ON robowork_jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth update jobs" ON robowork_jobs FOR UPDATE USING (true);
CREATE POLICY "Auth insert bids" ON robowork_bids FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth update bids" ON robowork_bids FOR UPDATE USING (true);
CREATE POLICY "Auth insert reviews" ON robowork_reviews FOR INSERT WITH CHECK (true);
