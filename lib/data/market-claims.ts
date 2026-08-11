/**
 * Market-level claims used across marketing surfaces.
 *
 * Pattern follows lib/data/problems.ts `roi.stats`: every entry REQUIRES a
 * `source` field. A claim without a verified source must carry a TODO in its
 * source string and must not be presented as an established fact or a point
 * estimate in UI copy.
 *
 * Editorial independence is the moat (CLAUDE.md). Never add a stat here
 * without attribution you could defend to a reader.
 */

export interface MarketClaim {
  label: string;
  value: string;
  source: string;
}

/*
 * ═══════════════════════════════════════════════════════════════════
 * RETIRED CLAIMS — do not reintroduce without a verifiable source.
 * Each was removed from user-facing copy because no citation exists.
 * ═══════════════════════════════════════════════════════════════════
 *
 * "+34% higher earnings for RCO holders on RoboWork"
 *   Retired 2026-08-03. No data exists — the platform has not measured
 *   operator earnings. Was on: opportunity-banner, certification-section,
 *   level-0 exam (l0-d4-03).
 *
 * "73% incident reduction with certified operators"
 *   Retired 2026-08-03. Point estimate had no source, and no study ties
 *   incident reduction to RCO certification specifically. Superseded by
 *   incidentReduction (40-70%, FANUC — measures automation, not
 *   certification). Was on: opportunity-banner, certification-section,
 *   certify pages, fleet page, a testimonial, level-0 exam (l0-d4-05).
 *
 * "40% more jobs earned by RCO certified RSPs on Robotomated"
 *   Retired 2026-08-03. No marketplace data measures this. Was on:
 *   certify/employer, certify main page.
 *
 * "2.3x faster robot deployment with trained teams" /
 * "$18K average savings per incident avoided annually"
 *   Retired 2026-08-03. Invented ROI figures, no source.
 *   Was on: certify/employer ROI stats.
 *
 * "73% complication reduction" / "60% avg stay reduction" /
 * "$22B market by 2030" (medical category)
 *   Retired 2026-08-03. Unsourced clinical-outcome and market claims.
 *   Was in: lib/categories/content.ts medical stats. Clinical claims are
 *   highest-risk — never reintroduce without peer-reviewed sourcing.
 *
 * Unattributed testimonials (3, /certify/why-certify)
 *   Removed 2026-08-03. Quotes from unnamed companies with no attribution
 *   are indistinguishable from fabrication. Replaced with program facts.
 *
 * ── Tier-1 certify pass (2026-08-03, pre-push) ──
 *
 * SALARY_DATA — per-level "avg increase" $8K-15K / $20K-35K / $40K-80K /
 * $60K-150K (/certify/why-certify "Salary Impact by Level")
 *   Removed with its section. No salary data exists; "based on industry
 *   salary data" was false.
 *
 * EMPLOYER_TRENDS — 12%→25%→45%→60%→80%+ adoption curve 2025-2030
 * (/certify/why-certify "Where Employer Requirements Are Heading")
 *   Removed with its section. Invented forecast rendered as a data chart.
 *
 * salaryBump config field — "$42K-58K entry roles" ... "Executive tier"
 * (lib/certifications.ts, rendered on /certify and /certify/[level])
 *   Field deleted from schema and all 6 levels. No source.
 *
 * "60% / 80% / 40% salary premium" — specialty track badges (/certify)
 *   Replaced with track coverage (domains/scope). Invented premiums for
 *   tracks that don't exist yet.
 *
 * "The average RCO Master earns $40,000 more per year ... pays for itself
 * in 11 days ... most students complete in 14 weeks" (/certify ROI headline)
 *   Removed. Invented earnings + completion stats for a new program.
 *
 * CertificationRoiCalculator + AVG_INCREASE ($12K/$27K/$55K/$100K)
 * (components/certify/roi-calculator.tsx, rendered on /certify "Your ROI")
 *   Component deleted with its section. An interactive projector of
 *   invented per-level salary increases.
 *
 * "field growing 25% year-over-year" (/certify/why-certify hero)
 *   Softened to "fast-growing" — growth figure had no source.
 *
 * "$45-75K starting salary" — operator-level-1 (metadata, OG, hero,
 * stats card, salary FAQ)
 *   Removed 2026-08-03. Unsourced range presented as a program outcome;
 *   the FAQ's BLS growth attribution was itself unverified.
 *   2026-08-10: three surviving instances removed — employer page stats card
 *   (/employers/hire-certified-operators), the day-7 student email
 *   (lib/email/templates/workforce.ts), and the homepage announcement banner
 *   (components/home/workforce-announcement.tsx).
 *
 * careerImpact numeric claims (lib/certify/trend-modules.ts, rendered on
 * /certify/future-of-robotics): "60% salary premium", "80% salary premium",
 * "deploy robots 5x faster", "$15-25K to annual salary", "reduces
 * maintenance costs by 40-60%", "$150K+ salaries"
 *   Removed 2026-08-10. Same family as the retired specialty-track premiums;
 *   softened to qualitative capability statements.
 *
 * "The Elon Test" fabricated quote (/certify/cro)
 *   Removed 2026-08-03. Invented quote attached to a real named person.
 *   Section renamed [THE STANDARD]; factual CRO requirements retained.
 *
 * ── RoboScore honesty pass (2026-08-10) ──
 *
 * "run benchmarks where possible, and collect real-world usage data from
 * operators and owners" (/methodology, Process step 1)
 *   Removed 2026-08-10. Neither pipeline exists — scores are editorial
 *   judgments from manufacturer specs and documented public sources.
 *   Do not reintroduce unless a real benchmark/usage-data program ships.
 *
 * ── Foundation exam bank pass (2026-08-10) ──
 *
 * real_world_context stats/anecdotes (19 questions,
 * lib/data/rco-questions-foundation.ts): claimed 2019 OSHA robot-cell
 * fatality; "UR support reports >50%"; "DHL reported 30% improvement";
 * "$200K meat-processor losses"; anonymous 3PL/6RS/Locus throughput
 * anecdotes with percentages; "<0.1%/yr" failure rate; assorted
 * "X% of support calls / integrations / false completions" figures
 *   Removed 2026-08-10. Unsourced real-world claims presented as fact in
 *   exam teaching content (claims-policy Tier-3). Do not reintroduce
 *   incident narratives or vendor-attributed statistics into exam content
 *   without a named, checkable source. Full log:
 *   docs/rco-foundation-question-audit.md
 *
 * v1 sample exam bank (lib/data/sample-exam-questions.ts, 20 questions)
 *   Retired 2026-08-10 in code (file deleted, auto-seed removed from
 *   /api/certify/start). The 20 DB rows remain the live pool ONLY until
 *   the Phase-1 seed script swaps in the audited v2 bank — they must be
 *   deactivated in that same seed run. 14 conceptual overlaps with v2.
 */
export const MARKET_CLAIMS: Record<string, MarketClaim> = {
  marketProjection: {
    label: "Projected robotics market",
    value: "$24T",
    // TODO: UNVERIFIED. App copy attributes this figure to ARK Invest
    // (see app/(platform)/humanoid/page.tsx timeline), but the original
    // publication has not been confirmed, and in-app horizons conflict
    // (about page said 2035, homepage said 2040). Locate the primary
    // source before attaching a year or presenting this as fact.
    source:
      "TODO: unverified — attributed to ARK Invest in app copy; confirm original publication and horizon year",
  },
  incidentReduction: {
    label: "Lost-time incident reduction in automated deployments",
    value: "40-70%",
    // Mirrors lib/data/problems.ts (workplace-safety-incidents roi.stats).
    // NOTE: this range describes automation deployments, NOT certified
    // operators specifically. Copy that uses it must not imply the source
    // measured operator certification.
    source: "FANUC palletizing deployment data",
  },
};
