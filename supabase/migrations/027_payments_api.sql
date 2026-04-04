-- Payments, API Keys, and Transaction Infrastructure
-- Migration 027

-- Platform payments
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

-- Fee schedule
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

-- Seller accounts (Stripe Connect)
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

-- API keys
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

-- API usage tracking
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  response_time_ms INTEGER,
  status_code INTEGER,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enterprise accounts
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

-- Enterprise RFQ
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

-- Disputes
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

CREATE POLICY "Users read own payments" ON payments FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());
CREATE POLICY "Admin read all payments" ON payments FOR SELECT USING (true);
CREATE POLICY "Public read fee schedule" ON platform_fee_schedule FOR SELECT USING (true);
CREATE POLICY "Users read own seller" ON seller_accounts FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users manage own keys" ON api_keys FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admin read usage" ON api_usage FOR SELECT USING (true);
CREATE POLICY "Public read enterprise" ON enterprise_accounts FOR SELECT USING (true);
CREATE POLICY "Public read rfq" ON enterprise_rfq FOR SELECT USING (true);
CREATE POLICY "Public insert disputes" ON disputes FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read disputes" ON disputes FOR SELECT USING (true);

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
