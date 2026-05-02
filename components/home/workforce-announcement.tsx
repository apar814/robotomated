"use client";

import { useState } from "react";
import Link from "next/link";

export function WorkforceAnnouncement() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-white/[0.04] border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 bg-white/10 text-white text-xs font-mono px-2 py-0.5 rounded-sm hidden sm:inline">
            NEW
          </span>
          <p className="text-sm text-text-primary truncate">
            <span className="font-semibold">Workforce Network</span>
            <span className="text-text-secondary hidden sm:inline">
              {" "}— Become a certified robot operator in 4 weeks. $45-75K starting.
            </span>
            <span className="text-text-secondary sm:hidden">
              {" "}— Get certified in 4 weeks
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/certification/operator-level-1"
            className="text-xs font-semibold text-white hover:text-white/70 transition-colors whitespace-nowrap"
          >
            Learn More &rarr;
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="text-text-tertiary hover:text-text-secondary p-1"
            aria-label="Dismiss"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
