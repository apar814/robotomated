# Tier-2 Claims Cleanup — Overnight Report (2026-08-03)

Branch: `chore/claims-tier2-20260803` (local only — not pushed, no deploy, no
migrations, per instruction). Policy: docs/claims-policy.md.

---

## Part 1 — case-studies.ts (DONE, committed `e4b5b63`)

### Actions taken

**Schema:** added `sources?: {label,url}[]` (rendered as a Sources section on
detail pages) and `illustrative?: boolean` (rendered as a visible badge on
both the listing and detail pages: "Illustrative example — not a specific
customer").

**Real companies — metrics reduced to sourced/company-stated facts:**

| Entry | Disposition |
|---|---|
| Ocado | Kept. Cited Tech Insider video + Grocery Dive. **Corrected a fabricated metric: "65 orders/second" was a distortion of the reported ~65,000 orders/week per warehouse.** Stripped: 99.5% accuracy, 5-min fulfillment, 50% footprint, "750K orders/week", 3-4yr payback. Tim Steiner quote removed — no verbatim public source found. |
| Starship | Kept, upgraded to primary sources (3 official press releases). Updated to **8M+ deliveries** (was 5M+), 2,000+ robots, 7M+ miles — all officially stated. Stripped: $1.99 fee, 98% on-time, 70% adoption, 12-18mo payback, anonymous dining-director quote. |
| Built Robotics | Kept. Cited official technology/trenching pages for the retrofit concept and solar focus. Stripped: 30% productivity, zero incidents, 1:5 supervision ratio, 2cm claim, 6-12mo payback, anonymous EPC quote. |
| Iron Ox | **Reframed honestly.** The company laid off ~half its staff in 2022 (AgFunderNews, cited) — presenting it as a clean success was misleading. Now framed as ambition + hard economics, water-savings kept as a company-stated claim (CNBC, cited). Stripped: 30x productivity, 90% labor reduction, 40% yield-from-AI, "500K plant observations". |

**Invented/anonymized companies — converted to labeled illustrative composites:**

| Entry | Disposition |
|---|---|
| "Multi-Hospital Network (US)" (da Vinci) | Illustrative. **All clinical outcome claims stripped** (40% complications in the title, 52% readmissions, 1.8-day stays, invented "Chief of Surgery" quote). Title now "How Health Systems Deploy da Vinci Surgical Robots". Lesson added: clinical outcome claims belong to peer-reviewed literature. |
| "Precision Parts Inc. (Anonymized)" (UR10e) | Illustrative. Stripped 92% defects, $380K savings, 7-month payback, owner quote, invented financials. |
| "Pacific Coast Hotels" | Illustrative. Stripped +18% satisfaction, $340K savings, 12-min delivery, VP quote. **Fixed factual error: Savioke became Relay Robotics, not Bear Robotics.** |
| "TechPark Management Group" | Illustrative. Stripped 35% cost cut, +280% detection, -67% incidents, $2.8M budget, director quote. |

**Quotes removed: 6 of 6** — none had a named person + named company + public
source.

### Finding worth attention: citogenesis in progress
While researching Ocado, the **#2 web search result was
robotomated.com's own case-study page** carrying the fabricated numbers. Our
invented stats are indexed and positioned to be cited by others. This makes
the Tier-2 cleanup time-sensitive: the longer fabricated numbers stay live,
the more likely they get quoted externally and become "sources."

---

## Part 2 — industry-types.ts disposition list (NO CHANGES MADE — awaiting review)

Structure: 7 industries × (3 `marketStats` + 3 mini case studies × 3 metrics).
The mini case studies name **real companies** (DHL, Ocado, Mayo Clinic, BMW,
Driscoll's, ICON, Zipline, Nuro, Microsoft, Prologis, Westfield…) with precise
unsourced metrics — the exact liability class just fixed in case-studies.ts.

Dispositions: **SOURCE** (likely findable — verify + cite before keeping),
**STRIP** (no plausible source / duplicates a RETIRED claim), **SOFTEN**
(replace precision with qualitative capability statement).

### marketStats (21)

| Line | Stat | Disposition |
|---|---|---|
| 62 | Labor Cost Reduction 40-65% | STRIP — no source; range invented |
| 63 | ROI Payback 18 mo | STRIP |
| 64 | Order Accuracy 99.5% | STRIP — vendor-marketing number |
| 151 | Fewer Complications 40% | **STRIP — clinical claim, same family as RETIRED medical claims** |
| 152 | Procedures 2.4M/yr robot-assisted | SOURCE — Intuitive publishes annual procedure counts (~2.2M+ in recent investor materials) |
| 153 | 12 robots per major center | STRIP |
| 240 | Productivity Gain 30-50% | STRIP |
| 241 | Cobot Payback 7 mo | STRIP (vendor-ish; UR cites ~12mo averages — verify or strip) |
| 242 | Defect Reduction 92% | STRIP — was the fabricated Precision Parts number, now recycled here |
| 329 | Water Reduction 90% | STRIP — Iron Ox marketing claim generalized to the whole industry |
| 330 | Harvest Speed 3x | STRIP |
| 331 | Labor Cost Reduction 60% | STRIP |
| 416 | Faster Completion 30% | STRIP |
| 417 | Injury Rate Zero | STRIP — absolute safety claim |
| 418 | Cost Reduction 25% | STRIP |
| 505 | Deliveries Tracked 5M+ | SOURCE — recast as "8M+ (Starship alone, official press)" |
| 506 | Flat Fee $1.99 | STRIP |
| 507 | On-Time 98% | STRIP |
| 592 | Patrol 24/7 | KEEP — capability fact, not a claim |
| 593 | Cost vs Guards 60% lower | STRIP |
| 594 | Threat Detection 0.3s | STRIP |

### Mini case studies (21 entries × 3 metrics — grouped disposition)

| Industry | Companies | Disposition |
|---|---|---|
| Warehouse | DHL, Ocado, GEODIS | SOURCE — DHL publishes robotics case studies (Locus partnership: productivity claims exist in DHL press); Ocado 220K orders/week needs verification (their CFC figures are public); GEODIS/Locus has published pilots. Strip whatever isn't found. |
| Medical | Mayo Clinic, Mass General, Westchester | **STRIP metrics or find peer-reviewed sources — clinical outcomes (35% complication drop, HAI 50-70%, $1.2M savings) attributed to named hospitals without citation is the highest-liability content in the file.** Westchester's TUG robot deployment and UV disinfection programs are real and documented; the outcome numbers are not. |
| Manufacturing | BMW Spartanburg, Voodoo Mfg, Flex | SOURCE — BMW Spartanburg automation is heavily documented (though "500+ vehicles/shift, 99.7% weld quality" need verification); Voodoo's robot-operated 3D printing was covered by press (Fast Company etc.); Flex is generic. |
| Agricultural | Driscoll's, Bowles Farming, Gallo | SOURCE-or-STRIP — Bowles' use of FarmWise/See & Spray had press coverage; Driscoll's harvest-robotics pilots were reported without these specific numbers ("95% of ripe berries" unlikely findable). Gallo drone program: coverage exists, "$320K chemical savings" does not. |
| Construction | ICON, Built Robotics, Skanska | SOURCE — ICON's build times and 100+ homes are publicly documented (verify exact figures); Built Robotics now has citations in case-studies.ts to reuse; Skanska drone survey stats ("$2.1M rework savings") unlikely — strip. |
| Delivery | Starship, Zipline, Nuro | SOURCE — best candidates in the file. Starship: cite the press releases already in case-studies.ts. Zipline: 500K+ deliveries and blood-waste reduction (~67% in Rwanda) are documented in press/The Lancet-adjacent studies — verify and cite. Nuro: "$2-4/delivery, 4.8/5" — strip unless found. |
| Security | Microsoft campus, Prologis, Westfield | STRIP-or-SOURCE — Knightscope has published customer anecdotes; "65% cost reduction / 4x coverage" attributed to Microsoft without source must strip. Westfield K5 deployments were reported (2016-era); metrics weren't. |

**Recommended treatment pattern** (mirrors case-studies fix): add optional
`source` per metric; metrics that get a citation keep numbers; the rest become
qualitative ("Reduced walking time", no number); duplicated RETIRED claims go
entirely.

---

## Part 3 — problems.ts disposition list (NO CHANGES MADE — awaiting review)

242 stats; 121 already carry `source:` (the `roi.stats` blocks — compliant).
The unsourced half is `trends.points` (4 per problem page × ~10 pages) plus
scattered `automationSolution` numbers. Full disposition of the trends stats:

### Sourceable — verify the number, then add source field (likely real, named source exists)

| Line | Stat | Likely source |
|---|---|---|
| 98 | 500K+ unfilled warehouse positions | BLS JOLTS — verify current figure |
| 101 | 4.5M warehouse workers by 2030 | Attributed to McKinsey in text — locate the report |
| 205 | $3.1T annual cost of poor quality | ASQ — real, commonly cited ASQ figure |
| 311 | 500K nursing shortage by 2030 | HRSA/AACN projections — real family of figures |
| 363 | 300K+ unfilled ag positions | AFBF/USDA — verify |
| 416 | 30-40% of food lost field-to-table | FAO — real, widely cited |
| 469 | 500K+ construction workers needed | Attributed to ABC in text — ABC publishes this annually; verify year |
| 470 | 41% of firms turned down work | AGC workforce survey — real survey family; verify year/number |
| 522 | 2.8M nonfatal workplace injuries | BLS — real |
| 523 | $170B annual injury cost | NSC — real family (NSC says ~$167B; round or cite exactly) |
| 524 | 33% of mfg injuries overexertion/repetitive | BLS/NSC — verify |
| 525 | 5,486 workers killed (says 2023) | **BLS — but 5,486 is the 2022 figure; 2023 was 5,283. Fix year or number.** |

### Strip — invented, unverifiable, or internally contradictory

| Line | Stat | Reason |
|---|---|---|
| 45 | 28% warehouse wage increase since 2020 | No source; suspiciously precise |
| 46 | 100%+ turnover, $5-8K replacement cost | Turnover figure plausible but unsourced; cost invented |
| 47 | 49% say labor is largest cost | Invented survey result |
| 48 | $22/hr fully-loaded, up from $17 | Invented precision |
| 99 | 35% can't fill within 30 days | Invented survey result |
| 100 | 270% e-commerce growth since 2019 | Wrong — US e-commerce grew far less; strip or correct to a Census figure |
| 152 | 69% switch for faster delivery | Unsourced consumer-survey claim |
| 153 | 2-4x throughput gap | Plausible but unsourced |
| 154 | $15B lost revenue from delays | Invented |
| 151 | 80% expect same/next-day (vs 53% in 2020) | Unsourced survey claim |
| 204 | 2-5% manual defect rate, 3-10x cost | Unsourced |
| 206 | 85% of quality issues = process variability | Unsourced |
| 207 | 47% increase in recalls since 2019 | Unsourced |
| 257 | 10-25% traditional complication rates | **Clinical — peer-reviewed or nothing** |
| 258 | 30-50% complication reduction robotic | **Clinical — this is the RETIRED claim's cousin; strip unless a specific meta-analysis is cited** |
| 259 | 21% shorter stays | **Clinical — same treatment** |
| 260 | $5.6B preventable complications cost | Unsourced |
| 310 | 30% of nursing time non-clinical | Plausible family (studies exist) — SOURCE-or-strip |
| 312 | $1.1M transport cost per 200-bed hospital | Invented |
| 313 | 15% of medication errors from transport | Unsourced clinical-adjacent |
| 364 | Avg US farm worker age 56 | Wrong framing — USDA's ~58 figure is farm *operators*; workers skew younger. Fix or strip |
| 365 | $50B annual crop losses from labor shortage | **Contradicts line 419's $230B — both can't stand; strip both or source one** |
| 366 | 40% decline in H-2A applicant pool | **Likely false direction — H-2A certifications have grown substantially since 2019. Strip.** |
| 417 | 25% preventable pest/disease losses | Unsourced |
| 418 | 15% post-harvest handling loss | Plausible FAO family — SOURCE-or-strip |
| 419 | $230B crop losses (US) | See line 365 contradiction |
| 471 | 45% trade-school enrollment decline | Unsourced |
| 472 | $216B projects delayed | Invented |

### Summary counts
- problems.ts trends stats: **12 sourceable / ~29 strip-or-verify**, plus 3
  internal-consistency bugs (fatality year, crop-loss contradiction, H-2A
  direction).
- industry-types.ts: **~15 of 21 marketStats strip**, mini-case metrics
  roughly half sourceable with real research effort (DHL, Zipline, ICON, BMW,
  Starship strongest), half strip.

### Suggested execution order after your review
1. problems.ts named-hospital/clinical strips (same-day, low effort, highest risk)
2. industry-types medical + security strips
3. Research pass for the SOURCE-marked items (Zipline, ICON, DHL, Intuitive
   procedure counts, BLS/NSC/FAO/ABC/AGC verifications)
4. Re-run the claims inventory to confirm Tier-2 is clear
