/**
 * RoboScore divergence audit + recompute.
 *
 * The headline robo_score must equal the weighted average of the stored
 * score_breakdown (lib/scoring/roboscore.ts). Divergence recurs whenever a
 * breakdown is edited without recomputing — run this as a periodic audit.
 *
 * Default is a dry-run audit: reports divergent rows, writes nothing, and
 * exits 1 if any are found (CI-friendly). Pass --apply to fix them by
 * recomputing robo_score from the breakdown. Breakdowns are never modified.
 *
 * Run: node scripts/recompute-roboscores.mjs [--apply]
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

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
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(2);
}
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const APPLY = process.argv.includes("--apply");

// Must mirror DIMENSIONS in lib/scoring/roboscore.ts
const W = { performance: 0.25, reliability: 0.2, ease_of_use: 0.15, intelligence: 0.15, value: 0.1, ecosystem: 0.08, safety: 0.05, design: 0.02 };
const DIMS = Object.keys(W);
const weighted = (bd) => Math.round(DIMS.reduce((s, d) => s + bd[d] * W[d], 0) * 10) / 10;

async function fetchDivergent() {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const res = await fetch(`${URL_}/rest/v1/robots?select=id,slug,robo_score,score_breakdown&order=slug`, {
      headers: { ...H, Range: `${from}-${from + 999}` },
    });
    const page = await res.json();
    rows.push(...page);
    if (page.length < 1000) break;
  }
  const divergent = rows.filter((r) => {
    const bd = r.score_breakdown;
    return (
      r.robo_score != null && bd && DIMS.every((d) => typeof bd[d] === "number") &&
      Math.abs(weighted(bd) - r.robo_score) > 0.05
    );
  });
  divergent.sort(
    (a, b) =>
      Math.abs(weighted(b.score_breakdown) - b.robo_score) -
      Math.abs(weighted(a.score_breakdown) - a.robo_score)
  );
  return { total: rows.length, divergent };
}

const { total, divergent } = await fetchDivergent();
console.log(`robots checked: ${total} | divergent: ${divergent.length}`);
divergent.forEach((r) => console.log(`  ${r.slug}: stored ${r.robo_score} -> computed ${weighted(r.score_breakdown)}`));

if (!APPLY) {
  if (divergent.length > 0) {
    console.log("\nDry run — no writes. Re-run with --apply to recompute these.");
    process.exit(1);
  }
  console.log("All stored scores match the weighted formula.");
  process.exit(0);
}

let ok = 0, fail = 0;
for (const r of divergent) {
  const resp = await fetch(`${URL_}/rest/v1/robots?id=eq.${r.id}`, {
    method: "PATCH",
    headers: { ...H, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ robo_score: weighted(r.score_breakdown) }),
  });
  resp.ok ? ok++ : (fail++, console.error(`FAIL ${r.slug}: ${resp.status} ${await resp.text()}`));
}
console.log(`updated: ${ok}, failed: ${fail}`);

const after = await fetchDivergent();
console.log(`remaining divergence: ${after.divergent.length}`);
process.exit(after.divergent.length > 0 || fail > 0 ? 1 : 0);
