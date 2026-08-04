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
