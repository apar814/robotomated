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
-- Manufacturer Connect Program
-- Migration 019: Partnership fields + claim/inquiry tables

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

CREATE POLICY "Public insert claims" ON manufacturer_claims FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read claims" ON manufacturer_claims FOR SELECT USING (true);
CREATE POLICY "Public insert partnerships" ON manufacturer_partnerships FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read partnerships" ON manufacturer_partnerships FOR SELECT USING (true);
CREATE POLICY "Public insert contact clicks" ON manufacturer_contact_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read contact clicks" ON manufacturer_contact_clicks FOR SELECT USING (true);
-- Leasing Marketplace
-- Migration 020

-- Lease inquiries
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

-- Lease transfers
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

-- Robot time-shares
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

-- Time-share bookings
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

CREATE POLICY "Public insert lease inquiries" ON lease_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read lease inquiries" ON lease_inquiries FOR SELECT USING (true);
CREATE POLICY "Public read lease transfers" ON lease_transfers FOR SELECT USING (true);
CREATE POLICY "Public insert lease transfers" ON lease_transfers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read time shares" ON robot_time_shares FOR SELECT USING (true);
CREATE POLICY "Public insert time shares" ON robot_time_shares FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert bookings" ON time_share_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read bookings" ON time_share_bookings FOR SELECT USING (true);
-- RCO Certification Program
-- Migration 021

-- Certifications catalog
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

-- Exam questions
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

-- Exam sessions
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

-- Credentials
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

-- Payments
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

CREATE POLICY "Public read certifications" ON rco_certifications FOR SELECT USING (true);
CREATE POLICY "Admin read questions" ON rco_questions FOR SELECT USING (true);
CREATE POLICY "Auth insert sessions" ON rco_exam_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read own sessions" ON rco_exam_sessions FOR SELECT USING (true);
CREATE POLICY "Auth update own sessions" ON rco_exam_sessions FOR UPDATE USING (true);
CREATE POLICY "Public read credentials" ON rco_credentials FOR SELECT USING (true);
CREATE POLICY "Auth insert credentials" ON rco_credentials FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth insert payments" ON rco_payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read payments" ON rco_payments FOR SELECT USING (true);
-- Post-Purchase Lifecycle
-- Migration 022

-- Service requests
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

-- Parts marketplace
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

-- Trade-in valuations
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

-- Certified Pre-Owned listings
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

-- Insurance inquiries
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

CREATE POLICY "Public insert service requests" ON service_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read service requests" ON service_requests FOR SELECT USING (true);
CREATE POLICY "Public read parts" ON parts_listings FOR SELECT USING (true);
CREATE POLICY "Public insert parts" ON parts_listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert trade-ins" ON trade_in_valuations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read trade-ins" ON trade_in_valuations FOR SELECT USING (true);
CREATE POLICY "Public read CPO" ON cpo_listings FOR SELECT USING (true);
CREATE POLICY "Public insert CPO" ON cpo_listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert insurance" ON robot_insurance_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read insurance" ON robot_insurance_inquiries FOR SELECT USING (true);
-- RSP Dashboard: Fleet status, maintenance logs, invoices
-- Migration 023

-- Fleet status tracking
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

-- Maintenance logs for RSP robots
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

-- RSP invoices
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

CREATE POLICY "RSP read fleet status" ON rsp_fleet_status FOR SELECT USING (true);
CREATE POLICY "RSP insert fleet status" ON rsp_fleet_status FOR INSERT WITH CHECK (true);
CREATE POLICY "RSP update fleet status" ON rsp_fleet_status FOR UPDATE USING (true);
CREATE POLICY "RSP read maint logs" ON rsp_maintenance_logs FOR SELECT USING (true);
CREATE POLICY "RSP insert maint logs" ON rsp_maintenance_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "RSP read invoices" ON rsp_invoices FOR SELECT USING (true);
CREATE POLICY "RSP insert invoices" ON rsp_invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "RSP update invoices" ON rsp_invoices FOR UPDATE USING (true);
