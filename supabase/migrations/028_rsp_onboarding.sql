-- 028_rsp_onboarding.sql
-- Extend RSP profiles for 7-step onboarding + founding RSP program

-- New columns on robot_service_providers
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

-- Founding RSP applications
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

-- RLS for founding_rsp_applications
ALTER TABLE founding_rsp_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can apply" ON founding_rsp_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own applications" ON founding_rsp_applications
  FOR SELECT USING (
    auth.uid() = user_id
    OR auth.jwt() ->> 'email' = email
  );

-- Index for founding RSP counter query
CREATE INDEX IF NOT EXISTS idx_founding_rsp_status ON founding_rsp_applications(status);
CREATE INDEX IF NOT EXISTS idx_rsp_founding ON robot_service_providers(is_founding_rsp) WHERE is_founding_rsp = true;
