import posthog from "posthog-js";

let initialized = false;

export function initPostHog() {
  if (initialized || typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  posthog.init(key, {
    api_host: "https://us.i.posthog.com",
    capture_pageview: true,
    capture_pageleave: true,
    persistence: "localStorage+cookie",
    opt_out_capturing_by_default: false,
  });

  initialized = true;
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    posthog.capture(event, properties);
  } catch {
    // Silent fail
  }
}

export function optOut() {
  if (typeof window === "undefined") return;
  posthog.opt_out_capturing();
}

export function optIn() {
  if (typeof window === "undefined") return;
  posthog.opt_in_capturing();
}

export function isOptedOut(): boolean {
  if (typeof window === "undefined") return false;
  return posthog.has_opted_out_capturing();
}

// Typed event helpers
export const analytics = {
  robotViewed: (robotId: string, category: string, source: string) =>
    trackEvent("robot_viewed", { robot_id: robotId, category, source }),
  advisorStarted: () =>
    trackEvent("advisor_started"),
  advisorCompleted: (useCase: string, recommendationsShown: number) =>
    trackEvent("advisor_completed", { use_case: useCase, recommendations_shown: recommendationsShown }),
  affiliateClick: (robotId: string, retailer: string, price: number | null) =>
    trackEvent("affiliate_click", { robot_id: robotId, retailer, price }),
  reviewSubmitted: (robotId: string, score: number, type: string) =>
    trackEvent("review_submitted", { robot_id: robotId, score, type }),
  proUpgradeClicked: () =>
    trackEvent("pro_upgrade_clicked"),
  proSubscribed: () =>
    trackEvent("pro_subscribed"),
  searchPerformed: (query: string, resultsCount: number, filtersApplied: string[]) =>
    trackEvent("search_performed", { query, results_count: resultsCount, filters_applied: filtersApplied }),
};
