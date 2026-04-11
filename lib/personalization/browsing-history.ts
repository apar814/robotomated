/**
 * Lightweight, cookie-free personalization engine.
 * Tracks browsing patterns in localStorage to personalize recommendations.
 */

const STORAGE_KEY = "robotomated-browsing";
const MAX_ITEMS = 50;

export interface BrowsingData {
  viewedRobots: { slug: string; category: string; name: string; ts: number }[];
  viewedCategories: Record<string, number>; // category slug → view count
  searches: string[];
  certificationStarted: string | null; // level slug if started
  lastVisit: number;
}

function getDefault(): BrowsingData {
  return {
    viewedRobots: [],
    viewedCategories: {},
    searches: [],
    certificationStarted: null,
    lastVisit: Date.now(),
  };
}

export function loadBrowsingData(): BrowsingData {
  if (typeof window === "undefined") return getDefault();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefault();
    return { ...getDefault(), ...JSON.parse(raw) };
  } catch {
    return getDefault();
  }
}

function save(data: BrowsingData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable
  }
}

export function trackRobotView(slug: string, category: string, name: string) {
  const data = loadBrowsingData();
  // Dedupe — remove existing entry for this slug
  data.viewedRobots = data.viewedRobots.filter((r) => r.slug !== slug);
  data.viewedRobots.unshift({ slug, category, name, ts: Date.now() });
  if (data.viewedRobots.length > MAX_ITEMS) data.viewedRobots = data.viewedRobots.slice(0, MAX_ITEMS);
  // Track category
  data.viewedCategories[category] = (data.viewedCategories[category] || 0) + 1;
  data.lastVisit = Date.now();
  save(data);
}

export function trackSearch(query: string) {
  const data = loadBrowsingData();
  data.searches = [query, ...data.searches.filter((s) => s !== query)].slice(0, 20);
  save(data);
}

export function trackCertificationStart(level: string) {
  const data = loadBrowsingData();
  data.certificationStarted = level;
  save(data);
}

export function getTopCategories(limit = 3): string[] {
  const data = loadBrowsingData();
  return Object.entries(data.viewedCategories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([slug]) => slug);
}

export function getRecentRobots(limit = 6) {
  const data = loadBrowsingData();
  return data.viewedRobots.slice(0, limit);
}

export function hasViewed3Plus(): boolean {
  const data = loadBrowsingData();
  return data.viewedRobots.length >= 3;
}
