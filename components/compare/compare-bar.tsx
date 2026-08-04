"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCompareStore } from "@/lib/stores/compare-store";

function slugToName(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function CompareBar() {
  const { slugs, remove, clear } = useCompareStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || slugs.length === 0) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-[#0A0F1E]/95 px-4 py-3 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-300"
      style={{
        animation: "compareSlideUp 300ms ease-out",
      }}
    >
      <style>{`
        @keyframes compareSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Robot thumbnails */}
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="shrink-0 font-[family-name:var(--font-ui)] text-[11px] font-bold uppercase tracking-[0.12em] text-white/70">
            Compare ({slugs.length}/3)
          </span>

          {slugs.map((slug) => (
            <div
              key={slug}
              className="group flex shrink-0 items-center gap-2 rounded-lg border border-border bg-[#111318] px-3 py-1.5"
            >
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded bg-[#1a1d24]">
                <Image
                  src={`/images/robots/${slug}.webp`}
                  alt={slugToName(slug)}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                  }}
                />
                <div className="flex h-full w-full items-center justify-center font-[family-name:var(--font-brand)] text-xs font-bold text-white/70">
                  {slugToName(slug).charAt(0)}
                </div>
              </div>
              <span className="hidden text-xs font-medium text-white/80 sm:block">
                {slugToName(slug)}
              </span>
              <button
                onClick={() => remove(slug)}
                className="ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-white/10 hover:text-white"
                aria-label={`Remove ${slugToName(slug)} from comparison`}
              >
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: 3 - slugs.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-dashed border-border/50 sm:flex"
            >
              <svg className="h-4 w-4 text-neutral-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={clear}
            className="font-[family-name:var(--font-ui)] text-[11px] uppercase tracking-[0.1em] text-neutral-400 transition-colors hover:text-white"
          >
            Clear All
          </button>
          <Link
            href={`/compare?robots=${slugs.join(",")}`}
            className={`rounded-lg px-5 py-2 text-sm font-semibold text-[#0A0F1E] transition-all ${
              slugs.length >= 2
                ? "bg-white hover:opacity-90"
                : "cursor-not-allowed bg-white/40"
            }`}
            onClick={(e) => {
              if (slugs.length < 2) e.preventDefault();
            }}
          >
            Compare Now
          </Link>
        </div>
      </div>
    </div>
  );
}
