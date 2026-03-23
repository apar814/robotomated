"use client";

import { useState, useEffect } from "react";

/** Inline disclosure shown on robot detail pages */
export function AffiliateDisclosureInline() {
  return (
    <p className="mt-3 text-[10px] text-muted">
      Robotomated earns a commission on purchases made through our links at no extra cost to you.
      This never influences our scores or recommendations.{" "}
      <a href="/methodology" className="text-blue hover:underline">Learn more</a>.
    </p>
  );
}

/** Dismissable banner shown globally */
export function AffiliateDisclosureBanner() {
  const [dismissed, setDismissed] = useState(true); // Default hidden to avoid flash

  useEffect(() => {
    const stored = localStorage.getItem("affiliate_banner_dismissed");
    if (!stored) setDismissed(false);
  }, []);

  function dismiss() {
    setDismissed(true);
    localStorage.setItem("affiliate_banner_dismissed", "true");
  }

  if (dismissed) return null;

  return (
    <div className="border-b border-border bg-navy-light px-4 py-2">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <p className="text-xs text-muted">
          Robotomated earns a commission on purchases made through our links at no extra cost to you.
        </p>
        <button
          onClick={dismiss}
          className="shrink-0 text-xs text-muted hover:text-foreground"
          aria-label="Dismiss"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
