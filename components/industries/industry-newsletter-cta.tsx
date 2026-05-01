"use client";

import { useState } from "react";

interface Props {
  industryLabel: string;
}

export function IndustryNewsletterCta({ industryLabel }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, industry: industryLabel }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      } else {
        setStatus("success");
        setMessage(data.message || "You're subscribed!");
        setEmail("");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong");
    }
  }

  return (
    <div className="rounded-2xl border border-violet/20 bg-gradient-to-br from-violet/[0.06] to-white/[0.04] p-8 sm:p-10">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-[11px] font-medium uppercase tracking-widest text-violet">Newsletter</p>
        <h3 className="mt-2 font-display text-xl font-bold tracking-[-0.02em] text-white sm:text-2xl">
          Get weekly {industryLabel} robotics intelligence
        </h3>
        <p className="mt-2 text-sm text-white/50">
          New robots, deployment insights, ROI benchmarks, and industry analysis delivered every Tuesday.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-0">
          <input
            type="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/45 focus:border-white/50 focus:outline-none sm:rounded-r-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="whitespace-nowrap rounded-lg bg-violet px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 sm:rounded-l-none"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe Free"}
          </button>
        </form>
        {status === "success" && (
          <p className="mt-3 text-sm text-green">{message}</p>
        )}
        {status === "error" && (
          <p className="mt-3 text-sm text-orange-400">{message}</p>
        )}
        <p className="mt-3 text-[11px] text-white/50">No spam. Unsubscribe anytime. Join 2,000+ industry professionals.</p>
      </div>
    </div>
  );
}
