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
