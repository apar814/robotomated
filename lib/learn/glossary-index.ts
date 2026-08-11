import type { GlossaryTerm } from "./glossary-types";
import { ROBOT_TYPES_TECHNICAL_TERMS } from "./glossary/robot-types-technical";
import { COMMERCIAL_TERMS } from "./glossary/commercial";
import { SAFETY_STANDARDS_TERMS } from "./glossary/safety-standards";

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  ...ROBOT_TYPES_TECHNICAL_TERMS,
  ...COMMERCIAL_TERMS,
  ...SAFETY_STANDARDS_TERMS,
].sort((a, b) => a.term.localeCompare(b.term));

const bySlug = new Map(GLOSSARY_TERMS.map((t) => [t.slug, t]));

export function getTerm(slug: string): GlossaryTerm | undefined {
  return bySlug.get(slug);
}

export function getTerms(slugs: string[]): GlossaryTerm[] {
  return slugs
    .map((s) => bySlug.get(s))
    .filter((t): t is GlossaryTerm => Boolean(t));
}

/** A-Z buckets for the index page */
export function termsByLetter(): { letter: string; terms: GlossaryTerm[] }[] {
  const buckets = new Map<string, GlossaryTerm[]>();
  for (const t of GLOSSARY_TERMS) {
    const letter = t.term[0].toUpperCase();
    if (!buckets.has(letter)) buckets.set(letter, []);
    buckets.get(letter)!.push(t);
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, terms]) => ({ letter, terms }));
}
