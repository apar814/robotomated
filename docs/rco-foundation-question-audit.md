# RCO Foundation v2 Question Bank — Phase 0 Claims Audit (2026-08-10)

Scope: all 100 questions in `lib/data/rco-questions-foundation.ts`, audited
against `docs/claims-policy.md`. No rewrites made — dispositions only.

## Summary

| Verdict | Count | Meaning |
|---|---|---|
| KEEP | 67 | Clean — standards/capability knowledge, no claims issues |
| STRIP-RWC | 19 | `real_world_context` asserts unsourced real-world stats or incidents — cite or cut the context (question itself is fine) |
| FIX | 5 | Factual/technical error to correct (SF-2, RB-9, TS-8, RE-3, RE-8) |
| HEDGE | 4 | Unsourced numeric heuristic in explanation — soften to "commonly used planning assumption" or cite (RB-6, RB-8, DF-3, DF-8) |
| VERIFY | 5 | Checkable vendor/company claims — confirm and cite, else strip (SF-22, RB-11, RB-19, DF-11, RE-7) |

(STRIP-RWC + FIX overlap on SF-2; totals count it once under FIX.)

**Answer keys: all 100 verified technically correct.** No wrong keys found.
The standards citations (ISO 10218-1/2, ISO/TS 15066, ISO 12100, ISO 13849-1,
ISO 13855, ISO 13850, IEC 60079, IEC 60529, OSHA 1910.147/1904.39/1904)
check out, with the exceptions listed under FIX.

**RoboScore / Robotomated marketing references: zero.** No question teaches
platform claims. One borderline: RE-2 (editorial-independence scenario) is a
thinly veiled description of our own business model, but it tests external,
verifiable knowledge (FTC disclosure rules, media ethics) — acceptable under
the policy; keep with awareness.

## Critical structural finding: answer-key pattern

**~66 of 78 single-answer questions have B as the correct answer, and the
correct option is almost always the longest.** Every multi-select key
includes A (7 of 9 are exactly A/B/C). A test-wise candidate who always picks
the longest option (or B) passes without any robotics knowledge. This is not
a claims issue but it invalidates the exam. Required fix at seed time:
**shuffle option order per question (or per serve)** and rebalance key
positions. This also argues for storing `correct_answers` by option content
mapping, not fixed labels.

## The STRIP-RWC pattern (19 questions)

All 19 follow one template: a plausible-sounding real-world anecdote or
statistic with no source — "UR technical support reports >50%…", "DHL
reported 30% improvement", "a major 3PL saw a 40% reduction", "a US meat
processor lost $200K", "a 2019 OSHA investigation found a fatality". Under
claims-policy these are bucket-none: named source or cut. The questions and
explanations stand on their own without them. Worst instance: **SF-5 asserts
a specific 2019 robot-cell fatality** — if that investigation isn't real and
citable, presenting it as fact is exactly the fabrication class the policy
exists to prevent.

## Per-question dispositions

### SAFETY_FUNDAMENTALS (25)

| ID | Verdict | Notes |
|---|---|---|
| SF-1 | KEEP | RWC qualitative (UR SSM practice) — fine |
| SF-2 | FIX + STRIP-RWC | Question invents "O2 (likely)" notation and a canonical "risk estimation matrix in ISO 12100" — the standard defines S/F/P elements, not an S×O matrix (the explanation itself says S/F/P, contradicting the question). Reframe. RWC: unsourced "tier-1 supplier deployment failure" anecdote |
| SF-3 | KEEP | |
| SF-4 | KEEP | RWC names DHL/GEODIS qualitatively — documented partnerships, optionally cite |
| SF-5 | STRIP-RWC | "2019 OSHA investigation… fatally injured" — cite the actual OSHA case or cut. Highest-priority strip in the file |
| SF-6 | KEEP | |
| SF-7 | KEEP | |
| SF-8 | KEEP | |
| SF-9 | KEEP | |
| SF-10 | KEEP | |
| SF-11 | KEEP | PL/SIL mapping correct incl. Annex K |
| SF-12 | STRIP-RWC | "has resulted in near-miss incidents" — unsourced |
| SF-13 | KEEP | |
| SF-14 | KEEP | ISO 13855 S=K×T+C correct |
| SF-15 | KEEP | |
| SF-16 | KEEP | |
| SF-17 | KEEP | |
| SF-18 | STRIP-RWC | "caused injuries in multiple UR installations" unsourced; Schmalz/Piab doc claim is checkable — cite or drop |
| SF-19 | KEEP | |
| SF-20 | KEEP | |
| SF-21 | KEEP | |
| SF-22 | VERIFY | BP/Woodside Spot deployments + ExRobotics are publicly documented — confirm and cite |
| SF-23 | KEEP | |
| SF-24 | KEEP | |
| SF-25 | KEEP | |

