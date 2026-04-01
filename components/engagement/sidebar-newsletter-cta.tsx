"use client";

import { useState } from "react";

export function SidebarNewsletterCta({ robotName }: { robotName: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "robot-sidebar" }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="rounded-md border border-border bg-obsidian-surface p-4">
      <div className="section-label mb-3">
        <span className="font-mono text-[9px] tracking-widest">[INTEL] WEEKLY BRIEF</span>
      </div>
      {status === "success" ? (
        <p className="text-sm font-medium text-neon-green">
          Subscribed. Check your inbox Monday.
        </p>
      ) : (
        <>
          <p className="mb-3 text-sm text-text-secondary">
            Get weekly updates on robots like {robotName}
          </p>
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="w-full rounded-md border border-border bg-obsidian px-3 py-2 text-sm text-text-primary placeholder:text-text-ghost focus:border-electric-blue focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-md border border-electric-blue bg-electric-blue/10 px-3 py-2 font-mono text-xs font-bold text-electric-blue transition-colors hover:bg-electric-blue/20 disabled:opacity-50"
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
            {status === "error" && (
              <p className="text-xs text-orange-400">Something went wrong.</p>
            )}
          </form>
        </>
      )}
    </div>
  );
}
