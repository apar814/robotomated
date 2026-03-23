import type { RoboScoreBreakdown } from "@/lib/supabase/types";

export const DIMENSIONS = [
  { key: "performance" as const, label: "Performance", weight: 0.25, description: "Speed, accuracy, throughput, task completion rate" },
  { key: "reliability" as const, label: "Reliability", weight: 0.20, description: "Uptime, MTBF, build quality, warranty coverage" },
  { key: "ease_of_use" as const, label: "Ease of Use", weight: 0.15, description: "Setup time, learning curve, documentation, UX quality" },
  { key: "intelligence" as const, label: "Intelligence", weight: 0.15, description: "Autonomy level, sensor fusion, decision-making capability" },
  { key: "value" as const, label: "Value", weight: 0.10, description: "Price-to-capability ratio, TCO, ROI timeline" },
  { key: "ecosystem" as const, label: "Ecosystem", weight: 0.08, description: "Integrations, accessories, community, vendor support" },
  { key: "safety" as const, label: "Safety", weight: 0.05, description: "Certifications, collision avoidance, fail-safes" },
  { key: "design" as const, label: "Design", weight: 0.02, description: "Industrial design, ergonomics, form factor" },
] as const;

/**
 * Calculate weighted RoboScore from dimension scores (each 0–100).
 * Returns a score from 0–100.
 */
export function calculateRoboScore(breakdown: RoboScoreBreakdown): number {
  let total = 0;
  for (const dim of DIMENSIONS) {
    const score = breakdown[dim.key];
    if (typeof score !== "number" || score < 0 || score > 100) {
      throw new Error(`Invalid score for ${dim.key}: ${score}`);
    }
    total += score * dim.weight;
  }
  return Math.round(total * 10) / 10; // Round to 1 decimal
}

/**
 * Convert a 1–5 star rating to a 0–100 RoboScore equivalent.
 */
export function starsToScore(stars: number): number {
  return Math.round(((stars - 1) / 4) * 100 * 10) / 10;
}

/**
 * Convert a 0–100 RoboScore to a 1–5 star equivalent.
 */
export function scoreToStars(score: number): number {
  return Math.round(((score / 100) * 4 + 1) * 10) / 10;
}

/**
 * Calculate weighted average of expert and community scores.
 * Expert reviews count 3x more than community reviews.
 */
export function aggregateScores(
  expertScores: number[],
  communityScores: number[]
): number | null {
  if (expertScores.length === 0 && communityScores.length === 0) return null;

  const expertWeight = 3;
  const communityWeight = 1;

  const expertSum = expertScores.reduce((a, b) => a + b, 0) * expertWeight;
  const communitySum = communityScores.reduce((a, b) => a + b, 0) * communityWeight;
  const totalWeight = expertScores.length * expertWeight + communityScores.length * communityWeight;

  if (totalWeight === 0) return null;
  return Math.round(((expertSum + communitySum) / totalWeight) * 10) / 10;
}
