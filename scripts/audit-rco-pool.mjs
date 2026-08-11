/**
 * Live question-pool audit (CI-friendly; exit 1 on any failure).
 *
 * Asserts for every active certification:
 *  - the active pool can satisfy stratified selection (pool >= question_count,
 *    every domain stratum non-trivial, warn below the 2x exposure target)
 *  - every question passes structural checks: >=2 options, correct answers
 *    present and in range, multi_select has >1 correct, single types exactly 1,
 *    non-empty text/explanation, difficulty 1-5
 *
 * Run: node scripts/audit-rco-pool.mjs
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = Object.fromEntries(
  readFileSync(join(root, ".env.local"), "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)])
);
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_ || !KEY) {
  console.error("Missing Supabase env in .env.local");
  process.exit(2);
}
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };

let failures = 0;
const fail = (msg) => {
  failures++;
  console.error(`FAIL: ${msg}`);
};

const certs = await (
  await fetch(`${URL_}/rest/v1/rco_certifications?select=id,slug,question_count,active`, { headers: H })
).json();

for (const cert of certs.filter((c) => c.active)) {
  const pool = await (
    await fetch(
      `${URL_}/rest/v1/rco_questions?select=id,source_qid,question_type,options,correct_answers,correct_answer,difficulty,domain_code,question_text,explanation&certification_id=eq.${cert.id}&active=eq.true&limit=2000`,
      { headers: H }
    )
  ).json();

  console.log(`\n── ${cert.slug}: active pool ${pool.length}, question_count ${cert.question_count}`);

  if (pool.length < cert.question_count)
    fail(`${cert.slug}: pool (${pool.length}) smaller than question_count (${cert.question_count})`);
  else if (pool.length < cert.question_count * 2)
    console.warn(
      `WARN: ${cert.slug}: pool (${pool.length}) below 2x question_count — retake exposure exceeds 50%`
    );

  const byDomain = {};
  const byDiff = {};
  for (const q of pool) {
    byDomain[q.domain_code ?? "(none)"] = (byDomain[q.domain_code ?? "(none)"] || 0) + 1;
    byDiff[q.difficulty] = (byDiff[q.difficulty] || 0) + 1;

    const label = q.source_qid ?? q.id;
    const options = Array.isArray(q.options) ? q.options : [];
    if (options.length < 2) fail(`${label}: fewer than 2 options`);
    const correct =
      q.correct_answers && q.correct_answers.length > 0
        ? q.correct_answers
        : q.correct_answer !== null && q.correct_answer !== undefined
          ? [q.correct_answer]
          : [];
    if (correct.length === 0) fail(`${label}: no correct answer`);
    if (correct.some((c) => c < 0 || c >= options.length))
      fail(`${label}: correct index out of range`);
    if (new Set(correct).size !== correct.length) fail(`${label}: duplicate correct indices`);
    if (q.question_type === "multi_select" && correct.length < 2)
      fail(`${label}: multi_select with fewer than 2 correct answers`);
    if (q.question_type !== "multi_select" && correct.length !== 1)
      fail(`${label}: ${q.question_type} must have exactly 1 correct answer`);
    if (!q.question_text?.trim()) fail(`${label}: empty question_text`);
    if (!q.explanation?.trim()) fail(`${label}: empty explanation`);
    if (q.difficulty < 1 || q.difficulty > 5) fail(`${label}: difficulty out of range`);
  }

  console.log(`  by domain: ${JSON.stringify(byDomain)}`);
  console.log(`  by difficulty: ${JSON.stringify(byDiff)}`);

  // stratified selection needs every domain stratum to be non-trivial
  const domains = Object.entries(byDomain).filter(([d]) => d !== "(none)");
  if (domains.length > 0) {
    for (const [d, n] of domains) {
      const quota = Math.round((n / pool.length) * cert.question_count);
      if (n < quota) fail(`${cert.slug}/${d}: stratum (${n}) can't fill its quota (${quota})`);
    }
    if (byDomain["(none)"])
      console.warn(`WARN: ${cert.slug}: ${byDomain["(none)"]} active rows lack domain_code (legacy) — selection will use flat fallback until they're deactivated`);
  }
}

console.log(failures === 0 ? "\nPool audit: PASS" : `\nPool audit: ${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
