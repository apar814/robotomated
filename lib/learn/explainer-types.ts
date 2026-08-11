/**
 * Explainer (long-form guide) data model. Content rules
 * (docs/claims-policy.md): no market projections, no salary figures,
 * no adoption percentages, no incident-reduction stats, no dollar
 * figures, no RoboScore/ranking references. Citations are limited to
 * named standards, regulations, and directives with publisher + year.
 */

export interface ExplainerSection {
  /** section heading, sentence case; omit for the lead section */
  heading?: string;
  /** paragraphs of plain prose (no markdown) */
  paragraphs: string[];
}

export interface ExplainerFaq {
  q: string;
  a: string;
}

export interface ExplainerCitation {
  /** e.g. "ISO/TS 15066, International Organization for Standardization" */
  source: string;
  year: string;
  note?: string;
}

export interface Explainer {
  slug: string;
  title: string;
  /** meta description, <=160 chars */
  description: string;
  readTime: number;
  publishedAt: string; // ISO date
  sections: ExplainerSection[];
  /** genuine Q&A only — rendered + emitted as FAQPage JSON-LD */
  faq?: ExplainerFaq[];
  citations: ExplainerCitation[];
  /** glossary slugs referenced by this piece */
  glossaryLinks: string[];
  /** the single next step this piece routes toward */
  nextStep: { label: string; href: string; blurb: string };
}