### ROBOT_BASICS (20)

| ID | Verdict | Notes |
|---|---|---|
| RB-1 | STRIP-RWC | "A major 3PL reported a 40% reduction in AMR stoppages" — unsourced stat |
| RB-2 | KEEP | |
| RB-3 | KEEP | ISO 9283 repeatability/accuracy distinction correct |
| RB-4 | KEEP | |
| RB-5 | KEEP | |
| RB-6 | HEDGE | "actual throughput typically 75-85% of theoretical" is an unsourced heuristic embedded in the correct option — reframe as a stated planning assumption in the scenario |
| RB-7 | KEEP | |
| RB-8 | HEDGE | Battery cycle-life/energy-density ranges are textbook-accurate but unsourced — attribute to "typical manufacturer datasheets" or cite |
| RB-9 | FIX | "invented by Harmonic Drive LLC" — strain wave gearing was invented by C. Walton Musser (1955); Harmonic Drive commercialized it. Correct the attribution |
| RB-10 | KEEP | |
| RB-11 | VERIFY | Spot actuator claim is hedged ("SEA-based or quasi-direct-drive") — verify or genericize to "many legged robots" |
| RB-12 | KEEP | |
| RB-13 | STRIP-RWC | "US meat processor experienced $200K in losses" — unsourced anecdote with dollar figure |
| RB-14 | KEEP | |
| RB-15 | KEEP | |
| RB-16 | KEEP | |
| RB-17 | STRIP-RWC | "DHL reported… 30% [throughput improvement]" — unsourced stat attributed to a named company (worst pattern); also hedge the 50-vs-20-robot assertion |
| RB-18 | KEEP | |
| RB-19 | VERIFY | Jetson AGX Orin 275 TOPS/60W matches NVIDIA specs — cite; hedge "Fetch uses Jetson-class" |
| RB-20 | KEEP | |

### DEPLOYMENT_FUNDAMENTALS (20)

| ID | Verdict | Notes |
|---|---|---|
| DF-1 | STRIP-RWC | "major 3PL… 15% fleet throughput reduction" — unsourced |
| DF-2 | KEEP | |
| DF-3 | STRIP-RWC + HEDGE | 6RS charger anecdote (20% drop) unsourced; "industry best practice 2:1-2.5:1" unsourced heuristic — the scenario math itself is fine |
| DF-4 | KEEP | |
| DF-5 | KEEP | RWC states generic manufacturer spec ranges — fine |
| DF-6 | KEEP | RWC "2-4 hours tuning" mild heuristic — acceptable |
| DF-7 | KEEP | |
| DF-8 | HEDGE | "can reduce cycle time by 20-40%" — soften or cite |
| DF-9 | STRIP-RWC | "UR application engineers report >30%…" — unsourced |
| DF-10 | STRIP-RWC | "10-15% increase in unplanned downtime" — unsourced |
| DF-11 | VERIFY | "UR recommends… deflection <0.1 mm" — verify against UR mounting documentation, else genericize |
| DF-12 | STRIP-RWC | "FANUC integrator reported 25% of first-year support calls" — unsourced |
| DF-13 | KEEP | |
| DF-14 | KEEP | |
| DF-15 | KEEP | |
| DF-16 | KEEP | |
| DF-17 | KEEP | |
| DF-18 | KEEP | |
| DF-19 | KEEP | Z-score math verified correct (P(Z>0.44)≈33%) |
| DF-20 | KEEP | |

### TROUBLESHOOTING_L1 (20)

