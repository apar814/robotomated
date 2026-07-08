-- News ingestion v2: Inngest pipeline (Firecrawl + Reddit sources)
-- Dedupe by normalized-URL hash — catches utm-param / trailing-slash / http-vs-https
-- duplicates that the raw url UNIQUE constraint misses.
-- Legacy rows keep url_hash NULL (multiple NULLs never conflict on a unique index);
-- no category backfill — legacy taxonomy rows are left as-is by decision.

ALTER TABLE news_items ADD COLUMN IF NOT EXISTS url_hash TEXT;
ALTER TABLE news_items ADD COLUMN IF NOT EXISTS ingested_by TEXT DEFAULT 'rss-v1';

CREATE UNIQUE INDEX IF NOT EXISTS idx_news_items_url_hash ON news_items(url_hash);
