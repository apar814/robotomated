-- RSP Dashboard: Fleet status, maintenance logs, invoices
-- Migration 023

-- Fleet status tracking
CREATE TABLE IF NOT EXISTS rsp_fleet_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rsp_id UUID NOT NULL REFERENCES robot_service_providers(id) ON DELETE CASCADE,
  rsp_robot_id UUID NOT NULL REFERENCES rsp_robots(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'idle' CHECK (status IN ('operational','maintenance','deployed','idle')),
  current_job_id UUID REFERENCES robowork_jobs(id) ON DELETE SET NULL,
  current_client_name TEXT,
  location TEXT,
  battery_level INTEGER,
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  hours_logged NUMERIC(10,1) DEFAULT 0,
  alert_flags TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Maintenance logs for RSP robots
CREATE TABLE IF NOT EXISTS rsp_maintenance_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rsp_id UUID NOT NULL REFERENCES robot_service_providers(id) ON DELETE CASCADE,
  rsp_robot_id UUID NOT NULL REFERENCES rsp_robots(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'scheduled' CHECK (type IN ('scheduled','emergency','preventive')),
  description TEXT,
  technician_name TEXT,
  parts_replaced TEXT[] DEFAULT '{}',
  parts_cost NUMERIC(10,2) DEFAULT 0,
  labor_hours NUMERIC(6,1) DEFAULT 0,
  total_cost NUMERIC(10,2) DEFAULT 0,
  completed_at TIMESTAMPTZ,
  next_service_due DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RSP invoices
CREATE TABLE IF NOT EXISTS rsp_invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rsp_id UUID NOT NULL REFERENCES robot_service_providers(id) ON DELETE CASCADE,
  job_id UUID REFERENCES robowork_jobs(id) ON DELETE SET NULL,
  client_email TEXT NOT NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','paid','overdue','cancelled')),
  line_items JSONB DEFAULT '[]',
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'usd',
  due_date DATE,
  paid_at TIMESTAMPTZ,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fleet_status_rsp ON rsp_fleet_status(rsp_id);
CREATE INDEX IF NOT EXISTS idx_fleet_status_robot ON rsp_fleet_status(rsp_robot_id);
CREATE INDEX IF NOT EXISTS idx_rsp_maint_rsp ON rsp_maintenance_logs(rsp_id);
CREATE INDEX IF NOT EXISTS idx_rsp_maint_robot ON rsp_maintenance_logs(rsp_robot_id);
CREATE INDEX IF NOT EXISTS idx_rsp_invoices_rsp ON rsp_invoices(rsp_id);
CREATE INDEX IF NOT EXISTS idx_rsp_invoices_status ON rsp_invoices(status);

-- RLS
ALTER TABLE rsp_fleet_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsp_maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsp_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "RSP read fleet status" ON rsp_fleet_status FOR SELECT USING (true);
CREATE POLICY "RSP insert fleet status" ON rsp_fleet_status FOR INSERT WITH CHECK (true);
CREATE POLICY "RSP update fleet status" ON rsp_fleet_status FOR UPDATE USING (true);
CREATE POLICY "RSP read maint logs" ON rsp_maintenance_logs FOR SELECT USING (true);
CREATE POLICY "RSP insert maint logs" ON rsp_maintenance_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "RSP read invoices" ON rsp_invoices FOR SELECT USING (true);
CREATE POLICY "RSP insert invoices" ON rsp_invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "RSP update invoices" ON rsp_invoices FOR UPDATE USING (true);
