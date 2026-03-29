/**
 * Industry data re-export.
 *
 * All comprehensive industry data lives in `industry-types.ts`.
 * This module provides convenience accessors and summary data
 * for use in components that need industry metadata without
 * the full robot-classification machinery.
 */

export {
  INDUSTRIES,
  getAllIndustries,
  getAllIndustrySlugs,
  getIndustry,
  type IndustryConfig,
  type RobotType,
  type CaseStudy,
  type ComplianceItem,
} from "./industry-types";

/** All industry slugs in display order */
export const INDUSTRY_SLUGS = [
  "warehouse-robotics",
  "medical-robotics",
  "manufacturing-robotics",
  "agricultural-robotics",
  "construction-robotics",
  "delivery-robotics",
  "security-robotics",
  "hospitality-robotics",
  "eldercare-robotics",
] as const;

export type IndustrySlug = (typeof INDUSTRY_SLUGS)[number];

/** Lightweight industry summary for listing UIs */
export interface IndustrySummary {
  slug: string;
  name: string;
  icon: string;
  shortDescription: string;
  marketSize: string;
  useCaseCount: number;
  caseStudyCount: number;
}

export function getIndustrySummaries(): IndustrySummary[] {
  // Use the re-exported INDUSTRIES from above
  const allIndustries = getAllIndustries();

  return allIndustries.map((ind) => ({
    slug: ind.slug,
    name: ind.name,
    icon: ind.icon,
    shortDescription: ind.shortDescription,
    marketSize: ind.marketStats[0]?.value || "N/A",
    useCaseCount: ind.types.length,
    caseStudyCount: ind.caseStudies.length,
  }));
}
