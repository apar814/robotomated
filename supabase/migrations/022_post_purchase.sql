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
