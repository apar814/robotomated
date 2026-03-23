-- Buyer-focused fields on robots table
ALTER TABLE robots ADD COLUMN IF NOT EXISTS price_lease_monthly integer;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS price_type text DEFAULT 'purchase';
ALTER TABLE robots ADD COLUMN IF NOT EXISTS financing_available boolean DEFAULT false;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS financing_notes text;

-- Power & operational fields
ALTER TABLE robots ADD COLUMN IF NOT EXISTS power_source text;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS battery_capacity_wh integer;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS battery_runtime_hrs numeric(4,1);
ALTER TABLE robots ADD COLUMN IF NOT EXISTS charge_time_hrs numeric(4,1);
ALTER TABLE robots ADD COLUMN IF NOT EXISTS hot_swap_battery boolean DEFAULT false;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS power_consumption_watts integer;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS operating_voltage text;

-- Total cost of ownership fields
ALTER TABLE robots ADD COLUMN IF NOT EXISTS annual_maintenance_cost integer;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS warranty_years integer DEFAULT 1;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS expected_lifespan_years integer;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS training_required text;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS training_cost integer;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS integration_cost_estimate integer;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS spare_parts_availability text;

-- Application & ROI fields
ALTER TABLE robots ADD COLUMN IF NOT EXISTS typical_roi_months integer;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS labor_replaced_fte numeric(3,1);
ALTER TABLE robots ADD COLUMN IF NOT EXISTS throughput_description text;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS operating_environment text;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS temperature_range text;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS noise_level_db integer;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS certifications text[];
ALTER TABLE robots ADD COLUMN IF NOT EXISTS safety_features text[];

-- Applications table
CREATE TABLE IF NOT EXISTS robot_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  robot_id uuid REFERENCES robots(id) ON DELETE CASCADE,
  application_name text NOT NULL,
  industry text NOT NULL,
  task_description text,
  time_savings_percent integer,
  cost_savings_percent integer,
  labor_savings_description text,
  cycle_time_seconds integer,
  accuracy_percent numeric(5,2),
  deployment_time_days integer,
  difficulty text DEFAULT 'medium',
  real_world_example text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_robot_applications_robot ON robot_applications(robot_id);
CREATE INDEX IF NOT EXISTS idx_robot_applications_industry ON robot_applications(industry);

ALTER TABLE robot_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Applications are publicly readable"
  ON robot_applications FOR SELECT USING (true);

CREATE POLICY "Service role manages applications"
  ON robot_applications FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Financing options table
CREATE TABLE IF NOT EXISTS financing_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  robot_id uuid REFERENCES robots(id) ON DELETE CASCADE,
  provider text NOT NULL,
  type text NOT NULL,
  monthly_payment integer,
  term_months integer,
  down_payment_percent integer DEFAULT 0,
  includes_maintenance boolean DEFAULT false,
  includes_support boolean DEFAULT false,
  notes text,
  url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE financing_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Financing options are publicly readable"
  ON financing_options FOR SELECT USING (true);

CREATE POLICY "Service role manages financing"
  ON financing_options FOR ALL TO service_role
  USING (true) WITH CHECK (true);
