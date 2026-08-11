"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Client-side auth completion for implicit-flow magic links (fragment
 * tokens). The callback route redirects here when no PKCE code is present;
 * the browser preserves the #access_token fragment across that redirect.
 * setSession() via the @supabase/ssr browser client writes the session
 * cookies, so the server sees the login on the next navigation.
 */
export default function AuthCompletePage() {
  const [status, setStatus] = useState<"working" | "failed">("working");

  useEffect(() => {
    async function complete() {
      const params = new URLSearchParams(window.location.hash.slice(1));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      const redirect =
        new URLSearchParams(window.location.search).get("redirect") ||
        "/account";

      if (!access_token || !refresh_token) {
        // Expired/consumed link or an auth error in the fragment
        const desc = params.get("error_description");
        window.location.replace(
          `/login?error=${desc ? "link_expired" : "auth_failed"}`
        );
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
      if (error) {
        console.error("[auth/complete] setSession failed:", error.message);
        setStatus("failed");
        setTimeout(
          () => window.location.replace("/login?error=auth_failed"),
          1500
        );
        return;
      }

      // Clear tokens from the URL before leaving this page
      window.history.replaceState(null, "", "/auth/complete");
      window.location.replace(redirect);
    }
    complete();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary">
          {status === "working" ? "Signing you in" : "Sign-in failed"}
        </p>
        <p className="mt-3 text-sm text-muted">
          {status === "working"
            ? "One moment — completing authentication."
            : "Redirecting you back to the sign-in page."}
        </p>
      </div>
    </div>
  );
}
