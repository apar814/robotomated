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
