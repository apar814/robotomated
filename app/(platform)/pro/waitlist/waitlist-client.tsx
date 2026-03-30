"use client";

import { useState } from "react";
import Link from "next/link";
import { useSiteStats } from "@/lib/context/site-stats";

function getFeatures(robotCount: number) {
  return [
    { icon: "bell", title: "Unlimited Price Drop Alerts", desc: `Free tier: 3 alerts. Pro: unlimited across all ${robotCount}+ robots. Never miss a deal.`, free: "3 alerts", pro: "Unlimited" },
    { icon: "chart", title: "Weekly Market Reports (PDF)", desc: "Downloadable market intelligence reports covering funding, trends, and analysis.", free: "None", pro: "Weekly PDF" },
    { icon: "lightning", title: "Funding Round Alerts", desc: "Get notified when companies in your tracked categories raise funding.", free: "None", pro: "Real-time" },
    { icon: "code", title: "Robot Database API Access", desc: `Programmatic access to our ${robotCount}+ robot database. JSON API with full specs and scoring.`, free: "None", pro: "Full API" },
    { icon: "star", title: "Early Access to New Tools", desc: "Be first to use new tools like the Robot Finder Quiz, ROI calculators, and comparison features.", free: "Standard", pro: "Early access" },
    { icon: "message", title: "Priority Advisor Responses", desc: "Skip the queue. Your AI Advisor conversations get priority processing and longer responses.", free: "5/month", pro: "Unlimited + priority" },
  ];
}

function FeatureIcon({ name }: { name: string }) {
  const cls = "h-5 w-5 text-electric-blue";
  switch (name) {
    case "bell": return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>;
    case "chart": return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>;
    case "lightning": return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>;
    case "code": return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>;
    case "star": return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>;
    case "message": return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>;
    default: return null;
  }
}

export function ProWaitlistClient() {
  const { robotCount } = useSiteStats();
  const FEATURES = getFeatures(robotCount);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [position, setPosition] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/pro/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Something went wrong");
      } else {
        setStatus("success");
        setPosition(data.position || null);
      }
    } catch {
      setStatus("error");
      setError("Something went wrong");
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <span className="inline-block rounded-full bg-violet/10 px-4 py-1.5 text-xs font-semibold text-violet">
            Coming Soon
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
            Robotomated Pro
          </h1>
          <p className="mt-4 text-lg text-muted">
            Everything in Free, plus unlimited alerts, market reports, API access, and priority support.
          </p>

          {/* Price anchor */}
          <div className="mt-8 inline-flex items-baseline gap-2">
            <span className="font-mono text-4xl font-bold text-foreground">$29</span>
            <span className="text-muted">/month</span>
          </div>
          <p className="mt-2 text-sm text-lime font-semibold">
            Waitlist gets 40% off forever &rarr; $17/month
          </p>
        </div>
      </section>

      {/* Waitlist form */}
      <section className="px-4 pb-12">
        <div className="mx-auto max-w-md">
          {status === "success" ? (
            <div className="rounded-md border border-lime/20 bg-lime/5 p-8 text-center">
              <p className="text-lg font-bold text-lime">You&apos;re on the list!</p>
              {position && (
                <p className="mt-2 text-3xl font-mono font-bold text-foreground">#{position}</p>
              )}
              <p className="mt-2 text-sm text-muted">
                We&apos;ll email you when Pro launches. Your 40% lifetime discount is locked in.
              </p>
              <Link href="/" className="mt-4 inline-block text-sm text-electric-blue hover:underline">
                Back to Robotomated
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:gap-0">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 rounded-md border border-border bg-transparent px-5 py-4 text-sm text-white placeholder:text-white/25 focus:border-electric-blue focus:outline-none sm:rounded-r-none"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-md bg-electric-blue px-8 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 sm:rounded-l-none"
              >
                {status === "loading" ? "Joining..." : "Join Waitlist"}
              </button>
            </form>
          )}
          {error && <p className="mt-3 text-center text-sm text-orange">{error}</p>}
        </div>
      </section>

      {/* Feature comparison */}
      <section className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-xl font-bold">Free vs. Pro</h2>
          <div className="mt-8 space-y-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-4 rounded-md border border-border bg-white/[0.02] p-5">
                <div className="mt-0.5 shrink-0">
                  <FeatureIcon name={f.icon} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">{f.title}</h3>
                  <p className="mt-1 text-xs text-muted">{f.desc}</p>
                </div>
                <div className="flex shrink-0 gap-4 text-right text-xs">
                  <div>
                    <p className="text-muted">Free</p>
                    <p className="font-medium text-foreground/60">{f.free}</p>
                  </div>
                  <div>
                    <p className="text-violet">Pro</p>
                    <p className="font-semibold text-violet">{f.pro}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
