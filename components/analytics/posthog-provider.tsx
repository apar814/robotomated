"use client";

import { useEffect } from "react";
import { initPostHog } from "@/lib/analytics/posthog";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check if user has consented
    const consent = localStorage.getItem("cookie_consent");
    if (consent === "accepted") {
      initPostHog();
    }
  }, []);

  return <>{children}</>;
}
