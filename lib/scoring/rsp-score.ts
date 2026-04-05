export interface RSPScoreBreakdown {
  reviewScore: number;       // 0-5, from reviews average
  completionRate: number;    // 0-100%, jobs completed vs accepted
  responseTime: number;      // 0-100, faster = higher
  verificationBonus: number; // 0-20, based on verification_tier
  repeatRate: number;        // 0-100%, would_hire_again percentage
  overall: number;           // 0-5 weighted average
}

/**
 * Calculate RSP Score from provider metrics.
 *
 * Weights:
 *   reviewScore      40%
 *   completionRate   20%
 *   responseTime     15%
 *   verificationBonus 10%
 *   repeatRate       15%
 *
 * Each component is normalised to 0-1 before weighting,
 * then the weighted sum is mapped to a 0-5 overall score.
 */
export function calculateRSPScore(params: {
  reviews: { rating: number; would_hire_again: boolean }[];
  completedJobs: number;
  totalAcceptedJobs: number;
  responseTimeHours: number;
  verificationTier: number;
}): RSPScoreBreakdown {
  const { reviews, completedJobs, totalAcceptedJobs, responseTimeHours, verificationTier } = params;

  // --- reviewScore: average rating (0-5) ---
  const reviewScore =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  // --- completionRate: 0-100% ---
  const completionRate =
    totalAcceptedJobs > 0
      ? (completedJobs / totalAcceptedJobs) * 100
      : 0;

  // --- responseTime: 0-100 (under 1hr ≈ 90+, over 10hr = 0) ---
  const responseTime = Math.max(0, 100 - responseTimeHours * 10);

  // --- verificationBonus: tier * 5, capped at 20 ---
  const verificationBonus = Math.min(verificationTier * 5, 20);

  // --- repeatRate: % of reviews with would_hire_again ---
  const repeatRate =
    reviews.length > 0
      ? (reviews.filter((r) => r.would_hire_again).length / reviews.length) * 100
      : 0;

  // --- overall: weighted average mapped to 0-5 ---
  // Normalise each component to 0-1 first:
  //   reviewScore      / 5     → 0-1
  //   completionRate   / 100   → 0-1
  //   responseTime     / 100   → 0-1
  //   verificationBonus / 20   → 0-1
  //   repeatRate       / 100   → 0-1
  const weighted =
    (reviewScore / 5) * 0.4 +
    (completionRate / 100) * 0.2 +
    (responseTime / 100) * 0.15 +
    (verificationBonus / 20) * 0.1 +
    (repeatRate / 100) * 0.15;

  const overall = Math.round(weighted * 5 * 100) / 100; // 0-5, 2 decimals

  return {
    reviewScore: Math.round(reviewScore * 100) / 100,
    completionRate: Math.round(completionRate * 100) / 100,
    responseTime: Math.round(responseTime * 100) / 100,
    verificationBonus,
    repeatRate: Math.round(repeatRate * 100) / 100,
    overall,
  };
}
