# Learn Layer Build Report — 2026-08-10

Branch: `feat/learn-layer-20260810` (4 commits, pushed, NOT merged).
Constraints honored: no deploy, no migrations, no live-DB writes, no
production config changes, no Stripe/env changes, cert/exam code untouched.
Type-check, full production build (637 static pages), and the test suite
(16 tests) all pass on the branch head.

## Files created

**Data model**
- `lib/learn/glossary-types.ts`, `lib/learn/explainer-types.ts`
- `lib/learn/glossary-index.ts` (aggregation + A-Z bucketing)
- `lib/learn/explainers/index.ts` (registry)

**Glossary content (60 terms)**
- `lib/learn/glossary/robot-types-technical.ts` — 22 terms (8 robot types,
  14 technical concepts)
- `lib/learn/glossary/commercial.ts` — 18 terms
- `lib/learn/glossary/safety-standards.ts` — 20 terms

**Explainers (15 pieces, ~800-1500 words prose each)**
- `lib/learn/explainers/{what-is-raas, amr-vs-agv, what-is-a-cobot,
  how-to-read-a-robot-spec-sheet, robot-total-cost-of-ownership,
  buy-lease-or-raas, what-does-a-systems-integrator-do,
  robot-safety-standards-explained, robot-deployment-week-by-week,
  robot-maintenance-guide, robot-operator-certifications,
  how-to-run-a-robotics-pilot, sim-to-real-gap, warehouse-automation-path,
  construction-robotics-today}.ts`

**Pages & components**
- `app/(platform)/learn/glossary/page.tsx` (A-Z index, DefinedTermSet JSON-LD)
- `app/(platform)/learn/glossary/[slug]/page.tsx` (term pages, DefinedTerm
  JSON-LD, related terms, /explore links)
- `components/learn/explainer-article.tsx` (renderer: numbered section
  markers, mono uppercase labels, hairline rules, citations block,
  terms-in-this-guide, single next-step CTA)
- `components/learn/category-glossary-strip.tsx` (per-category glossary
  links on /explore/[category])

**Modified**
- `app/(platform)/learn/[category]/page.tsx` — now serves explainers at
  `/learn/[slug]` via a registry check before falling back to the category
  listing. Chosen because the existing `[category]` dynamic segment (with
  225 live MDX articles beneath it) cannot coexist with a second dynamic
  segment name at the same level; this preserves every existing URL.
- `app/(platform)/learn/page.tsx` — FIELD GUIDES + GLOSSARY sections.
- `components/layout/footer.tsx` — Learn + Glossary in Resources.
- `app/(platform)/explore/[category]/page.tsx` — glossary strip.
- `components/seo/json-ld.tsx` — ProductSchema/ReviewSchema stripped of
  score-derived ratings; DefinedTerm/DefinedTermSet/Article added.
- `app/(platform)/explore/[category]/[slug]/page.tsx` — removed a duplicate
  inline Product JSON-LD (which carried aggregateRating from RoboScore);
  the single remaining Product emission has name, brand, category, model,
  and offers-only-when-price-exists. No aggregateRating anywhere.
- `app/(platform)/best/[category]/page.tsx` — score prop removed from
  ProductSchema calls.

## Citations used (complete list)

Every citation names publisher and year; nothing else was cited.

| Source | Year | Where |
|---|---|---|
| ISO 10218-1:2025, ISO | 2025 | glossary; safety-standards explainer |
| ISO 10218-2:2025, ISO | 2025 | glossary; cobot, integrator, standards, deployment explainers |
| ISO/TS 15066:2016, ISO | 2016 | glossary; cobot + standards explainers |
| ISO 12100:2010, ISO | 2010 | glossary; standards + deployment explainers |
| ISO 13849-1:2023, ISO | 2023 | glossary; standards explainer |
| IEC 62061:2021, IEC | 2021 | glossary |
| ISO 13850:2015, ISO | 2015 | glossary; standards explainer |
| ISO 13855:2010, ISO | 2010 | glossary; standards explainer |
| ISO 14119:2013, ISO | 2013 | glossary; standards explainer (harmonized — see TODOs) |
| ANSI/RIA R15.06-2012, ANSI/RIA | 2012 | glossary; standards explainer |
| ISO 9283, ISO | 1998 | glossary (repeatability/accuracy); spec-sheet explainer |
| ISO 8373, ISO | 2021 | glossary (vocabulary: end effector, DOF) |
| IEC 60529, IEC | 2013 | spec-sheet explainer (IP ratings) |
| 29 CFR 1910.147, OSHA | 1989 | glossary (LOTO); maintenance + certifications explainers |
| 14 CFR Part 107, FAA | 2016 | certifications + construction explainers |
| Machinery Directive 2006/42/EC, EU | 2006 | glossary-adjacent; integrator explainer |
| VDA 5050, Verband der Automobilindustrie | 2022 | amr-vs-agv explainer |

## TODO(verify) log (5 items, all edition-year checks)

1. `lib/learn/glossary/safety-standards.ts` — ISO 14119 cited as 2013; a
   2024 second edition may supersede it.
2. `lib/learn/glossary/safety-standards.ts` — ANSI/RIA R15.06 cited as
   2012; a US adoption of ISO 10218:2025 may supersede it.
3. `lib/learn/explainers/robot-safety-standards-explained.ts` — same
   R15.06 edition question.
4. Same file — confirm current edition of ISO 13855 (2010 cited).
5. Same file — confirm current edition of ISO 14119 (2013 cited).

## Omissions (deliberate, per claims policy)

- All pricing/cost content is structural only: RaaS pricing models, TCO
  categories, and lease/finance tradeoffs are described with zero dollar
  figures, rates, or example numbers.
- No adoption statistics, market sizes, projections, salary figures, or
  incident-reduction stats anywhere — including the certification
  explainer, which makes no outcome/placement/demand claims for the
  platform's own program.
- Construction explainer describes eight documented deployment CLASSES
  (layout printing, 3D-printed concrete, earthmoving retrofits, rebar
  tying, overhead drilling, drywall finishing, quadruped site capture,
  drone survey) with zero vendor names and zero metrics, and states
  plainly that general-purpose construction labor is not deployable.
- No vendor or customer names in any glossary definition; the few
  qualitative company mentions elsewhere were removed during the lint
  pass rather than flagged.
- A claims-lint sweep (dollar/percent/multiplier/salary/"studies show"/
  "most buyers"/RoboScore/ranking patterns) runs clean over all new
  content; four soft "most buyers/deployments" generalizations found in
  drafts were rewritten to non-quantified phrasing.
- Kept: `robowork/providers/[slug]` aggregateRating — it is computed from
  real user reviews with a real reviewCount (conditional on reviews
  existing), not from RoboScore, and robot pages were the scope. Flagging
  for awareness.

## Remaining gaps / follow-ups

- The 225 pre-existing MDX articles under `content/learn/` were NOT
  audited against the claims policy this session — unknown compliance
  status, recommend a Tier pass like the ones run on lib/data.
- Explainer prose links glossary terms via a "terms in this guide" block
  rather than inline anchors; inline auto-linking is a possible
  enhancement.
- Glossary strips cover 11 of the /explore categories; underwater, space,
  software, eldercare have no mapping yet.
- The /learn index still shows the legacy "RoboLearn" hero styling above
  the new numbered sections; a full DESIGN.md restyle of the legacy learn
  surfaces was out of scope.
- readTime values assume ~200 wpm.
