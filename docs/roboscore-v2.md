# RoboScore v2 — Requirements Log

Findings from the 2026-08-10 audit (see git history around e8b2f8e) and the
requirements they motivate. v1 stays as-is until v2 is designed; this file
collects what v2 must fix.

## Structural flaw in v1: stored headline score can drift

`robots.robo_score` is stored independently of `robots.score_breakdown`.
The 2026-08-10 audit found 68/971 robots (7%) where the stored score did
not equal the weighted average of the stored breakdown (max drift 1.9
points, both directions) — breakdowns had been edited without recomputing.
All 68 were recomputed, but **divergence recurs every time a
score_breakdown is edited without a recompute**. Interim guard:

- `node scripts/recompute-roboscores.mjs` — dry-run audit, exits 1 on any
  divergence (CI-friendly); `--apply` recomputes from breakdowns.

**v2 requirement:** the headline score must never be independently
writable. Compute it on read (view / generated column) or enforce it on
write (trigger or single write path through `calculateRoboScore`). One
source of truth: the breakdown.

## v2 requirements

1. **Spec-derived formula.** v1 dimension scores are editorial judgments
   hand-entered at import time. v2 should derive as much of each dimension
   as possible from verifiable robot attributes (specs, price, certified
   safety standards, documented integrations), with the editorial residue
   explicitly labeled as such. The methodology page must describe exactly
   this split — no claims of benchmarks or operator data unless those
   pipelines actually exist (see claims-policy.md and the RETIRED block).

2. **Coverage badges.** 14 active robots (mostly flagship humanoids:
   Figure 03, Optimus Gen 2.5, Digit, Apollo, Atlas Electric, Unitree G1…)
   have no score at all, and 352/986 lack price_current. v2 should render
   explicit "Not yet scored" / data-completeness badges instead of silent
   blanks, and treat score coverage as a tracked metric.

3. **Buyer-weighted views.** Actual v1 distribution is compressed
   (60.5–92.5, median 79.2, stddev 3.9; warehouse/manufacturing stddev ~2)
   because comparable robots in a category genuinely cluster. A single
   global number can't separate them. v2 should lean on the
   already-published idea of re-weighting by buyer priorities
   (/methodology's "adjust the weights" section): per-use-case weight
   presets, category-relative percentile display, or both — so the score
   differentiates within a shopper's actual consideration set.

## Non-negotiables carried from v1

- Weights and methodology page render from the same constants the formula
  uses (`lib/scoring/roboscore.ts` DIMENSIONS) — keep this property.
- No heuristic backfill of scores (see the quarantined scorer in
  scripts/fill-missing-data.ts — a robot with insufficient data gets no
  score, never an invented one).
- Editorial independence: no manufacturer influence on any input.
