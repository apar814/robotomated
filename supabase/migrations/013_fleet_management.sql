-- 013: Fleet Management Foundation
-- Tables for tracking owned robot assets, maintenance logs, and schedules
-- Behind Pro auth gate — data model for Operations tier

-- Robot Assets (user's owned robots)
CREATE TABLE IF NOT EXISTS robot_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  robot_id UUID REFERENCES robots(id),
  custom_name TEXT,
  serial_number TEXT,
  purchase_date DATE,
  purchase_price INT,
  site_location TEXT,
  department TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'offline', 'decommissioned')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Maintenance Logs
CREATE TABLE IF NOT EXISTS maintenance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES robot_assets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  log_date DATE NOT NULL,
  maintenance_type TEXT NOT NULL CHECK (maintenance_type IN ('routine', 'repair', 'emergency', 'upgrade')),
  description TEXT,
  technician TEXT,
  cost INT,
  downtime_hours DECIMAL,
  parts_replaced TEXT[],
  next_service_date DATE,
  documents TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Maintenance Schedules
CREATE TABLE IF NOT EXISTS maintenance_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES robot_assets(id) ON DELETE CASCADE,
  schedule_name TEXT NOT NULL,
  interval_type TEXT NOT NULL CHECK (interval_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'annual', 'hours-based')),
  interval_value INT NOT NULL DEFAULT 1,
  task_description TEXT,
  estimated_hours DECIMAL,
  estimated_cost INT,
  requires_professional BOOLEAN DEFAULT false,
  last_completed DATE,
  next_due DATE,
  alert_days_before INT DEFAULT 7,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE robot_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own assets" ON robot_assets
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own maintenance logs" ON maintenance_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage schedules for own assets" ON maintenance_schedules
  FOR ALL USING (
    asset_id IN (SELECT id FROM robot_assets WHERE user_id = auth.uid())
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_robot_assets_user ON robot_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_robot_assets_status ON robot_assets(status);
CREATE INDEX IF NOT EXISTS idx_robot_assets_robot ON robot_assets(robot_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_asset ON maintenance_logs(asset_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_date ON maintenance_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_type ON maintenance_logs(maintenance_type);
CREATE INDEX IF NOT EXISTS idx_maintenance_schedules_asset ON maintenance_schedules(asset_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_schedules_next_due ON maintenance_schedules(next_due);
CREATE INDEX IF NOT EXISTS idx_maintenance_schedules_active ON maintenance_schedules(is_active);
