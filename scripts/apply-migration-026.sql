-- Apply migration 026: Humanoid Robot Fields + Safety Standards
-- Paste this into Supabase Dashboard → SQL Editor → Run

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
CREATE POLICY IF NOT EXISTS "Public read raas" ON raas_pricing FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public insert raas" ON raas_pricing FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Public read standards" ON safety_standards FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public read certs" ON robot_certifications FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Admin insert certs" ON robot_certifications FOR INSERT WITH CHECK (true);

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
