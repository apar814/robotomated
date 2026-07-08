import { createHash } from "node:crypto";

const TRACKING_PARAMS = new Set([
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "fbclid", "gclid", "ref", "ref_src", "cmpid", "mc_cid", "mc_eid",
]);

/**
 * Canonicalize a URL so syntactic variants of the same article hash
 * identically: force https, lowercase host, strip tracking params,
 * fragment, and trailing slash.
 */
export function normalizeUrl(raw: string): string {
  const u = new URL(raw);
  u.protocol = "https:";
  u.hostname = u.hostname.toLowerCase().replace(/^www\./, "");
  u.hash = "";
  for (const key of [...u.searchParams.keys()]) {
    if (TRACKING_PARAMS.has(key.toLowerCase())) u.searchParams.delete(key);
  }
  u.searchParams.sort();
  let s = u.toString();
  if (s.endsWith("/")) s = s.slice(0, -1);
  return s;
}

export function urlHash(raw: string): string {
  return createHash("sha256").update(normalizeUrl(raw)).digest("hex");
}
