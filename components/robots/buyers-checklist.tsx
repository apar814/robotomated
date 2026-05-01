"use client";

import { useState } from "react";

interface BuyersChecklistProps {
  robotName: string;
  robotSlug: string;
}

const VISIBLE_QUESTIONS = [
  "What is the total cost of ownership over 5 years?",
  "What does the warranty cover, and what's excluded?",
  "What is your average response time for critical issues?",
  "Can you provide references from similar deployments?",
  "Is a pilot program available before full commitment?",
];

export function BuyersChecklist({ robotName, robotSlug }: BuyersChecklistProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "buyers_checklist",
          industry: null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
        return;
      }

      setStatus("success");
      setMessage("Check your email for the full checklist");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="rounded-md border border-border border-l-2 border-l-lime bg-obsidian-surface p-4">
      {/* Label */}
      <div className="section-label green mb-3">
        <span className="font-mono text-[13px] tracking-widest">
          [BUYER&apos;S GUIDE] 20 QUESTIONS TO ASK
        </span>
      </div>

      <p className="mb-3 text-sm text-text-secondary">
        Before purchasing the {robotName}, ask the vendor these critical
        questions:
      </p>

      {/* Questions */}
      <ol className="mb-3 space-y-2">
        {VISIBLE_QUESTIONS.map((q, i) => (
          <li key={i} className="flex gap-2 text-sm">
            <span className="shrink-0 font-mono text-[11px] font-bold text-white">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-text-primary">{q}</span>
          </li>
        ))}
      </ol>

      <p className="mb-4 font-mono text-[11px] text-text-tertiary">
        ... and 15 more critical questions
      </p>

      {/* Email Form */}
      {status === "success" ? (
        <div className="rounded-md border border-[rgba(200,255,0,0.08)] bg-white/5 px-3 py-2">
          <p className="font-mono text-sm text-white">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-w-0 flex-1 rounded-md border border-border bg-obsidian px-3 py-2 font-mono text-sm text-text-primary placeholder:text-text-ghost focus:border-white/40 focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="shrink-0 rounded-md bg-white px-4 py-2 font-mono text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === "loading" ? "..." : "DOWNLOAD FULL CHECKLIST"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-2 font-mono text-[11px] text-magenta">{message}</p>
      )}
    </div>
  );
}