| ID | Verdict | Notes |
|---|---|---|
| TS-1 | STRIP-RWC | "UR technical support reports >50%…" — unsourced |
| TS-2 | KEEP | |
| TS-3 | KEEP | |
| TS-4 | KEEP | |
| TS-5 | STRIP-RWC | "FANUC technical support reports… single most common" — unsourced |
| TS-6 | KEEP | |
| TS-7 | STRIP-RWC | Locus 35%-drop anecdote — unsourced |
| TS-8 | FIX | "fluorescent and some LED fixtures lose 30-50% output over 2-3 years" — overstated for LED (L70 ratings are typically 50,000 h). Correct or genericize to "lighting degrades over time" |
| TS-9 | KEEP | |
| TS-10 | STRIP-RWC | Microwave-oven anecdote asserted as a real deployment — reframe as an explicitly illustrative example |
| TS-11 | KEEP | |
| TS-12 | KEEP | |
| TS-13 | KEEP | |
| TS-14 | STRIP-RWC | "<0.1% per year" failure rate + "24-48 h on-site repair" — unsourced |
| TS-15 | KEEP | |
| TS-16 | KEEP | |
| TS-17 | KEEP | |
| TS-18 | KEEP | |
| TS-19 | STRIP-RWC | "5-15% false completion rates" — unsourced |
| TS-20 | STRIP-RWC | "ABB service engineers report… #1 cause" — unsourced |

### REGULATIONS_ETHICS (15)

| ID | Verdict | Notes |
|---|---|---|
| RE-1 | KEEP | Near-duplicate of v1 Q18 (OSHA responsibility) — see dedupe |
| RE-2 | KEEP | Borderline self-referential (mirrors our business model) but tests external FTC/media-ethics knowledge — compliant |
| RE-3 | FIX | RWC: "EU Parliament has passed regulations on algorithmic management in the workplace" — imprecise; the 2024 Platform Work Directive covers platform work, not all workplaces. Tighten. Amazon-criticism sentence is qualitative and documented — fine |
| RE-4 | KEEP | Option D is explicitly labeled fictional — good pattern |
| RE-5 | KEEP | Machinery Regulation 2023/1230 / Jan-2027 transition correct |
| RE-6 | KEEP | 8h/24h reporting per 1904.39 correct |
| RE-7 | VERIFY | EU AI Act high-risk worker-management classification correct; EEOC guidance existed — verify current status before citing |
| RE-8 | FIX | "currently the 2012 edition, with a revision in progress" — likely stale; ISO 10218:2025 published and the ANSI/A3 adoption may now be current. Verify and update |
| RE-9 | KEEP | German works-council RWC is generic/plausible — consider hedging |
| RE-10 | KEEP | |
| RE-11 | KEEP | Starship/Serve/Coco + NFB concerns are documented — optionally cite |
| RE-12 | KEEP | DoI vs DoC distinction correct |
| RE-13 | KEEP | |
| RE-14 | KEEP | |
| RE-15 | KEEP | |

## Dedupe vs. the 20 seeded v1 questions

14 conceptual overlaps (v1 topic → v2 equivalent): SSM→SF-1, safety-zone
elements→SF-6, LOTO→SF-5, monitored-stop/e-stop→SF-10, payload→RB-5,
DOF→RB-2, repeatability→RB-3, cobot definition→RB-18, SLAM→RB-14, harmonic
drive→RB-9, safety-inspection cadence→(DF-10 adjacent), risk-assessment
definition→DF-13, CE marking→RE-5, OSHA responsibility→**RE-1
(near-duplicate)**. The v2 versions are uniformly harder and better.

**Recommendation: replace, don't merge.** When v2 seeds, deactivate/delete
the 20 v1 rows in `rco_questions` (and retire
`lib/data/sample-exam-questions.ts` + the auto-seed path in
`app/api/certify/start/route.ts`). Coexistence would hand candidates 14
easier near-duplicates of harder v2 questions.

## Execution order for the rewrite pass (Phase 1 input)

1. SF-5 and the other 18 STRIP-RWC items (mechanical: cut or cite; the
   questions themselves don't change)
2. The 5 FIX items (small technical corrections)
3. The 4 HEDGE + 5 VERIFY items
4. Answer-key shuffle at seed time (structural, belongs in the seed script)
5. v1 retirement alongside the v2 seed
