"use client";

import Link from "next/link";
import { useSiteStats } from "@/lib/context/site-stats";

export function RobotFinderCtaStrip() {
  const { robotCount } = useSiteStats();
  return (
    <section className="border-y border-border bg-gradient-to-r from-[#000000] via-[#000000] to-[#000000] px-6 py-10">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/5">
          <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="font-display text-lg font-bold text-primary">
            Find Your Robot in 5 Minutes
          </h2>
          <p className="mt-1 text-[14px] text-tertiary">
            Answer 7 questions and we&apos;ll match you to the best robots from our database of {robotCount}+. Free, instant, no signup required.
          </p>
        </div>
        <Link
          href="/tools/robot-finder"
          className="shrink-0 rounded-lg bg-white px-6 py-3 font-mono text-[11px] font-bold tracking-wider text-black transition-shadow hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          START QUIZ &rarr;
        </Link>
      </div>
    </section>
  );
}

export function RobotFinderInlineLink({ industry }: { industry?: string }) {
  const href = industry ? `/tools/robot-finder?industry=${industry}` : "/tools/robot-finder";
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:underline">
      Not sure which robot? Start here
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

export function RobotFinderSidebarCta({ categorySlug }: { categorySlug?: string }) {
  const href = categorySlug
    ? `/tools/robot-finder?industry=${categorySlug}`
    : "/tools/robot-finder";
  return (
    <div className="rounded-xl border border-white/[0.07] bg-gradient-to-br from-white/[0.03] to-white/[0.02] p-5">
      <div className="flex items-center gap-2">
        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
        <h3 className="text-sm font-semibold text-white">Find similar robots for your use case</h3>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-white/50">
        Answer a few questions and get matched to the best alternatives based on your specific requirements.
      </p>
      <Link
        href={href}
        className="mt-3 inline-block rounded-md bg-white/5 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
      >
        Take the Quiz &rarr;
      </Link>
    </div>
  );
}
