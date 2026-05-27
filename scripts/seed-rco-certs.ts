/**
 * Sync rco_certifications + rco_questions from code → Supabase.
 *
 * Reads:
 *   - lib/certifications.ts          (CERT_LEVELS — source of truth for certs)
 *   - lib/data/sample-exam-questions (FOUNDATION_QUESTIONS — level-1 sample qs)
 *
 * Behavior:
 *   - Dry-run by default — prints the upsert plan, makes no writes.
 *   - Pass --apply to write to the DB.
 *   - Pass --reset-questions to delete and re-insert questions (otherwise
 *     question seeding skips any cert that already has rows).
 *
 * Run:
 *   npx tsx scripts/seed-rco-certs.ts            # dry-run
 *   npx tsx scripts/seed-rco-certs.ts --apply    # actually write
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { CERT_LEVELS } from "../lib/certifications";
import { FOUNDATION_QUESTIONS } from "../lib/data/sample-exam-questions";

const APPLY = process.argv.includes("--apply");
const RESET_QS = process.argv.includes("--reset-questions");

function loadEnv(path: string): Record<string, string> {
  return Object.fromEntries(
    readFileSync(path, "utf8")
      .split(/\r?\n/)
      .filter((l) => l && !l.startsWith("#") && l.includes("="))
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
      })
  );
}

const env = loadEnv(".env.local");
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const sb = createClient(url, key);

// Schema CHECK constraint on rco_certifications.level allows only 1-4.
// Levels 0 (awareness) and 5 (cro) are deferred until migration 040 relaxes it.
const SEED_LEVELS = CERT_LEVELS.filter((c) => c.level >= 1 && c.level <= 4);

function certRow(c: typeof CERT_LEVELS[number]) {
  return {
    slug: c.slug,
    name: c.name,
    level: c.level,
    description: c.proves,
    exam_duration: c.duration,
    question_count: c.questions,
    passing_score: c.passScore,
    price: c.price,
    renewal_years: c.renewalYears,
    prerequisites: c.prerequisites === "None" ? [] : [c.prerequisites],
    skills: c.outcomes,
    industries: c.careers,
    active: true,
  };
}

console.log(`\n${APPLY ? "🚀 APPLY MODE — writes will be made" : "🔍 DRY RUN — no writes (pass --apply to write)"}`);
console.log(`Target: ${url}\n`);

// ─── Plan: rco_certifications upserts ──────────────────────────────
console.log("rco_certifications — upsert plan (on conflict (slug) update):");
for (const c of SEED_LEVELS) {
  const r = certRow(c);
  console.log(`  ${r.slug.padEnd(18)} L${r.level}  ${r.name.padEnd(24)} $${r.price}  ${r.question_count}q / ${r.exam_duration}min / ${r.passing_score}%`);
}
console.log(`  (levels 0 awareness, 5 cro deferred — schema CHECK constraint allows 1-4 only)`);

// ─── Plan: rco_questions seed ──────────────────────────────────────
const foundationCert = CERT_LEVELS.find((c) => c.slug === "foundation");
console.log(`\nrco_questions — foundation (${FOUNDATION_QUESTIONS.length} questions to seed)`);
console.log(`  Behavior: ${RESET_QS ? "DELETE existing then INSERT" : "INSERT only if cert has zero questions"}`);

if (!APPLY) {
  console.log("\n✓ Dry-run complete. Re-run with --apply to write.");
  process.exit(0);
}

async function apply() {
  console.log("\n--- Writing certs ---");
  const { data: certResult, error: certErr } = await sb
    .from("rco_certifications")
    .upsert(SEED_LEVELS.map(certRow), { onConflict: "slug" })
    .select("id, slug, name, level");

  if (certErr) {
    console.error("Cert upsert FAILED:", certErr);
    process.exit(1);
  }
  console.table(certResult);

  const certBySlug = new Map<string, string>(
    (certResult ?? []).map((r) => [r.slug as string, r.id as string])
  );

  console.log("\n--- Seeding foundation questions ---");
  if (!foundationCert) {
    console.error("foundation cert missing from CERT_LEVELS, skipping question seed");
    process.exit(1);
  }
  const foundationId = certBySlug.get("foundation");
  if (!foundationId) {
    console.error("foundation cert id not returned from upsert, skipping question seed");
    process.exit(1);
  }

  if (RESET_QS) {
    const { error: delErr } = await sb
      .from("rco_questions")
      .delete()
      .eq("certification_id", foundationId);
    if (delErr) {
      console.error("Failed to delete existing questions:", delErr);
      process.exit(1);
    }
    console.log(`  Cleared existing foundation questions.`);
  }

  const { count: existingCount } = await sb
    .from("rco_questions")
    .select("id", { count: "exact", head: true })
    .eq("certification_id", foundationId);

  if ((existingCount ?? 0) > 0 && !RESET_QS) {
    console.log(`  Skipping — ${existingCount} questions already exist for foundation. Use --reset-questions to overwrite.`);
  } else {
    const rows = FOUNDATION_QUESTIONS.map((q) => ({
      certification_id: foundationId,
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      category: q.category,
    }));
    const { error: qErr } = await sb.from("rco_questions").insert(rows);
    if (qErr) {
      console.error("Question insert FAILED:", qErr);
      process.exit(1);
    }
    console.log(`  Inserted ${rows.length} foundation questions.`);
  }

  console.log("\n✓ Seed complete.");
}

apply().catch((err) => {
  console.error(err);
  process.exit(1);
});
