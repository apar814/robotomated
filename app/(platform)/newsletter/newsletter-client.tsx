"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSiteStats } from "@/lib/context/site-stats";
import { NewsletterPreviewSvg } from "@/components/ui/newsletter-preview-svg";

function NewsletterIcon({ type, className }: { type: "bar-chart" | "cpu" | "dollar-down" | "trending-up"; className?: string }) {
  const icons = {
    "bar-chart": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="12" width="4" height="9" rx="1" />
        <rect x="10" y="7" width="4" height="14" rx="1" />
        <rect x="17" y="3" width="4" height="18" rx="1" />
      </svg>
    ),
    cpu: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
      </svg>
    ),
    "dollar-down": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M8 6c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2s-.9 2-2 2h-4c-1.1 0-2 .9-2 2s.9 2 2 2h4c1.1 0 2-.9 2-2" />
        <path d="M17 16l-5 5-5-5" />
      </svg>
    ),
    "trending-up": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  };
  return icons[type];
}

const RECENT_ISSUES = [
  {
    title: "Humanoid Race Heats Up: Figure vs. Tesla vs. Unitree",
    date: "March 24, 2026",
    preview: "Figure 03 announced, Tesla Optimus hits factory floors, and Unitree's $5,900 R1 is shipping to consumers. Plus: $420M in humanoid funding this quarter alone.",
  },
  {
    title: "Warehouse AMR Adoption Hits Inflection Point",
    date: "March 17, 2026",
    preview: "Locus Robotics passes 3B units picked. AutoStore B1 ships. Amazon Sparrow reaches 1000 picks/hour. The RaaS model is winning — here's what the data shows.",
  },
  {
    title: "Surgical Robotics: Medtronic Hugo Challenges da Vinci's Dominance",
    date: "March 10, 2026",
    preview: "Hugo RAS secures 5 new FDA clearances. Da Vinci 5 force feedback changes the game. CMR Versius expands in Asia. We break down what hospital buyers should know.",
  },
];

export function NewsletterPageClient({ subscriberCount }: { subscriberCount: number }) {
  const { robotCount } = useSiteStats();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "newsletter-page" }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      } else {
        setStatus("success");
        setMessage(data.message);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong");
    }
  }

  return (
    <div>
      {/* Hero — split layout */}
      <section className="px-4 py-20">
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-[3fr_2fr]">
          {/* Left: copy + form */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue">Every Monday at 7am</p>
            <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
              The Robotomated Brief
            </h1>
            <p className="mt-4 text-lg text-muted">
              Weekly robotics intelligence for operators, buyers, and builders. The one email that keeps you ahead of the automation curve.
            </p>

            {/* Stats */}
            <div className="mt-8 flex gap-8">
              <div>
                <p className="font-mono text-2xl font-bold text-blue">{robotCount}+</p>
                <p className="text-xs text-muted">Robots Tracked</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-green">$103B</p>
                <p className="text-xs text-muted">Market Coverage</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-violet">51</p>
                <p className="text-xs text-muted">Research Reports</p>
              </div>
            </div>

            {/* Benefits */}
            <ul className="mt-8 space-y-2 text-sm text-muted">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-electric-blue" /> Top-rated robots and new launches every week</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-electric-blue" /> Market funding data and price movements</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-electric-blue" /> Industry analysis for operators and buyers</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-electric-blue" /> No spam, unsubscribe anytime</li>
            </ul>

            {/* Signup form */}
            {status === "success" ? (
              <div className="mt-8 rounded-xl border border-green/20 bg-green/5 p-8">
                <p className="text-lg font-semibold text-green">You&apos;re in.</p>
                <p className="mt-2 text-sm text-muted">{message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-5 py-4 text-sm text-white placeholder:text-white/25 focus:border-blue focus:outline-none sm:rounded-r-none"
                  />
                  <Button type="submit" disabled={status === "loading"} className="px-8 py-4 sm:rounded-l-none">
                    {status === "loading" ? "Subscribing..." : "Subscribe Free"}
                  </Button>
                </div>
                {status === "error" && <p className="mt-3 text-sm text-orange">{message}</p>}
                <p className="mt-3 text-xs text-muted">
                  Free forever.
                  {subscriberCount > 10 && <span> Join {subscriberCount.toLocaleString()} robotics professionals.</span>}
                </p>
              </form>
            )}
          </div>

          {/* Right: newsletter preview illustration */}
          <div className="flex justify-center lg:justify-end">
            <NewsletterPreviewSvg className="w-full max-w-[280px] drop-shadow-2xl lg:max-w-[320px]" />
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="border-t border-white/[0.06] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-xl font-bold">What&apos;s Inside Every Issue</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { iconType: "bar-chart" as const, title: "Market Moves", desc: "Funding rounds, acquisitions, and IPOs in robotics" },
              { iconType: "cpu" as const, title: "New Robots", desc: "First look at every robot added to our database" },
              { iconType: "dollar-down" as const, title: "Price Drops", desc: `Weekly price movements across ${robotCount}+ robots` },
              { iconType: "trending-up" as const, title: "Industry Intel", desc: "Trends, analysis, and what operators need to know" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 text-center">
                <NewsletterIcon type={item.iconType} className="mx-auto h-6 w-6 text-blue" />
                <h3 className="mt-2 text-sm font-semibold">{item.title}</h3>
                <p className="mt-1 text-xs text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent issues */}
      <section className="border-t border-white/[0.06] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-xl font-bold">Recent Issues</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {RECENT_ISSUES.map((issue) => (
              <div key={issue.title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-blue">{issue.date}</p>
                <h3 className="mt-2 text-sm font-semibold leading-tight">{issue.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">{issue.preview}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
