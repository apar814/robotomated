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
