/**
 * Versioned RCO question-pool seeder. Replaces the retired seed-once path.
 *
 * - Idempotent: upserts on (certification_id, source_qid), so re-running
 *   after bank edits updates rows in place — bank changes actually reach
 *   the DB.
 * - Same-run v1 retirement: legacy rows (source_qid IS NULL) are
 *   deactivated, and v2 rows whose source_qid no longer exists in the bank
 *   are deactivated (bank deletions propagate).
 * - Dry-run by default; pass --apply to write.
 *
 * Requires migration 043 (domain_code, correct_answers, tags,
 * scenario_context, source_qid + unique index).
 *
 * Run: npx tsx scripts/seed-rco-questions.ts [--apply]
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { FOUNDATION_QUESTIONS, type RcoQuestionV2 } from '../lib/data/rco-questions-foundation';
dotenv.config({ path: '.env.local' });

const APPLY = process.argv.includes('--apply');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DOMAIN_PREFIX: Record<string, string> = {
  SAFETY_FUNDAMENTALS: 'SF',
  ROBOT_BASICS: 'RB',
  DEPLOYMENT_FUNDAMENTALS: 'DF',
  TROUBLESHOOTING_L1: 'TS',
  REGULATIONS_ETHICS: 'RE',
};
// domain -> legacy category column (kept for back-compat displays)
const DOMAIN_CATEGORY: Record<string, string> = {
  SAFETY_FUNDAMENTALS: 'safety',
  ROBOT_BASICS: 'theory',
  DEPLOYMENT_FUNDAMENTALS: 'operations',
  TROUBLESHOOTING_L1: 'troubleshooting',
  REGULATIONS_ETHICS: 'regulations',
};

interface SeedRow {
  certification_id: string;
  source_qid: string;
  question_text: string;
  question_type: string;
  options: string[];
  correct_answers: number[];
  explanation: string;
  difficulty: number;
  category: string;
  domain_code: string;
  tags: string[];
  scenario_context: string | null;
  time_limit: number;
  active: boolean;
}

function buildRows(certificationId: string): SeedRow[] {
  const counters: Record<string, number> = {};
  return FOUNDATION_QUESTIONS.map((q: RcoQuestionV2) => {
    const prefix = DOMAIN_PREFIX[q.domain_code];
    if (!prefix) throw new Error(`Unknown domain_code: ${q.domain_code}`);
    counters[prefix] = (counters[prefix] || 0) + 1;
    const sourceQid = `${prefix}-${counters[prefix]}`;

    const optionTexts = q.options.map((o) => o.text);
    const correctIdx = q.correct_answers.map((label) => {
      const idx = q.options.findIndex((o) => o.label === label);
      if (idx === -1) throw new Error(`${sourceQid}: correct label ${label} not found`);
      return idx;
    });

    // structural validation before anything touches the DB
    if (optionTexts.length < 2) throw new Error(`${sourceQid}: fewer than 2 options`);
    if (correctIdx.length === 0) throw new Error(`${sourceQid}: no correct answers`);
    if (q.question_type !== 'multi_select' && correctIdx.length !== 1)
      throw new Error(`${sourceQid}: ${q.question_type} must have exactly 1 correct answer`);
    if (!q.question_text.trim() || !q.explanation.trim())
      throw new Error(`${sourceQid}: empty question_text or explanation`);
    if (q.difficulty < 1 || q.difficulty > 5) throw new Error(`${sourceQid}: bad difficulty`);

    return {
      certification_id: certificationId,
      source_qid: sourceQid,
      question_text: q.question_text,
      question_type: q.question_type,
      options: optionTexts,
      correct_answers: correctIdx,
      explanation: q.explanation,
      difficulty: q.difficulty,
      category: DOMAIN_CATEGORY[q.domain_code],
      domain_code: q.domain_code,
      tags: q.tags,
      scenario_context: q.scenario_context ?? null,
      time_limit: q.time_limit_seconds ?? 120,
      active: true,
    };
  });
}

async function main() {
  console.log(`RCO question pool seed ${APPLY ? '(APPLY)' : '(dry run)'}`);
  console.log('='.repeat(40));

  const { data: cert, error: certError } = await supabase
    .from('rco_certifications')
    .select('id, slug, question_count')
    .eq('slug', 'foundation')
    .single();
  if (certError || !cert) throw new Error(`Foundation cert lookup failed: ${certError?.message}`);

  const rows = buildRows(cert.id);
  console.log(`Bank: ${rows.length} questions validated`);

  // quota sanity: enough per domain/difficulty for stratified selection
  const byDomain: Record<string, number> = {};
  const byDiff: Record<number, number> = {};
  rows.forEach((r) => {
    byDomain[r.domain_code] = (byDomain[r.domain_code] || 0) + 1;
    byDiff[r.difficulty] = (byDiff[r.difficulty] || 0) + 1;
  });
  console.log('By domain:', JSON.stringify(byDomain));
  console.log('By difficulty:', JSON.stringify(byDiff));

  // current DB state for this cert
  const { data: existing, error: exErr } = await supabase
    .from('rco_questions')
    .select('id, source_qid, active')
    .eq('certification_id', cert.id);
  if (exErr) throw new Error(`Existing pool fetch failed: ${exErr.message}`);

  const bankQids = new Set(rows.map((r) => r.source_qid));
  const legacy = (existing || []).filter((r) => r.source_qid === null && r.active);
  const orphaned = (existing || []).filter(
    (r) => r.source_qid !== null && !bankQids.has(r.source_qid) && r.active
  );
  const known = (existing || []).filter((r) => r.source_qid !== null && bankQids.has(r.source_qid));

  console.log(
    `DB now: ${existing?.length ?? 0} rows | v2 already present: ${known.length} | active legacy (v1) to deactivate: ${legacy.length} | orphaned v2 to deactivate: ${orphaned.length}`
  );

  if (!APPLY) {
    console.log('\nDry run complete — re-run with --apply to write.');
    return;
  }

  // 1. Upsert the bank
  const { error: upsertError } = await supabase
    .from('rco_questions')
    .upsert(rows, { onConflict: 'certification_id,source_qid' });
  if (upsertError) throw new Error(`Upsert failed: ${upsertError.message}`);
  console.log(`Upserted ${rows.length} questions`);

  // 2. Deactivate legacy v1 rows (same run — the v1 bank is retired)
  if (legacy.length > 0) {
    const { error } = await supabase
      .from('rco_questions')
      .update({ active: false })
      .eq('certification_id', cert.id)
      .is('source_qid', null);
    if (error) throw new Error(`v1 deactivation failed: ${error.message}`);
    console.log(`Deactivated ${legacy.length} legacy v1 rows`);
  }

  // 3. Deactivate v2 rows removed from the bank
  for (const row of orphaned) {
    const { error } = await supabase
      .from('rco_questions')
      .update({ active: false })
      .eq('id', row.id);
    if (error) throw new Error(`Orphan deactivation failed for ${row.source_qid}: ${error.message}`);
  }
  if (orphaned.length > 0) console.log(`Deactivated ${orphaned.length} orphaned v2 rows`);

  // 4. Verify final pool
  const { count } = await supabase
    .from('rco_questions')
    .select('id', { count: 'exact', head: true })
    .eq('certification_id', cert.id)
    .eq('active', true);
  console.log(`Final active pool: ${count} (question_count=${cert.question_count})`);
  if ((count ?? 0) < cert.question_count * 2) {
    console.warn(
      `WARNING: pool (${count}) is below 2x question_count (${cert.question_count}) — retake exposure exceeds 50%`
    );
  }
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
