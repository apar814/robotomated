-- RCO v2: World-class certification program upgrade
-- Migration 031 — keeps existing tables, adds new structure

-- ══════════════════════════════════════════════
-- DOMAINS
-- ══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS rco_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  weight_percent INTEGER,
  level_required TEXT NOT NULL,
  sort_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════════
-- QUESTIONS v2 (multi-type, domain-linked)
-- ══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS rco_questions_v2 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain_id UUID REFERENCES rco_domains(id) ON DELETE SET NULL,
  level TEXT NOT NULL,
  specialization TEXT,
  question_type TEXT NOT NULL CHECK (
    question_type IN (
      'multiple_choice',
      'multi_select',
      'scenario',
      'fault_diagnosis',
      'code_review',
      'calculation',
      'sequencing',
      'true_false_justify'
    )
  ),
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),
  question_text TEXT NOT NULL,
  scenario_context TEXT,
  code_snippet TEXT,
  diagram_description TEXT,
  options JSONB NOT NULL DEFAULT '[]',
  correct_answers TEXT[] NOT NULL,
  explanation TEXT NOT NULL,
  real_world_context TEXT,
  time_limit_seconds INTEGER,
  points INTEGER DEFAULT 1,
  tags TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════════
-- PRACTICAL ASSESSMENTS (Gauntlet rounds etc.)
-- ══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS rco_practical_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  scenario TEXT NOT NULL,
  robot_type TEXT,
  environment TEXT,
  time_limit_minutes INTEGER,
  evaluation_criteria JSONB DEFAULT '[]',
  pass_requirements TEXT,
  assessor_notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════════
-- LEARNING PATHS (study modules)
-- ══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS rco_learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level TEXT NOT NULL,
  module_number INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  topics TEXT[] DEFAULT '{}',
  estimated_hours NUMERIC(4,1),
  prerequisites TEXT[] DEFAULT '{}',
  resources JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════════
-- STUDY PROGRESS (per user per module)
-- ══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS rco_study_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  learning_path_id UUID REFERENCES rco_learning_paths(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  quiz_score NUMERIC(5,2),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, learning_path_id)
);

-- ══════════════════════════════════════════════
-- PRACTICE SESSION TRACKING
-- ══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS rco_practice_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  level TEXT NOT NULL,
  domain_code TEXT,
  mode TEXT DEFAULT 'study' CHECK (mode IN ('study', 'test')),
  questions_attempted INTEGER DEFAULT 0,
  questions_correct INTEGER DEFAULT 0,
  domain_scores JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- ══════════════════════════════════════════════
