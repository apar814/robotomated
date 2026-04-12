-- Robotimus conversation memory for personalization
ALTER TABLE advisor_conversations ADD COLUMN IF NOT EXISTS use_case_detected TEXT;
ALTER TABLE advisor_conversations ADD COLUMN IF NOT EXISTS budget_mentioned INTEGER;
ALTER TABLE advisor_conversations ADD COLUMN IF NOT EXISTS robots_discussed TEXT[] DEFAULT '{}';
ALTER TABLE advisor_conversations ADD COLUMN IF NOT EXISTS outcome TEXT;
ALTER TABLE advisor_conversations ADD COLUMN IF NOT EXISTS session_summary TEXT;
ALTER TABLE advisor_conversations ADD COLUMN IF NOT EXISTS intent_detected TEXT;

CREATE INDEX IF NOT EXISTS idx_advisor_user ON advisor_conversations(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_advisor_created ON advisor_conversations(created_at DESC);
