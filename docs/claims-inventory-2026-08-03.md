# Claims Inventory — 2026-08-03

Point-in-time audit of bare percentages and dollar figures in user-facing copy
across `app/` and `lib/`, per docs/claims-policy.md. **Nothing here has been
fixed** — this is the remaining backlog after cleanup rounds 1–2, ranked by
risk. Grep noise (SVG coordinates, CSS percentages, `width="34%"`) excluded.

## Tier 1 — earnings & outcome claims about our own product (highest risk)

These claim measurable outcomes of RCO certification with no data behind them.
Same category as the retired +34%/40% claims; they survived only because they
were out of scope for rounds 1–2.

| Location | Claim |
|---|---|
| `app/(platform)/certify/why-certify/page.tsx` SALARY_DATA | Per-level "avg increase" ranges: $8K–15K, $20K–35K, $40K–80K, $60K–150K |
| `app/(platform)/certify/why-certify/page.tsx` EMPLOYER_TRENDS | Invented adoption curve presented as data: 12% (2025) → 25% → 45% → 60% → 80%+ (2030) |
| `app/(platform)/certify/page.tsx` specialty tracks (~line 600) | "80% salary premium", "40% salary premium" badges per track |
| `lib/certifications.ts` `salaryBump` field | Salary ranges per level ("$42K–58K entry roles", etc.) — rendered across certify pages |
| `app/(platform)/certify/employer/page.tsx` ROI_STATS | "2.3x faster deployment" was retired in round 2; verify no residue elsewhere |
| `app/(platform)/certification/operator-level-1/page.tsx` | 5 percentage + 5 dollar hits — likely same salary/outcome family; needs read |

## Tier 2 — unsourced industry performance stats (high risk, high volume)

| Location | Character |
|---|---|
| `lib/data/industry-types.ts` (74 pct + 33 dollar hits) | Dense unsourced performance claims on industry pages: "40-65% labor cost reduction", "99.5% order accuracy", "2.5x productivity", per-company mini case studies (Ocado 220K orders/week, "3x peak throughput") — no source fields at all |
| `lib/data/case-studies.ts` (53 + 22) | Real named companies (Ocado…) with specific metrics, payback periods, and **quote fields (testimonials with named-sounding roles)** — no source fields; if drawn from public reporting, needs per-metric attribution; quotes need real attribution or removal |
| `lib/data/problems.ts` | 242 stat labels but only 121 `source:` fields — roughly half the entries (mostly `trends.points` like "2.8M injuries", "$170B annual cost") are unsourced; the `roi.stats` half is the sourced, compliant half |
| `lib/categories/content.ts` (remaining after medical fix) | Non-medical unsourced stats remain: "300% avg labor savings", "85% defect reduction", "90% cost drop", "-80% cost vs manned", "300% coverage increase", "40% labor savings / 15% yield" (agriculture), FAQ ROI claims |

## Tier 3 — exam & education content teaching unsourced numbers (medium)

| Location | Character |
|---|---|
| `lib/data/rco-questions-trends.ts` (77 hits) | Mostly hypothetical scenarios (fine — clearly framed as scenarios), but several explanations assert real-world stats as fact, e.g. "digital twin predictive maintenance has demonstrated 30-40% reduction in unplanned downtime" — unsourced teaching content |
| `lib/certify/trend-modules.ts`, `lib/data/rco-questions-commander.ts` | Same pattern, smaller volume ("Applied Materials showed 34% improvement" — named but unverified attribution) |
| `docs/rco-curriculum-v2.md` | Curriculum references market sizes; partially annotated in round 1 |

## Tier 4 — market/pricing figures on product pages (medium-low)

| Location | Character |
|---|---|
| `app/(platform)/eldercare/page.tsx`, `cleaning-robots`, `tools/robot-economics`, `lease/*`, `insure`, `parts`, `humanoid-comparison`, `robowork/*` | ROI examples, price points, market figures embedded in page copy — mixture of checkable pricing facts and unsourced projections; each page needs a 10-minute pass |
| `app/(platform)/intelligence/page.tsx`, `lib/intelligence/seed-data.ts` | Seed/fallback news items summarizing real articles — verifiable but no source_url per stat |
| `app/api/og/robot/[slug]/route.tsx` | Percentages in OG image generation — likely RoboScore-derived (bucket 2, compliant); verify |

## Tier 5 — compliant or low risk (for completeness)

| Location | Why acceptable |
|---|---|
| `lib/data/news.ts` | Every article has `source` + `sourceUrl` |
| `lib/data/sample-reports.ts` | Named sources (IFR, MarketsandMarkets…), explicitly sample/fallback data — but `source_url: null` throughout; add URLs when convenient |
| `lib/data/funding-data.ts` | Funding rounds are checkable public facts; low risk, no source fields though |
| `lib/data/market-claims.ts` | The policy module itself |
| `app/(platform)/newsletter/newsletter-client.tsx` | 73 "%" hits are almost all SVG gradient/coordinate attributes — grep noise |
| `lib/images/image-registry.ts` | Positioning metadata, not claims |

## Suggested order of attack

1. Tier 1 in one pass (same treatment as rounds 1–2; certify funnel is where
   money changes hands, so legal exposure is highest).
2. `industry-types.ts` + `case-studies.ts` (decide: source from public
   reporting with per-metric attributions, or convert to labeled illustrative).
3. Backfill `source` fields for the unsourced half of `problems.ts`.
4. Exam trend content: reframe asserted stats as scenario assumptions.
5. Tier 4 page-by-page passes, lowest priority.
