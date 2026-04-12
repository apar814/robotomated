"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "robotomated_exit_popup_dismissed";
const DISMISS_DAYS = 7;
const MIN_TIME_ON_PAGE_MS = 30_000;

export function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // Storage unavailable
    }
  }, []);

  useEffect(() => {
    // Check if dismissed recently
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed) {
        const elapsed = Date.now() - Number(dismissed);
        if (elapsed < DISMISS_DAYS * 86_400_000) return;
      }
    } catch {
      // Storage unavailable — show popup anyway
    }

    let fired = false;
    const pageLoadTime = Date.now();

    const handleMouseLeave = (e: MouseEvent) => {
      if (fired) return;
      if (e.clientY > 5) return; // Only trigger when cursor moves toward top
      if (Date.now() - pageLoadTime < MIN_TIME_ON_PAGE_MS) return;
      fired = true;
      setVisible(true);
    };

    // Fallback timer for mobile (no mouse leave)
    const timer = setTimeout(() => {
      if (!fired) {
        fired = true;
        // Don't auto-show on mobile — exit intent only
      }
    }, 60_000);

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit-intent" }),
      });
      if (!res.ok) throw new Error("Failed to subscribe");
      setStatus("success");
      setMessage("You're in. Check your inbox Monday.");
      setTimeout(dismiss, 2000);
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-md rounded-lg border border-border bg-obsidian-surface p-8">
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute right-3 top-3 text-text-ghost transition-colors hover:text-text-primary"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>

        <div className="text-center">
          <div className="mb-1 font-mono text-[13px] uppercase tracking-widest text-electric-blue">
            [INTEL] WEEKLY BRIEF
          </div>
          <h2 className="text-xl font-bold text-text-primary">
            Before you go
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Get the weekly robotics intelligence brief. Market moves, new robots, price drops — no fluff.
          </p>
        </div>

        {status === "success" ? (
          <p className="mt-6 text-center text-sm font-medium text-neon-green">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="w-full rounded-md border border-border bg-obsidian px-4 py-2.5 text-sm text-text-primary placeholder:text-text-ghost focus:border-electric-blue focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-3 w-full rounded-md bg-electric-blue px-4 py-2.5 font-mono text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {status === "loading" ? "Subscribing..." : "Get the Weekly Brief"}
            </button>
            {status === "error" && (
              <p className="mt-2 text-center text-xs text-orange-400">{message}</p>
            )}
            <button
              type="button"
              onClick={dismiss}
              className="mt-3 w-full text-center text-xs text-text-ghost transition-colors hover:text-text-secondary"
            >
              No thanks, I'll pass
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
