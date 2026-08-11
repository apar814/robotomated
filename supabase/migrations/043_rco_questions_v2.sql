-- ============================================================================
-- Migration 043: rco_questions v2 bank support
-- Adds the columns the audited Foundation v2 bank needs, widens
-- question_type, and adds per-session option-permutation storage.
-- Idempotent: safe to re-run (IF NOT EXISTS / DROP CONSTRAINT IF EXISTS).
-- correct_answer (singular) is retained for the legacy v1 rows; new code
-- reads correct_answers (int[] of canonical option indices) and falls back
-- to ARRAY[correct_answer].
-- ============================================================================

-- ─── rco_questions: v2 columns ─────────────────────────────────────
ALTER TABLE rco_questions
  ADD COLUMN IF NOT EXISTS domain_code TEXT,
  ADD COLUMN IF NOT EXISTS correct_answers INTEGER[],
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS scenario_context TEXT,
  ADD COLUMN IF NOT EXISTS source_qid TEXT;

COMMENT ON COLUMN rco_questions.correct_answers IS
  'Canonical option indices (0-based into options array). Supersedes correct_answer; multi_select questions have multiple entries. Never expose via any client-facing select.';
COMMENT ON COLUMN rco_questions.source_qid IS
  'Stable id from the source bank (e.g. SF-1). Seed script upserts on (certification_id, source_qid); NULL means legacy hand-inserted row.';

-- Idempotent upsert key for the seed script. Full (non-partial) index so
-- ON CONFLICT inference works via PostgREST; NULL source_qids (legacy rows)
-- never collide because NULLs are distinct in unique indexes.
CREATE UNIQUE INDEX IF NOT EXISTS rco_questions_cert_source_qid_key
  ON rco_questions (certification_id, source_qid);

-- ─── Widen question_type ───────────────────────────────────────────
ALTER TABLE rco_questions
  DROP CONSTRAINT IF EXISTS rco_questions_question_type_check;
ALTER TABLE rco_questions
  ADD CONSTRAINT rco_questions_question_type_check
  CHECK (question_type IN (
    'multiple_choice', 'scenario', 'image_based',
    'multi_select', 'fault_diagnosis', 'calculation',
    'sequencing', 'true_false_justify'
  ));

-- ─── Backfill: every legacy row gets correct_answers ───────────────
UPDATE rco_questions
SET correct_answers = ARRAY[correct_answer]
WHERE correct_answers IS NULL
  AND correct_answer IS NOT NULL;

-- correct_answer becomes optional going forward (v2 rows won't set it)
ALTER TABLE rco_questions
  ALTER COLUMN correct_answer DROP NOT NULL;

-- ─── rco_exam_sessions: per-session option permutations ────────────
-- option_orders maps question_id -> int[] where perm[servedIndex] gives the
-- canonical option index. Written once at session creation, read at scoring.
ALTER TABLE rco_exam_sessions
  ADD COLUMN IF NOT EXISTS option_orders JSONB NOT NULL DEFAULT '{}';

COMMENT ON COLUMN rco_exam_sessions.option_orders IS
  'question_id -> permutation array; perm[servedIndex] = canonical option index. Scoring remaps submitted served indices through this before comparing to correct_answers.';
