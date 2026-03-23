-- Affiliate click tracking
CREATE TABLE affiliate_clicks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  robot_id    UUID NOT NULL REFERENCES robots(id) ON DELETE CASCADE,
  retailer    TEXT NOT NULL,
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id  TEXT,
  referrer    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_affiliate_clicks_robot ON affiliate_clicks(robot_id);
CREATE INDEX idx_affiliate_clicks_retailer ON affiliate_clicks(retailer);
CREATE INDEX idx_affiliate_clicks_date ON affiliate_clicks(created_at DESC);

ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Service role only — no public read/write
CREATE POLICY "Service role can manage affiliate clicks"
  ON affiliate_clicks FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Price drop alerts
CREATE TABLE price_alerts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  robot_id    UUID NOT NULL REFERENCES robots(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  target_price DECIMAL(12,2) NOT NULL,
  active      BOOLEAN NOT NULL DEFAULT true,
  triggered_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(robot_id, email)
);

CREATE INDEX idx_price_alerts_robot ON price_alerts(robot_id);
CREATE INDEX idx_price_alerts_active ON price_alerts(active) WHERE active = true;

ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create price alerts"
  ON price_alerts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Service role can manage price alerts"
  ON price_alerts FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
