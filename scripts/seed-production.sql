-- ============================================================================
-- Robotomated Production Seed Data
-- Run AFTER migrations 018-023 have been applied
-- ============================================================================

-- ── RCO Certifications (4 levels) ──
INSERT INTO rco_certifications (slug, name, level, description, exam_duration, question_count, passing_score, price, renewal_years, renewal_price, skills, industries, active)
VALUES
  ('rco-foundation', 'RCO Foundation', 1,
   'Build your foundation in robotics operations. General robotics safety, terminology, basic operation principles, and industry standards.',
   60, 50, 75, 149.00, 2, 99.00,
   ARRAY['Robot safety fundamentals', 'Basic operation procedures', 'Industry terminology', 'Emergency protocols', 'Workplace integration'],
   ARRAY['All industries'],
   true),
  ('rco-specialist', 'RCO Specialist', 2,
   'Specialize in your robot category. Deep knowledge in AMR, Cobot, Industrial, Drone, Medical, Agricultural, or Humanoid robotics.',
   90, 100, 75, 299.00, 2, 149.00,
   ARRAY['Category-specific operations', 'Advanced troubleshooting', 'Performance optimization', 'Maintenance planning', 'Integration procedures'],
   ARRAY['Warehouse', 'Manufacturing', 'Healthcare', 'Agriculture', 'Construction', 'Security'],
   true),
  ('rco-master', 'RCO Master', 3,
   'Lead deployments and manage fleets. Fleet management, advanced safety, multi-robot coordination, and ROI optimization.',
   120, 150, 80, 499.00, 2, 199.00,
   ARRAY['Fleet management', 'Multi-robot coordination', 'Advanced safety protocols', 'ROI optimization', 'Deployment planning', 'Team leadership'],
   ARRAY['Enterprise', 'Logistics', 'Manufacturing', 'Healthcare'],
   true),
  ('rco-fleet-commander', 'RCO Fleet Commander', 4,
   'The pinnacle of robotics operations. Enterprise fleet operations, workforce integration, automation strategy, and executive reporting.',
   150, 150, 80, 799.00, 2, 249.00,
   ARRAY['Enterprise fleet operations', 'Automation strategy', 'Executive reporting', 'Workforce integration', 'Vendor management', 'Budget planning', 'Risk assessment'],
   ARRAY['Enterprise', 'Fortune 500', 'Multi-site operations'],
   true)
ON CONFLICT (slug) DO NOTHING;

-- ── Sample Job Postings (5 jobs) ──
INSERT INTO robowork_jobs (slug, business_name, business_email, title, description, task_type, industry, city, state, budget_min, budget_max, duration_days, fulfillment_type, urgency, status)
VALUES
  ('warehouse-pallet-moving-chicago-dc', 'Midwest Distribution Co', 'ops@midwest-dist.example.com',
   'Warehouse Pallet Moving — Chicago DC',
   'Large distribution center needs AMR solution for pallet moving between receiving and storage. 50,000 sq ft facility. Operating 6am-6pm Monday-Friday. Need reliable solution that can handle standard pallet sizes and integrate with our existing WMS.',
   'picking', 'Warehouse & Logistics', 'Chicago', 'IL',
   8000, 12000, 14, 'with_operator', 'within_week', 'open'),

  ('hospital-floor-cleaning-la', 'LA Medical Center', 'facilities@lamedical.example.com',
   'Hospital Floor Cleaning — LA Medical',
   'Medical facility needs autonomous floor cleaning robot for daily operations. 3 floors, approximately 80,000 sq ft total. Must operate during off-peak hours (10pm-6am). HEPA filtration required. Must comply with healthcare facility standards.',
   'cleaning', 'Healthcare', 'Los Angeles', 'CA',
   3500, 5000, 30, 'drop_off', 'within_month', 'open'),

  ('agricultural-harvest-assist-fresno', 'Valley Fresh Farms', 'ops@valleyfresh.example.com',
   'Agricultural Harvest Assist — Fresno',
   'Mid-size farm operation seeking robotic harvest assist for stone fruit season. 200 acres. Need solution that can work alongside human pickers and handle delicate produce. Previous experience with agricultural robotics preferred.',
   'agriculture', 'Agriculture', 'Fresno', 'CA',
   15000, 20000, 21, 'with_operator', 'within_week', 'open'),

  ('security-patrol-dallas-office', 'Lone Star Properties', 'security@lonestar-prop.example.com',
   'Security Patrol — Dallas Office Park',
   'Office park with 5 buildings needs autonomous security patrol robot for after-hours monitoring. Must integrate with existing camera system. GPS tracking and real-time alerts required. 24/7 operation.',
   'security', 'Security', 'Dallas', 'TX',
   2000, 3500, 60, 'drop_off', 'flexible', 'open'),

  ('manufacturing-qc-inspection-detroit', 'Motor City Assembly', 'quality@motorcity-assembly.example.com',
   'Manufacturing QC Inspection — Detroit',
   'Automotive parts manufacturer needs robot-assisted quality control inspection for production line. Must detect surface defects, measure tolerances, and generate compliance reports. High-speed line, 200 parts/hour.',
   'inspection', 'Manufacturing', 'Detroit', 'MI',
   5000, 8000, 7, 'with_operator', 'asap', 'open')
ON CONFLICT (slug) DO NOTHING;

-- ── Sample RSP Profiles (3 providers) ──
INSERT INTO robot_service_providers (slug, company_name, description, bio, city, state, country, service_radius, verified, rating, total_jobs, completed_jobs, insurance_verified, background_checked, specializations, fulfillment_types)
VALUES
  ('automatenow-solutions', 'AutomateNow Solutions',
   'Chicago''s leading robot service provider. Fleet of 12 AMRs and 4 cobots. Serving warehouse and manufacturing clients since 2021.',
   'Founded by former Amazon Robotics engineers, AutomateNow Solutions brings enterprise-grade robotic automation to Midwest businesses. We specialize in warehouse material handling and manufacturing assembly assistance with a 99.2% uptime guarantee.',
   'Chicago', 'IL', 'US', 150, true, 4.8, 47, 42, true, true,
   ARRAY['warehouse', 'manufacturing'],
   ARRAY['with_operator', 'drop_off']),

  ('pacific-robot-services', 'Pacific Robot Services',
   'Southern California''s trusted robot service partner for healthcare and hospitality sectors.',
   'Pacific Robot Services is a women-owned small business providing robotic solutions to hospitals, hotels, and retail locations across Southern California. Our fleet includes cleaning robots, delivery robots, and telepresence systems.',
   'Los Angeles', 'CA', 'US', 100, true, 4.6, 23, 19, true, true,
   ARRAY['healthcare', 'hospitality'],
   ARRAY['drop_off', 'remote_operated']),

  ('southern-automation-group', 'Southern Automation Group',
   'Texas-based fleet operator specializing in security and warehouse automation. 24/7 emergency deployment available.',
   'Southern Automation Group operates the largest independent robot fleet in Texas. We serve enterprise clients in security, logistics, and construction with rapid deployment capabilities and dedicated account management.',
   'Dallas', 'TX', 'US', 200, true, 4.9, 31, 28, true, true,
   ARRAY['security', 'warehouse', 'construction'],
   ARRAY['with_operator', 'remote_operated'])
ON CONFLICT (slug) DO NOTHING;
