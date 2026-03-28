-- 012: Buyer Intelligence Fields
-- Adds TCO, vendor health, compliance, deployment, and training data to robots table

ALTER TABLE robots ADD COLUMN IF NOT EXISTS maintenance_annual_pct DECIMAL;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS maintenance_annual_cost_low INT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS maintenance_annual_cost_high INT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS warranty_months INT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS warranty_coverage TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS support_model TEXT CHECK (support_model IN ('on-site', 'remote', 'partner', 'none'));
ALTER TABLE robots ADD COLUMN IF NOT EXISTS support_response_hours INT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS spare_parts_availability TEXT CHECK (spare_parts_availability IN ('stocked', 'order', 'custom', 'proprietary'));
ALTER TABLE robots ADD COLUMN IF NOT EXISTS deployment_weeks_min INT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS deployment_weeks_max INT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS floor_space_sqft INT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS power_requirements TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS network_requirements TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS wms_integrations TEXT[];
ALTER TABLE robots ADD COLUMN IF NOT EXISTS erp_integrations TEXT[];
ALTER TABLE robots ADD COLUMN IF NOT EXISTS api_available BOOLEAN DEFAULT false;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS operator_training_hours INT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS safety_certifications TEXT[];
ALTER TABLE robots ADD COLUMN IF NOT EXISTS industry_certifications TEXT[];
ALTER TABLE robots ADD COLUMN IF NOT EXISTS vendor_funding_total TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS vendor_employees_range TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS vendor_health_score INT CHECK (vendor_health_score BETWEEN 1 AND 10);
