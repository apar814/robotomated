-- RCO Levels 0 and 5: Complete Career Ladder
-- Migration 033

-- ══════════════════════════════════════════════
-- LEVEL 0: AWARENESS (free entry point)
-- ══════════════════════════════════════════════

-- Add Level 0 certification
INSERT INTO rco_certifications (slug, name, level, description, exam_duration, question_count, passing_score, price, renewal_years, prerequisites, skills, industries)
VALUES (
  '0', 'Awareness', 0,
  'Robot literacy certification. Free. Permanent. Understand robots well enough to work alongside them safely and intelligently.',
  60, 40, 70, 0, NULL,
  '{}',
  ARRAY['Robot types understanding', 'Basic safety awareness', 'Human-robot collaboration', 'Robot economy literacy', 'Emergency procedures'],
  ARRAY['all']
) ON CONFLICT (slug) DO NOTHING;

-- Awareness progress tracking (email-based, no auth required)
CREATE TABLE IF NOT EXISTS rco_awareness_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  modules_completed INTEGER DEFAULT 0,
  simulator_tasks_completed INTEGER DEFAULT 0,
  exam_score INTEGER,
  passed BOOLEAN DEFAULT false,
  credential_id TEXT UNIQUE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_awareness_email ON rco_awareness_progress(email);
ALTER TABLE rco_awareness_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert awareness" ON rco_awareness_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own awareness" ON rco_awareness_progress FOR SELECT USING (true);
CREATE POLICY "Public update awareness" ON rco_awareness_progress FOR UPDATE USING (true);

-- Level 0 domains
INSERT INTO rco_domains (code, name, description, weight_percent, level_required, sort_order) VALUES
('ROBOT_REVOLUTION', 'The Robot Revolution',
 'Why robots now, the 5 robot types, real deployments, labor math, human opportunity',
 20, 'awareness', 0),
('HOW_ROBOTS_WORK', 'How Robots Actually Work',
 'Sensors, actuators, edge AI, power systems, communication — plain language',
 25, 'awareness', 0),
('ROBOT_SAFETY_BASIC', 'Working Safely Alongside Robots',
 'The 5 rules of robot safety, emergency procedures, collaboration zones, incident case studies',
 30, 'awareness', 0),
('ROBOT_ECONOMY', 'The Robot Economy',
 'Buy vs lease vs hire, RaaS, ROI evaluation, the $0.45/hour reality, industry trajectory',
 15, 'awareness', 0),
('FIRST_INTERACTION', 'Your First Robot Interaction',
 'Simulator tasks: start/stop safely, identify faults, clear blocked paths',
 10, 'awareness', 0)
ON CONFLICT (code) DO NOTHING;

-- Level 0 learning paths
INSERT INTO rco_learning_paths (level, module_number, title, description, topics, estimated_hours, prerequisites, sort_order)
SELECT * FROM (VALUES
  ('awareness', 1, 'The Robot Revolution',
   'Why robots are happening now and what it means for your career.',
   ARRAY['Convergence of AI + compute + sensors', 'The 5 robot types', 'Real deployments today', 'The labor math', 'What humans do better'], 0.75, '{}'::TEXT[], 1),
  ('awareness', 2, 'How Robots Actually Work',
   'Sensors, actuators, brains, and batteries — no jargon, just understanding.',
   ARRAY['Sensors: eyes ears and touch', 'Actuators: how robots move', 'The brain: edge AI', 'Power: battery reality', 'Communication: robot-to-robot and cloud'], 1.0, '{}'::TEXT[], 2),
  ('awareness', 3, 'Working Safely Alongside Robots',
   'The 5 rules that keep you safe when robots are nearby.',
   ARRAY['The 5 rules of robot safety', 'When a robot stops: what to do', 'Emergency procedures', 'Human-robot collaboration zones', 'Real incident case studies'], 0.75, '{}'::TEXT[], 3),
  ('awareness', 4, 'The Robot Economy',
   'Buy vs lease vs hire. RaaS. How to evaluate if a robot makes sense.',
   ARRAY['Buy vs lease vs hire', 'RaaS explained', 'ROI evaluation basics', 'The $0.45/hour reality', 'Where the industry is going'], 0.5, '{}'::TEXT[], 4),
  ('awareness', 5, 'Your First Robot Interaction',
   'Complete 3 tasks in a browser-based robot simulator to prove understanding.',
   ARRAY['Start and stop a robot safely', 'Identify a fault from error log', 'Clear a blocked path correctly'], 0.5, ARRAY['All previous modules'], 5)
) AS v(level, module_number, title, description, topics, estimated_hours, prerequisites, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM rco_learning_paths WHERE level = 'awareness' LIMIT 1);

-- ══════════════════════════════════════════════
-- LEVEL 5: CHIEF ROBOTICS OFFICER (CRO)
-- ══════════════════════════════════════════════

