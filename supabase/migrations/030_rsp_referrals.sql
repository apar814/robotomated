-- RSP referral program
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
CREATE POLICY "RSPs can view own referrals" ON rsp_referrals
  FOR SELECT USING (referrer_id IN (SELECT id FROM robot_service_providers WHERE user_id = auth.uid()));
