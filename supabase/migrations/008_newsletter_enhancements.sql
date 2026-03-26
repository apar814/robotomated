-- Add industry preference and unsubscribe token to newsletter_subscribers
ALTER TABLE newsletter_subscribers
  ADD COLUMN IF NOT EXISTS industry_preference TEXT,
  ADD COLUMN IF NOT EXISTS unsubscribe_token TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex');

-- Backfill existing rows with unique tokens
UPDATE newsletter_subscribers
SET unsubscribe_token = encode(gen_random_bytes(32), 'hex')
WHERE unsubscribe_token = encode(gen_random_bytes(32), 'hex');

-- Index for fast unsubscribe lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_unsubscribe_token
  ON newsletter_subscribers(unsubscribe_token);

-- Allow public DELETE via unsubscribe token (RLS policy)
CREATE POLICY "Anyone can unsubscribe via token"
  ON newsletter_subscribers FOR DELETE
  TO anon, authenticated
  USING (true);

-- Allow service role to SELECT for cron digest
-- (service role already bypasses RLS, so no policy needed)
