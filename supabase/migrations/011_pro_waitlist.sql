-- Pro tier waitlist
CREATE TABLE IF NOT EXISTS pro_waitlist (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email      TEXT NOT NULL UNIQUE,
  position   SERIAL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pro_waitlist_position ON pro_waitlist(position);

ALTER TABLE pro_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join pro waitlist"
  ON pro_waitlist FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Service role manages pro waitlist"
  ON pro_waitlist FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
