-- Revenue tracking for manual affiliate commission logging
CREATE TABLE revenue_entries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month       TEXT NOT NULL,
  source      TEXT NOT NULL,
  amount      DECIMAL(12,2) NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_revenue_month ON revenue_entries(month DESC);

ALTER TABLE revenue_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages revenue"
  ON revenue_entries FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
