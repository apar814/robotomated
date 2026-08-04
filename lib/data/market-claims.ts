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
