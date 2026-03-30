-- Careers interest / waitlist signups
CREATE TABLE careers_interest (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           TEXT NOT NULL,
  type            TEXT NOT NULL CHECK (type IN ('worker', 'employer', 'manufacturer')),
  role_interest   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(email, type)
);

CREATE INDEX idx_careers_interest_type ON careers_interest(type);
CREATE INDEX idx_careers_interest_created ON careers_interest(created_at DESC);

ALTER TABLE careers_interest ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (signup form)
CREATE POLICY "Anyone can submit career interest"
  ON careers_interest FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Service role manages everything
CREATE POLICY "Service role manages career interest"
  ON careers_interest FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
