/**
 * Glossary data model. Content rules (docs/claims-policy.md):
 * definitions are capability/standards facts only — no market stats,
 * no performance percentages, no dollar figures, no vendor rankings.
 * Standards citations name the publisher and edition year.
 */

export type GlossaryGroup =
  | "robot-types"
  | "technical"
  | "commercial"
  | "safety-standards";

export interface GlossaryCitation {
  /** e.g. "ISO 10218-1:2025, International Organization for Standardization" */
  source: string;
  year: string;
}

export interface GlossaryTerm {
  slug: string;
  term: string;
  /** 2-4 sentence definition, plain prose, sentence case */
  definition: string;
  citation?: GlossaryCitation;
  /** slugs of related glossary terms */
  related: string[];
  /** links into /explore or other product surfaces */
  explore?: { label: string; href: string }[];
  group: GlossaryGroup;
}

export const GROUP_LABELS: Record<GlossaryGroup, string> = {
  "robot-types": "Robot types",
  technical: "Technical concepts",
  commercial: "Commercial terms",
  "safety-standards": "Safety & standards",
};
