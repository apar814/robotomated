"use client";

import { useCompareStore } from "@/lib/stores/compare-store";

export function AddToCompareButton({ slug, className = "" }: { slug: string; className?: string }) {
  const { slugs, add, remove, has } = useCompareStore();
  const isAdded = has(slug);
  const isFull = slugs.length >= 3;

  return (
    <button
      onClick={() => isAdded ? remove(slug) : add(slug)}
      disabled={!isAdded && isFull}
      className={`rounded-lg border px-4 py-2 text-xs font-medium transition-colors ${
        isAdded
          ? "border-green/30 bg-green/10 text-green"
          : isFull
          ? "cursor-not-allowed border-border text-neutral-300"
          : "border-border text-neutral-500 hover:border-blue hover:text-blue"
      } ${className}`}
    >
      {isAdded ? "In comparison ✓" : isFull ? "Compare full (3)" : "Add to compare"}
    </button>
  );
}
