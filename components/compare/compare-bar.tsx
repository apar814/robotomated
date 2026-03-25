"use client";

import Link from "next/link";
import { useCompareStore } from "@/lib/stores/compare-store";

export function CompareBar() {
  const { slugs, clear } = useCompareStore();

  if (slugs.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">
            Comparing {slugs.length} robot{slugs.length > 1 ? "s" : ""}
          </span>
          <button onClick={clear} className="text-xs text-neutral-400 hover:text-foreground">Clear</button>
        </div>
        <Link
          href={`/compare?robots=${slugs.join(",")}`}
          className="rounded-lg bg-green px-6 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          View Comparison
        </Link>
      </div>
    </div>
  );
}
