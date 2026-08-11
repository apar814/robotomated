/**
 * CONTAINMENT ALLOWLIST — 2026-08-11.
 *
 * Only MDX articles listed here are published. All other files under
 * content/learn/ are unpublished (removed from routing, listings, and the
 * sitemap; their URLs return 410 Gone via middleware) following the claims
 * audit in docs/claims-inventory-mdx-2026-08-11.md. Source files remain in
 * the repo; this is unpublishing, not deletion.
 *
 * Every entry here passed BOTH the first-pass audit and an adversarial
 * second read. Do not add entries without a documented claims review.
 * Edge-safe: no fs imports (middleware depends on this module).
 */

export const PUBLISHED_MDX = new Set<string>([
  // 2 of 225 passed both the first-pass audit AND the adversarial second
  // read (docs/mdx-containment-2026-08-11.md). 9 first-pass "clean"
  // candidates failed the second read on unsourced figures, misattributed
  // ISO/TS 15066 force values, or stale OSHA penalty schedules.
  "guides/questions-to-ask-robot-salesperson",
  "getting-started/robot-selection-framework",
]);

/** Directories that contain (mostly unpublished) MDX articles. */
export const MDX_DIRS = [
  "agricultural", "construction", "cost", "delivery", "getting-started",
  "guides", "home", "hospitality", "humanoid", "inspection",
  "manufacturing", "market", "medical", "problems", "retail",
  "security", "vs", "warehouse",
] as const;

export function isPublishedMdx(category: string, slug: string): boolean {
  return PUBLISHED_MDX.has(`${category}/${slug}`);
}

export function isMdxCategory(category: string): boolean {
  return (MDX_DIRS as readonly string[]).includes(category);
}
