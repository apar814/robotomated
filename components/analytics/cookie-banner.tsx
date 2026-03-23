"use client";

import { useState, useEffect } from "react";
import { initPostHog, optOut } from "@/lib/analytics/posthog";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setShow(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie_consent", "accepted");
    initPostHog();
    setShow(false);
  }

  function decline() {
    localStorage.setItem("cookie_consent", "declined");
    optOut();
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-navy-light/95 px-4 py-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-xs text-muted">
          We use analytics cookies to improve your experience. No personal data is sold.
        </p>
        <div className="flex gap-2">
          <button
            onClick={decline}
            className="rounded-lg border border-border px-4 py-1.5 text-xs text-muted transition-colors hover:text-foreground"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="rounded-lg bg-blue px-4 py-1.5 text-xs font-semibold text-navy transition-opacity hover:opacity-90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