-- Add Level 5 certification
INSERT INTO rco_certifications (slug, name, level, description, exam_duration, question_count, passing_score, price, renewal_years, prerequisites, skills, industries)
VALUES (
  '5', 'Chief Robotics Officer', 5,
  'The highest credential in robotics. Not awarded — earned. Portfolio defense, panel review, and contribution commitment. For industry leaders who shape the future.',
  90, 0, 80, 2499, 3,
  ARRAY['RCO Fleet Commander (Level 4)', '5+ years post-Level 4', 'Qualifying achievement'],
  ARRAY['Enterprise fleet deployment', 'Published robotics research', 'Strategic leadership', 'Industry governance', 'Curriculum contribution'],
  ARRAY['enterprise', 'government', 'research', 'manufacturing']
) ON CONFLICT (slug) DO NOTHING;

-- CRO Applications (3-gate process)
CREATE TABLE IF NOT EXISTS cro_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_linkedin TEXT,
  years_post_level4 INTEGER,
  qualification_type TEXT CHECK (
    qualification_type IN (
      'fleet_500_plus',
      'founded_company',
      'published_research',
      'vp_plus_role',
      'government_program',
      'academic_curriculum'
    )
  ),
  qualification_details TEXT,
  -- Gate 1: Portfolio
  case_study_1 TEXT,
  case_study_2 TEXT,
  case_study_3 TEXT,
  published_work_url TEXT,
  published_work_title TEXT,
  reference_1_name TEXT,
  reference_1_email TEXT,
  reference_1_relationship TEXT,
  reference_2_name TEXT,
  reference_2_email TEXT,
  reference_2_relationship TEXT,
  self_assessment_1 TEXT,
  self_assessment_2 TEXT,
  self_assessment_3 TEXT,
  gate_1_status TEXT DEFAULT 'pending' CHECK (gate_1_status IN ('pending','reviewing','passed','failed')),
  gate_1_feedback TEXT,
  gate_1_reviewed_at TIMESTAMPTZ,
  gate_1_reviewer TEXT,
  -- Gate 2: Panel
  gate_2_scheduled_at TIMESTAMPTZ,
  gate_2_status TEXT DEFAULT 'pending' CHECK (gate_2_status IN ('pending','scheduled','passed','failed')),
  gate_2_score JSONB DEFAULT '{}',
  gate_2_feedback TEXT,
  gate_2_panelists TEXT[],
  -- Gate 3: Commitment
  gate_3_signed_at TIMESTAMPTZ,
  -- Final
  final_status TEXT DEFAULT 'in_progress' CHECK (final_status IN ('in_progress','approved','denied','withdrawn')),
  credential_id TEXT UNIQUE,
  designated_at TIMESTAMPTZ,
  renewal_due TIMESTAMPTZ,
  contribution_hours_logged INTEGER DEFAULT 0,
  mentees_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- CRO Council
CREATE TABLE IF NOT EXISTS cro_council (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_name TEXT NOT NULL,
  member_title TEXT,
  member_company TEXT,
  member_linkedin TEXT,
  credential_id TEXT,
  cro_application_id UUID REFERENCES cro_applications(id),
  joined_council_at TIMESTAMPTZ DEFAULT now(),
  active BOOLEAN DEFAULT true,
  bio TEXT,
  expertise TEXT[] DEFAULT '{}',
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Council Decisions (public transparency)
CREATE TABLE IF NOT EXISTS cro_council_decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  decision_date DATE NOT NULL,
  topic TEXT NOT NULL,
  decision TEXT NOT NULL,
  rationale TEXT,
  vote_for INTEGER DEFAULT 0,
  vote_against INTEGER DEFAULT 0,
  vote_abstain INTEGER DEFAULT 0,
  effective_date DATE,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CRO Contribution Tracking
CREATE TABLE IF NOT EXISTS cro_contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cro_id UUID NOT NULL REFERENCES cro_applications(id) ON DELETE CASCADE,
  contribution_type TEXT NOT NULL CHECK (contribution_type IN (
    'question_review', 'mentorship_session', 'curriculum_content',
    'industry_update', 'summit_attendance', 'panel_service'
  )),
  description TEXT,
  hours NUMERIC(5,1) DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cro_applications_status ON cro_applications(final_status);
CREATE INDEX IF NOT EXISTS idx_cro_applications_user ON cro_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_cro_council_active ON cro_council(active);
CREATE INDEX IF NOT EXISTS idx_cro_decisions_published ON cro_council_decisions(published, decision_date DESC);
CREATE INDEX IF NOT EXISTS idx_cro_contributions_cro ON cro_contributions(cro_id);

-- RLS
ALTER TABLE cro_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cro_council ENABLE ROW LEVEL SECURITY;
ALTER TABLE cro_council_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cro_contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert CRO applications" ON cro_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users read own CRO application" ON cro_applications FOR SELECT USING (true);
CREATE POLICY "Public read council" ON cro_council FOR SELECT USING (active = true);
CREATE POLICY "Public read published decisions" ON cro_council_decisions FOR SELECT USING (published = true);
CREATE POLICY "Public read contributions" ON cro_contributions FOR SELECT USING (true);
CREATE POLICY "CRO insert contributions" ON cro_contributions FOR INSERT WITH CHECK (true);
