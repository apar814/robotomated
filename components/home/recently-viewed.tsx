"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getRecentRobots, hasViewed3Plus } from "@/lib/personalization/browsing-history";

export function RecentlyViewed() {
  const [robots, setRobots] = useState<{ slug: string; category: string; name: string; ts: number }[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (hasViewed3Plus()) {
      setRobots(getRecentRobots(4));
      setShow(true);
    }
  }, []);

  if (!show || robots.length === 0) return null;

  return (
    <section className="border-t px-6 py-16" style={{ borderColor: "var(--theme-border)" }}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">
              Based on your research
            </p>
            <h2
              className="mt-1 font-display text-xl font-bold"
              style={{ color: "var(--theme-text-primary)" }}
            >
              Continue where you left off
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-[12px] font-medium text-[#2563EB] transition-opacity hover:opacity-80"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {robots.map((r) => (
            <Link
              key={r.slug}
              href={`/explore/${r.category}/${r.slug}`}
              className="group rounded-xl border border-white/[0.06] bg-[#0D0D0D] p-4 transition-all hover:border-[#2563EB]/20"
            >
              <p className="font-[family-name:var(--font-ui)] text-[13px] uppercase tracking-[0.08em] text-white/50">
                {r.category}
              </p>
              <p className="mt-1 text-sm font-semibold text-white transition-colors group-hover:text-[#2563EB]">
                {r.name}
              </p>
              <p className="mt-2 text-[13px] text-white/45">
                Viewed {formatTimeAgo(r.ts)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
