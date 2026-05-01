"use client";

import { useState } from "react";

export function ArticleFeedback({ articleSlug }: { articleSlug: string }) {
  const [submitted, setSubmitted] = useState<"up" | "down" | null>(null);

  async function handleFeedback(helpful: boolean) {
    const vote = helpful ? "up" : "down";
    setSubmitted(vote);

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article: articleSlug, helpful }),
      });
    } catch {
      // Silent fail — non-critical
    }
  }

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-navy-light px-6 py-4">
      <span className="text-sm font-medium">Was this helpful?</span>
      {submitted ? (
        <span className="text-sm text-white">Thanks for your feedback!</span>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => handleFeedback(true)}
            className="rounded-lg border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-white/30 hover:text-white"
          >
            <span className="mr-1">&#128077;</span> Yes
          </button>
          <button
            onClick={() => handleFeedback(false)}
            className="rounded-lg border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-orange/30 hover:text-orange"
          >
            <span className="mr-1">&#128078;</span> No
          </button>
        </div>
      )}
    </div>
  );
}
