-- Intelligence pipeline: upgrade news_items → intelligence_items

-- Add missing columns to news_items (rename conceptually to intelligence_items)
ALTER TABLE news_items ADD COLUMN IF NOT EXISTS what_it_means TEXT;
ALTER TABLE news_items ADD COLUMN IF NOT EXISTS full_content TEXT;
ALTER TABLE news_items ADD COLUMN IF NOT EXISTS sentiment TEXT DEFAULT 'neutral';
ALTER TABLE news_items ADD COLUMN IF NOT EXISTS relevance_score INTEGER DEFAULT 50;
ALTER TABLE news_items ADD COLUMN IF NOT EXISTS robots_mentioned TEXT[] DEFAULT '{}';
ALTER TABLE news_items ADD COLUMN IF NOT EXISTS manufacturers_mentioned TEXT[] DEFAULT '{}';
ALTER TABLE news_items ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE news_items ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE news_items ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ;

-- Rename source → source_name for clarity (if not already done)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='news_items' AND column_name='source') THEN
    ALTER TABLE news_items RENAME COLUMN source TO source_name;
  END IF;
END $$;

-- Add indexes for intelligence queries
CREATE INDEX IF NOT EXISTS idx_news_relevance ON news_items(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news_items(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_news_sentiment ON news_items(sentiment);
CREATE INDEX IF NOT EXISTS idx_news_tags ON news_items USING gin(tags);

-- Upgrade funding_rounds table
ALTER TABLE funding_rounds ADD COLUMN IF NOT EXISTS company_slug TEXT;
ALTER TABLE funding_rounds ADD COLUMN IF NOT EXISTS amount_usd BIGINT;
ALTER TABLE funding_rounds ADD COLUMN IF NOT EXISTS round_type TEXT;
ALTER TABLE funding_rounds ADD COLUMN IF NOT EXISTS investors_list TEXT[] DEFAULT '{}';
ALTER TABLE funding_rounds ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE funding_rounds ADD COLUMN IF NOT EXISTS what_it_means TEXT;
ALTER TABLE funding_rounds ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'funding';
ALTER TABLE funding_rounds ADD COLUMN IF NOT EXISTS announced_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_funding_amount ON funding_rounds(amount_usd DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_funding_company_slug ON funding_rounds(company_slug);
