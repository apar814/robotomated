-- Manufacturer portal submissions
CREATE TABLE manufacturer_submissions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name    TEXT NOT NULL,
  contact_email   TEXT NOT NULL,
  robot_name      TEXT NOT NULL,
  model_number    TEXT,
  product_url     TEXT,
  specs           JSONB DEFAULT '{}',
  notes           TEXT,
  status          TEXT NOT NULL DEFAULT 'pending',
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_submissions_status ON manufacturer_submissions(status);
CREATE INDEX idx_submissions_date ON manufacturer_submissions(created_at DESC);

ALTER TABLE manufacturer_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit"
  ON manufacturer_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Service role manages submissions"
  ON manufacturer_submissions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
