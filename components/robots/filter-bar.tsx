"use client";

import { cn } from "@/lib/utils/cn";

const APPLICATION_TAGS: Record<string, string[]> = {
  manufacturing: ["Assembly", "Welding", "Palletizing", "Machine tending", "Inspection", "Pick & place"],
  warehouse: ["Order picking", "Palletizing", "Inventory", "Sortation", "Last-mile delivery"],
  medical: ["Surgical assistance", "Rehabilitation", "Diagnostics", "Lab automation"],
  consumer: ["Floor cleaning", "Lawn mowing", "Pool cleaning", "Security"],
  agricultural: ["Harvesting", "Planting", "Spraying", "Weeding"],
  construction: ["Bricklaying", "Welding", "Inspection", "Site survey"],
  drone: ["Aerial survey", "Delivery", "Inspection", "Photography"],
  default: ["Assembly", "Inspection", "Delivery", "Cleaning", "Security"],
};

const PRICE_PRESETS = [
  { label: "Under $1K", max: "1000" },
  { label: "Under $10K", max: "10000" },
  { label: "Under $100K", max: "100000" },
  { label: "Any price", max: "" },
];

interface FilterBarProps {
  category?: string;
  totalCount: number;
  priceMax: string;
  onPriceMaxChange: (value: string) => void;
  scoreMin: string;
  onScoreMinChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onClear: () => void;
  hasFilters: boolean;
}

export function FilterBar({
  category = "default",
  totalCount,
  priceMax,
  onPriceMaxChange,
  scoreMin,
  onScoreMinChange,
  sortBy,
  onSortChange,
  onClear,
  hasFilters,
}: FilterBarProps) {
  const scoreNum = scoreMin ? parseInt(scoreMin) : 0;

  return (
    <div className="sticky top-[57px] z-20 border-b border-border bg-navy/95 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
        {/* Price presets */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-white/30">Price</span>
          <div className="flex gap-1.5">
            {PRICE_PRESETS.map(({ label, max }) => (
              <button
                key={label}
                onClick={() => onPriceMaxChange(max)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-all",
                  priceMax === max
                    ? "border-blue bg-blue/10 font-medium text-blue"
                    : "border-border text-white/35 hover:border-white/[0.12]"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden h-5 w-px bg-border sm:block" />

        {/* Min score */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-white/30">Min Score</span>
          <div className="flex gap-1">
            {[60, 70, 80, 90].map((n) => (
              <button
                key={n}
                onClick={() => onScoreMinChange(scoreNum === n ? "" : String(n))}
                className={cn(
                  "rounded-full border px-2.5 py-1 font-mono text-xs transition-all",
                  scoreNum === n
                    ? "border-blue bg-blue/10 font-medium text-blue"
                    : "border-border text-white/35 hover:border-white/[0.12]"
                )}
              >
                {n}+
              </button>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          {hasFilters && (
            <button onClick={onClear} className="text-xs text-white/30 underline underline-offset-2 hover:text-foreground">
              Clear filters
            </button>
          )}
          <span className="text-xs text-white/30">{totalCount} robots</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="cursor-pointer rounded-lg border border-border bg-white/[0.04] px-2.5 py-1.5 text-xs text-foreground focus:border-blue focus:outline-none"
          >
            <option value="score_desc">Top Rated</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>
    </div>
  );
}
