-- Migration 014: Market Reports table
CREATE TABLE IF NOT EXISTS market_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  source_url TEXT,
  report_date DATE,
  category TEXT,
  market_size_usd_billions DECIMAL,
  cagr_percent DECIMAL,
  forecast_year INT,
  key_findings TEXT[],
  raw_excerpt TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE market_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public read market_reports" ON market_reports FOR SELECT USING (true);

-- Add enhanced fields to funding_rounds
ALTER TABLE funding_rounds ADD COLUMN IF NOT EXISTS company_description TEXT;
ALTER TABLE funding_rounds ADD COLUMN IF NOT EXISTS total_raised_to_date TEXT;
ALTER TABLE funding_rounds ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE funding_rounds ADD COLUMN IF NOT EXISTS robot_id UUID REFERENCES robots(id);
ALTER TABLE funding_rounds ADD COLUMN IF NOT EXISTS co_investors TEXT[];
ALTER TABLE funding_rounds ADD COLUMN IF NOT EXISTS lead_investor TEXT;
