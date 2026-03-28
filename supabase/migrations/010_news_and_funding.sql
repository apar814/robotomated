-- News items for automated news aggregation
CREATE TABLE IF NOT EXISTS news_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  url         TEXT NOT NULL UNIQUE,
  source      TEXT NOT NULL,
  summary     TEXT,
  category    TEXT,
  image_url   TEXT,
  published_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_items_published ON news_items(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_items_category ON news_items(category);

ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "News items are publicly readable" ON news_items FOR SELECT USING (true);
CREATE POLICY "Service role manages news" ON news_items FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Funding rounds tracker
CREATE TABLE IF NOT EXISTS funding_rounds (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company     TEXT NOT NULL,
  amount      TEXT,
  round       TEXT,
  date        DATE,
  investors   TEXT,
  source_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_funding_date ON funding_rounds(date DESC);

ALTER TABLE funding_rounds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Funding rounds are publicly readable" ON funding_rounds FOR SELECT USING (true);
CREATE POLICY "Service role manages funding" ON funding_rounds FOR ALL TO service_role USING (true) WITH CHECK (true);