-- EMPLOYER TEAMS
-- ══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS rco_employer_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  seats_purchased INTEGER DEFAULT 0,
  seats_used INTEGER DEFAULT 0,
  stripe_subscription_id TEXT,
  plan_type TEXT DEFAULT 'standard' CHECK (plan_type IN ('standard', 'enterprise')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rco_employer_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES rco_employer_teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  invited_at TIMESTAMPTZ DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  certification_level INTEGER,
  status TEXT DEFAULT 'invited' CHECK (status IN ('invited', 'active', 'completed', 'expired')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════════
-- INDEXES
-- ══════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_rco_domains_code ON rco_domains(code);
CREATE INDEX IF NOT EXISTS idx_rco_domains_level ON rco_domains(level_required);
CREATE INDEX IF NOT EXISTS idx_rco_qv2_domain ON rco_questions_v2(domain_id);
CREATE INDEX IF NOT EXISTS idx_rco_qv2_level ON rco_questions_v2(level);
CREATE INDEX IF NOT EXISTS idx_rco_qv2_type ON rco_questions_v2(question_type);
CREATE INDEX IF NOT EXISTS idx_rco_qv2_difficulty ON rco_questions_v2(difficulty);
CREATE INDEX IF NOT EXISTS idx_rco_qv2_spec ON rco_questions_v2(specialization);
CREATE INDEX IF NOT EXISTS idx_rco_practical_level ON rco_practical_assessments(level);
CREATE INDEX IF NOT EXISTS idx_rco_learning_level ON rco_learning_paths(level);
CREATE INDEX IF NOT EXISTS idx_rco_study_user ON rco_study_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_rco_practice_user ON rco_practice_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_rco_employer_members_team ON rco_employer_members(team_id);

-- ══════════════════════════════════════════════
-- RLS
-- ══════════════════════════════════════════════

ALTER TABLE rco_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_questions_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_practical_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_study_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_employer_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE rco_employer_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read domains" ON rco_domains FOR SELECT USING (true);
CREATE POLICY "Public read questions v2" ON rco_questions_v2 FOR SELECT USING (true);
CREATE POLICY "Public read practical assessments" ON rco_practical_assessments FOR SELECT USING (true);
CREATE POLICY "Public read learning paths" ON rco_learning_paths FOR SELECT USING (true);
CREATE POLICY "Users read own study progress" ON rco_study_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own study progress" ON rco_study_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own study progress" ON rco_study_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users read own practice sessions" ON rco_practice_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own practice sessions" ON rco_practice_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own practice sessions" ON rco_practice_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Team admins read teams" ON rco_employer_teams FOR SELECT USING (true);
CREATE POLICY "Team members read own team" ON rco_employer_members FOR SELECT USING (true);

-- ══════════════════════════════════════════════
-- SEED: 17 DOMAINS
-- ══════════════════════════════════════════════

INSERT INTO rco_domains (code, name, description, weight_percent, level_required, sort_order) VALUES
-- Foundation domains (Level 1)
('SAFETY_FUNDAMENTALS', 'Robot Safety & Risk Assessment',
 'ISO 10218, collaborative robot safety, emergency procedures, risk matrices, lockout/tagout for robotic systems',
 25, 'foundation', 1),

('ROBOT_BASICS', 'Robot Types, Components & Architecture',
 'AMR, cobot, industrial arm, humanoid, sensors, actuators, compute, batteries, degrees of freedom, kinematics basics',
 20, 'foundation', 2),

('DEPLOYMENT_FUNDAMENTALS', 'Basic Deployment & Operations',
 'Site assessment, workspace setup, robot commissioning, basic programming, operator interface, maintenance basics',
 20, 'foundation', 3),

('TROUBLESHOOTING_L1', 'Basic Fault Diagnosis',
 'Error codes, sensor failures, connectivity issues, mechanical jams, basic diagnostic procedures',
 20, 'foundation', 4),

('REGULATIONS_ETHICS', 'Compliance, Ethics & Documentation',
 'OSHA regulations, safety standards, incident reporting, operator liability, data privacy in robot deployments',
 15, 'foundation', 5),

-- Specialist domains (Level 2)
('ADVANCED_PROGRAMMING', 'Robot Programming & Control Systems',
 'ROS2, motion planning, trajectory optimization, PID control, force control, sensor fusion',
 25, 'specialist', 6),

('FLEET_MANAGEMENT', 'Multi-Robot Fleet Operations',
 'Fleet coordination, task allocation, traffic management, OTA updates, uptime optimization, KPI tracking',
 20, 'specialist', 7),

('FAULT_INJECTION_MASTERY', 'Live Fault Diagnosis Under Pressure',
 'Edge case debugging, zero-downtime repairs, mid-shift reprogramming, hardware failures, sensor drift, actuator degradation',
 25, 'specialist', 8),

('PERCEPTION_AI', 'Computer Vision & AI Integration',
 'Point cloud processing, object detection, semantic segmentation, model fine-tuning, sim-to-real transfer, VLA models',
 30, 'specialist', 9),

-- Master domains (Level 3)
('SIM_TO_REAL', 'Simulation to Reality Bridge Mastery',
 'Physics engine tuning, domain randomization, adversarial simulation, reality gap closure, neural network transfer learning',
 20, 'master', 10),

('DEXTERITY_CONTROL', 'Dexterous Manipulation & Fine Motor',
 '50+ DOF hand control, deformable objects, force feedback, surgical precision, tool use in novel environments',
 25, 'master', 11),

('WORLD_MODELING', 'Robot World Models & Scene Understanding',
 'Spatial reasoning, novel environment handling, latent action spaces, diffusion policies, end-to-end autonomy without teleoperation',
 20, 'master', 12),

('EDGE_INFERENCE', 'Edge Computing & Inference Optimization',
 'Distributed compute, token efficiency, on-device inference, model compression, real-time performance at scale',
 15, 'master', 13),

('SYSTEM_ARCHITECTURE', 'Full Stack Robot System Design',
 'Hardware/software co-design, self-replication concepts, swarm coordination, robot building robot concepts',
 20, 'master', 14),

-- Fleet Commander domains (Level 4)
('PROGRAM_DESIGN', 'Certification Program Design & Training',
 'Designing operator training programs, competency frameworks, skills gap analysis, continuous education',
 30, 'fleet_commander', 15),

('INCIDENT_COMMAND', 'Crisis Management & Incident Command',
 'Multi-robot incidents, factory emergencies, regulatory response, PR protocols, post-incident analysis',
 35, 'fleet_commander', 16),

('BUSINESS_OPERATIONS', 'Robot Business Operations & ROI',
 'Fleet economics, contract negotiation, client management, scaling operations, vendor evaluation, TCO modeling',
 35, 'fleet_commander', 17);

-- ══════════════════════════════════════════════
-- SEED: PRACTICAL ASSESSMENTS (Master Gauntlet)
-- ══════════════════════════════════════════════

INSERT INTO rco_practical_assessments (level, title, description, scenario, robot_type, environment, time_limit_minutes, evaluation_criteria, pass_requirements, sort_order) VALUES
('master', 'Round 1: Fault Injection',
 'Unknown faults have been injected into a simulated robot system. Find and fix them all.',
 'A simulated robot system is handed to you with 5 injected faults: sensor drift (lidar), corrupted navigation map (5% error), intermittent actuator failure, network packet loss (15%), incorrect force thresholds. You have 30 minutes to find and fix ALL.',
 'Mixed fleet', 'Simulated warehouse', 30,
 '["Fault identification speed", "Diagnostic methodology", "Fix accuracy", "System verification after fix"]',
 'Fix 4 of 5 faults within time limit', 1),

('master', 'Round 2: Zero Downtime',
 'Perform maintenance, updates, and reconfiguration WITHOUT stopping production.',
 'Production simulation is running with 8 active robots. You must perform firmware update on 2 robots, reconfigure safety zones for a new obstacle, and replace a degraded sensor — all without any production stoppage events.',
 'AMR fleet', 'Active production floor', 30,
 '["Zero production stoppages", "Update procedure correctness", "Safety zone validation", "Change documentation"]',
 'Zero production stoppage events', 2),

('master', 'Round 3: Novel Environment',
 'Deploy a robot in an environment it has never seen. Adapt on the fly.',
 'A robot is placed in a completely new environment with unknown layout, lighting conditions, and obstacles. You must: remap key areas, adjust perception thresholds, validate safety zones, and document all changes. The robot must complete an assigned pick-and-place task.',
 'Cobot arm + AMR', 'Unknown facility', 30,
 '["Mapping accuracy", "Perception tuning", "Safety validation", "Task completion", "Documentation quality"]',
 'Robot completes assigned task in novel environment', 3),

('master', 'Round 4: Code Review & Fix',
 'Identify all bugs, security issues, safety failures, and performance problems in broken robot control code.',
 'Given 3 files of broken robot control code (ROS2 Python): an emergency stop node, a navigation planner, and a fleet coordinator. Must identify all bugs across all files and fix the safety-critical ones live.',
 'ROS2 system', 'Code review environment', 30,
 '["Bug identification completeness", "Safety-critical prioritization", "Fix correctness", "Code quality after fix"]',
 'Fix all safety-critical bugs', 4),

-- Fleet Commander Capstone
('fleet_commander', 'Capstone: Enterprise Deployment Strategy',
 'Design and present a complete robot deployment strategy for a simulated enterprise scenario.',
 'FreshMart Grocery Chain (200 stores) wants to deploy autonomous robots for: store shelf scanning/restocking, customer service/wayfinding, overnight cleaning/maintenance, inventory management integration, after-hours security. Total: 800+ robots, Budget: $12M over 3 years, Staff: 2,000 existing employees. Constraints: FDA compliance, customer safety, union considerations.',
 'Mixed fleet (800+)', 'Multi-site retail', 240,
 '["Fleet architecture recommendation", "Vendor selection with RoboScore", "5-year ROI model", "Operator training plan", "Safety/compliance framework", "Integration architecture", "Risk register", "Deployment roadmap"]',
 'Meets all 8 deliverable standards, reviewed by panel', 1);

-- ══════════════════════════════════════════════
-- SEED: LEARNING PATHS
-- ══════════════════════════════════════════════

-- Foundation modules
INSERT INTO rco_learning_paths (level, module_number, title, description, topics, estimated_hours, prerequisites, sort_order) VALUES
('foundation', 1, 'Robot Safety Fundamentals',
 'Master the safety protocols that keep humans and robots working together safely.',
 ARRAY['ISO 10218 overview', 'Risk assessment methods', 'Emergency procedures', 'Lockout/tagout for robotics', 'Safety zone design'],
 3.0, '{}', 1),

('foundation', 2, 'Robot Types & Architecture',
 'Understand the full landscape of robotic systems — from AMRs to humanoids.',
 ARRAY['AMR vs AGV vs Cobot', 'Sensors deep dive', 'Actuators & drive systems', 'Compute & AI hardware', 'Degrees of freedom & kinematics'],
 3.5, '{}', 2),

('foundation', 3, 'Basic Deployment & Operations',
 'Learn how to commission, operate, and maintain robotic systems.',
 ARRAY['Site assessment', 'Robot commissioning', 'HMI & operator interfaces', 'Basic programming concepts', 'Maintenance schedules'],
 3.0, ARRAY['Robot Types & Architecture'], 3),

('foundation', 4, 'Basic Fault Diagnosis',
 'Identify and resolve the most common robot failures.',
 ARRAY['Error code interpretation', 'Sensor failure diagnosis', 'Connectivity troubleshooting', 'Mechanical jam resolution', 'Diagnostic procedures'],
 2.5, ARRAY['Basic Deployment & Operations'], 4),

('foundation', 5, 'Compliance, Ethics & Documentation',
 'Navigate the regulatory landscape and document everything properly.',
 ARRAY['OSHA regulations', 'Safety standards overview', 'Incident reporting', 'Operator liability', 'Data privacy'],
 2.0, '{}', 5),

-- Specialist modules
('specialist', 1, 'Robot Programming & Control Systems',
 'Deep dive into ROS2, motion planning, and advanced control theory.',
 ARRAY['ROS2 architecture', 'Motion planning algorithms', 'Trajectory optimization', 'PID & force control', 'Sensor fusion techniques'],
 8.0, ARRAY['Foundation certification'], 1),

('specialist', 2, 'Multi-Robot Fleet Operations',
 'Manage fleets of robots at scale with coordination and optimization.',
 ARRAY['Fleet coordination algorithms', 'Task allocation strategies', 'Traffic management', 'OTA update procedures', 'KPI tracking & uptime'],
 6.0, ARRAY['Foundation certification'], 2),

('specialist', 3, 'Live Fault Diagnosis Under Pressure',
 'Debug edge cases and perform zero-downtime repairs in production.',
 ARRAY['Edge case debugging', 'Zero-downtime repair techniques', 'Mid-shift reprogramming', 'Hardware failure response', 'Sensor drift compensation'],
 8.0, ARRAY['Robot Programming & Control Systems'], 3),

('specialist', 4, 'Computer Vision & AI Integration',
 'Integrate perception systems and AI models into robotic platforms.',
 ARRAY['Point cloud processing', 'Object detection pipelines', 'Semantic segmentation', 'Model fine-tuning', 'Sim-to-real transfer basics'],
 10.0, ARRAY['Robot Programming & Control Systems'], 4),

-- Master modules
('master', 1, 'Simulation to Reality Bridge',
 'Close the sim-to-real gap with advanced transfer techniques.',
 ARRAY['Physics engine tuning', 'Domain randomization', 'Adversarial simulation', 'Reality gap analysis', 'Neural network transfer'],
 12.0, ARRAY['Specialist certification'], 1),

('master', 2, 'Dexterous Manipulation',
 'Master fine motor control for complex manipulation tasks.',
 ARRAY['High-DOF hand control', 'Deformable object manipulation', 'Force feedback systems', 'Surgical-precision tasks', 'Tool use in novel environments'],
 15.0, ARRAY['Specialist certification'], 2),

('master', 3, 'World Models & Scene Understanding',
 'Build and leverage world models for autonomous robot operation.',
 ARRAY['Spatial reasoning', 'Novel environment handling', 'Latent action spaces', 'Diffusion policies', 'End-to-end autonomy'],
 12.0, ARRAY['Computer Vision & AI Integration'], 3),

('master', 4, 'Edge Inference & System Architecture',
 'Optimize inference and design full-stack robot systems.',
 ARRAY['On-device inference', 'Model compression', 'Distributed compute', 'Hardware/software co-design', 'Swarm coordination'],
 10.0, ARRAY['Specialist certification'], 4),

-- Fleet Commander modules
('fleet_commander', 1, 'Program Design & Training',
 'Design operator certification and training programs for your organization.',
 ARRAY['Competency framework design', 'Skills gap analysis', 'Training curriculum development', 'Assessment design', 'Continuous education programs'],
 15.0, ARRAY['Master certification'], 1),

('fleet_commander', 2, 'Crisis Management & Incident Command',
 'Lead response to multi-robot incidents and factory emergencies.',
 ARRAY['Incident command structure', 'Multi-robot emergency response', 'Regulatory reporting', 'PR and communications', 'Post-incident analysis'],
 12.0, ARRAY['Master certification'], 2),

('fleet_commander', 3, 'Robot Business Operations',
 'Master the business side of large-scale robot deployments.',
 ARRAY['Fleet economics', 'Contract negotiation', 'Client management', 'Scaling operations', 'Vendor evaluation & TCO'],
 15.0, ARRAY['Master certification'], 3),

('fleet_commander', 4, 'Enterprise Capstone Preparation',
 'Prepare for the Fleet Commander capstone assessment.',
 ARRAY['Enterprise deployment planning', 'ROI modeling', 'Stakeholder management', 'Compliance frameworks', 'Presentation skills'],
 20.0, ARRAY['All Fleet Commander modules'], 4);

-- ══════════════════════════════════════════════
-- CURRICULUM UPDATES (living certification)
-- ══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS rco_curriculum_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level TEXT NOT NULL,
  specialization TEXT,
  update_date DATE NOT NULL DEFAULT CURRENT_DATE,
  update_type TEXT NOT NULL CHECK (update_type IN ('content', 'questions', 'standards', 'technology', 'regulatory')),
  description TEXT NOT NULL,
  what_changed TEXT NOT NULL,
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE rco_curriculum_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read curriculum updates" ON rco_curriculum_updates FOR SELECT USING (true);
CREATE INDEX IF NOT EXISTS idx_rco_curriculum_updates_level ON rco_curriculum_updates(level);
CREATE INDEX IF NOT EXISTS idx_rco_curriculum_updates_date ON rco_curriculum_updates(update_date);

-- Seed initial update record
INSERT INTO rco_curriculum_updates (level, update_type, description, what_changed) VALUES
('all', 'content', 'RCO v2 launch — complete program rebuild',
 'New: 17 domains, 700+ questions, Gauntlet assessment, 7 specializations, study system, employer portal, emerging technology curriculum');

-- Update rco_certifications with new exam parameters
UPDATE rco_certifications SET
  question_count = 80,
  exam_duration = 90,
  passing_score = 75
WHERE slug = '1';

UPDATE rco_certifications SET
  question_count = 120,
  exam_duration = 150,
  passing_score = 78
WHERE slug = '2';

UPDATE rco_certifications SET
  question_count = 150,
  exam_duration = 180,
  passing_score = 82
WHERE slug = '3';

UPDATE rco_certifications SET
  question_count = 150,
  exam_duration = 180,
  passing_score = 85
WHERE slug = '4';
