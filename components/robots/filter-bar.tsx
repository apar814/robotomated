"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

// ── Data ──

const PRICE_OPTIONS = [
  { label: "Any Price", min: "", max: "" },
  { label: "Under $10K", min: "", max: "10000" },
  { label: "$10K - $50K", min: "10000", max: "50000" },
  { label: "$50K - $100K", min: "50000", max: "100000" },
  { label: "$100K - $500K", min: "100000", max: "500000" },
  { label: "$500K+", min: "500000", max: "" },
  { label: "RaaS Only", min: "raas", max: "raas" },
];

const INDUSTRY_OPTIONS = [
  "All Industries", "Warehouse", "Manufacturing", "Medical", "Agricultural",
  "Security", "Hospitality", "Construction", "Education", "Eldercare", "Home",
];

const SORT_OPTIONS = [
  { value: "score_desc", label: "Best Match" },
  { value: "score_asc", label: "RoboScore: Low to High" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest Added" },
  { value: "most_viewed", label: "Most Viewed" },
];

const QUICK_CHIPS = [
  { emoji: "\ud83c\udfed", label: "Warehouse", filter: "industry", value: "Warehouse" },
  { emoji: "\ud83c\udfe5", label: "Medical", filter: "industry", value: "Medical" },
  { emoji: "\ud83e\udd16", label: "Humanoid", filter: "category", value: "humanoid" },
  { emoji: "\ud83d\udcb0", label: "Under $50K", filter: "price", value: "50000" },
  { emoji: "\u26a1", label: "Top Rated", filter: "score", value: "80" },
  { emoji: "\ud83d\udd04", label: "RaaS", filter: "price", value: "raas" },
];

// ── Types ──

interface ActiveFilter {
  key: string;
  label: string;
  value: string;
}

interface FilterBarProps {
  // State
  search: string;
  onSearchChange: (v: string) => void;
  priceMin: string;
  priceMax: string;
  onPriceChange: (min: string, max: string) => void;
  industry: string;
  onIndustryChange: (v: string) => void;
  scoreMin: string;
  onScoreMinChange: (v: string) => void;
  sortBy: string;
  onSortChange: (v: string) => void;
  onClear: () => void;
  hasFilters: boolean;
  totalCount: number;
  totalAll: number;
  // Hide category filter on category pages
  hideCategory?: boolean;
}

// ── Component ──

export function FilterBar({
  search, onSearchChange,
  priceMin, priceMax, onPriceChange,
  industry, onIndustryChange,
  scoreMin, onScoreMinChange,
  sortBy, onSortChange,
  onClear, hasFilters,
  totalCount, totalAll,
}: FilterBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Build active filter pills
  const activeFilters: ActiveFilter[] = [];
  if (search) activeFilters.push({ key: "search", label: `"${search}"`, value: search });
  const priceLabel = PRICE_OPTIONS.find(p => p.min === priceMin && p.max === priceMax && (p.min || p.max));
  if (priceLabel) activeFilters.push({ key: "price", label: priceLabel.label, value: priceMax || priceMin });
  else if (priceMax || priceMin) activeFilters.push({ key: "price", label: `$${priceMin || "0"} - $${priceMax || "∞"}`, value: priceMax || priceMin });
  if (industry && industry !== "All Industries") activeFilters.push({ key: "industry", label: industry, value: industry });
  if (scoreMin) activeFilters.push({ key: "score", label: `Score ${scoreMin}+`, value: scoreMin });

  function removeFilter(f: ActiveFilter) {
    switch (f.key) {
      case "search": onSearchChange(""); break;
      case "price": onPriceChange("", ""); break;
      case "industry": onIndustryChange(""); break;
      case "score": onScoreMinChange(""); break;
    }
  }

  function handleQuickChip(chip: typeof QUICK_CHIPS[number]) {
    switch (chip.filter) {
      case "industry": onIndustryChange(chip.value); break;
      case "category": break; // handled by URL navigation
      case "price": onPriceChange("", chip.value); break;
      case "score": onScoreMinChange(chip.value); break;
    }
  }

  return (
    <>
      {/* ── Desktop filter bar ── */}
      <div
        className="sticky top-16 z-30 border-b"
        style={{ background: "var(--theme-surface)", borderColor: "var(--theme-border)" }}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
          {/* Search */}
          <div className="relative w-48 shrink-0">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--theme-text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search robots..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-lg border py-2 pl-9 pr-8 text-[13px] outline-none transition-colors focus:border-[#0EA5E9]"
              style={{
                background: "var(--theme-input-bg)",
                borderColor: "var(--theme-input-border)",
                color: "var(--theme-text-primary)",
              }}
            />
            {search && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: "var(--theme-text-muted)" }}
              >
                &times;
              </button>
            )}
          </div>

          {/* Price dropdown */}
          <FilterDropdown
            label="Price"
            options={PRICE_OPTIONS.map(p => p.label)}
            value={priceLabel?.label || (priceMax || priceMin ? "Custom" : "Any Price")}
            onChange={(label) => {
              const opt = PRICE_OPTIONS.find(p => p.label === label);
              if (opt) onPriceChange(opt.min, opt.max);
            }}
          />

          {/* Industry dropdown */}
          <FilterDropdown
            label="Industry"
            options={INDUSTRY_OPTIONS}
            value={industry || "All Industries"}
            onChange={(v) => onIndustryChange(v === "All Industries" ? "" : v)}
          />

          {/* Sort dropdown */}
          <FilterDropdown
            label="Sort"
            options={SORT_OPTIONS.map(s => s.label)}
            value={SORT_OPTIONS.find(s => s.value === sortBy)?.label || "RoboScore: High to Low"}
            onChange={(label) => {
              const opt = SORT_OPTIONS.find(s => s.label === label);
              if (opt) onSortChange(opt.value);
            }}
          />

          {/* Spacer */}
          <div className="flex-1" />

          {/* Clear + count */}
          {hasFilters && (
            <button
              onClick={onClear}
              className="shrink-0 text-xs font-medium transition-colors hover:opacity-80"
              style={{ color: "#FF006E" }}
            >
              Clear filters
            </button>
          )}
          <span className="shrink-0 text-xs" style={{ color: "var(--theme-text-muted)" }}>
            {totalCount} of {totalAll} robots
          </span>

          {/* Mobile filter trigger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg border px-3 py-1.5 text-[13px] font-medium lg:hidden"
            style={{ borderColor: "var(--theme-border)", color: "var(--theme-text-secondary)" }}
          >
            Filters {hasFilters ? <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-[#0EA5E9]" /> : null}
          </button>
        </div>

        {/* Active filter pills */}
        {activeFilters.length > 0 && (
          <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 pb-3 sm:px-6">
            {activeFilters.map((f) => (
              <span
                key={f.key}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                style={{
                  background: "rgba(14,165,233,0.1)",
                  border: "1px solid rgba(14,165,233,0.3)",
                  color: "#0EA5E9",
                }}
              >
                {f.label}
                <button onClick={() => removeFilter(f)} className="hover:opacity-70">&times;</button>
              </span>
            ))}
          </div>
        )}

        {/* Quick filter chips */}
        <div className="mx-auto hidden max-w-7xl gap-2 px-4 pb-3 sm:px-6 lg:flex">
          {QUICK_CHIPS.map((chip) => {
            const isActive =
              (chip.filter === "industry" && industry === chip.value) ||
              (chip.filter === "price" && priceMax === chip.value) ||
              (chip.filter === "score" && scoreMin === chip.value);

            if (chip.filter === "category") {
              return (
                <Link
                  key={chip.label}
                  href={`/explore/${chip.value}`}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] transition-colors hover:border-[#0EA5E9] hover:text-[#0EA5E9]",
                  )}
                  style={{
                    borderColor: "var(--theme-tag-border)",
                    color: "var(--theme-tag-text)",
                    background: "var(--theme-tag-bg)",
                  }}
                >
                  {chip.emoji} {chip.label}
                </Link>
              );
            }

            return (
              <button
                key={chip.label}
                onClick={() => isActive ? removeFilter({ key: chip.filter, label: chip.label, value: chip.value }) : handleQuickChip(chip)}
                className="rounded-full border px-2.5 py-1 text-[11px] transition-colors"
                style={{
                  borderColor: isActive ? "#0EA5E9" : "var(--theme-tag-border)",
                  color: isActive ? "#0EA5E9" : "var(--theme-tag-text)",
                  background: isActive ? "rgba(14,165,233,0.1)" : "var(--theme-tag-bg)",
                }}
              >
                {chip.emoji} {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Mobile filter overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[var(--theme-bg)] lg:hidden">
          <div className="flex items-center justify-between border-b px-4 py-4" style={{ borderColor: "var(--theme-border)" }}>
            <h2 className="text-lg font-bold" style={{ color: "var(--theme-text-primary)" }}>Filters</h2>
            <button onClick={() => setMobileOpen(false)} className="text-2xl" style={{ color: "var(--theme-text-muted)" }}>&times;</button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            {/* Search */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--theme-text-muted)" }}>Search</label>
              <input
                type="text"
                placeholder="Search robots..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
                style={{ background: "var(--theme-input-bg)", borderColor: "var(--theme-input-border)", color: "var(--theme-text-primary)" }}
              />
            </div>
            {/* Price */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--theme-text-muted)" }}>Price</label>
              <div className="grid grid-cols-2 gap-2">
                {PRICE_OPTIONS.map(p => (
                  <button
                    key={p.label}
                    onClick={() => onPriceChange(p.min, p.max)}
                    className={cn("rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                      priceMin === p.min && priceMax === p.max ? "border-[#0EA5E9] text-[#0EA5E9]" : ""
                    )}
                    style={{
                      borderColor: priceMin === p.min && priceMax === p.max ? "#0EA5E9" : "var(--theme-border)",
                      color: priceMin === p.min && priceMax === p.max ? "#0EA5E9" : "var(--theme-text-secondary)",
                      background: priceMin === p.min && priceMax === p.max ? "rgba(14,165,233,0.1)" : "transparent",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Industry */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--theme-text-muted)" }}>Industry</label>
              <div className="grid grid-cols-2 gap-2">
                {INDUSTRY_OPTIONS.map(ind => {
                  const isActive = (industry || "All Industries") === ind;
                  return (
                    <button
                      key={ind}
                      onClick={() => onIndustryChange(ind === "All Industries" ? "" : ind)}
                      className={cn("rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors")}
                      style={{
                        borderColor: isActive ? "#0EA5E9" : "var(--theme-border)",
                        color: isActive ? "#0EA5E9" : "var(--theme-text-secondary)",
                        background: isActive ? "rgba(14,165,233,0.1)" : "transparent",
                      }}
                    >
                      {ind}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Sort */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--theme-text-muted)" }}>Sort</label>
              {SORT_OPTIONS.map(s => {
                const isActive = sortBy === s.value;
                return (
                  <button
                    key={s.value}
                    onClick={() => onSortChange(s.value)}
                    className="mb-1 block w-full rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors"
                    style={{
                      borderColor: isActive ? "#0EA5E9" : "var(--theme-border)",
                      color: isActive ? "#0EA5E9" : "var(--theme-text-secondary)",
                      background: isActive ? "rgba(14,165,233,0.1)" : "transparent",
                    }}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="border-t p-4" style={{ borderColor: "var(--theme-border)" }}>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-full rounded-lg py-3 text-center text-sm font-bold text-black"
              style={{ background: "#0EA5E9" }}
            >
              Apply ({totalCount} results)
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Dropdown helper ──

function FilterDropdown({
  label, options, value, onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const isDefault = value === options[0];

  return (
    <div ref={ref} className="relative hidden lg:block">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-colors",
        )}
        style={{
          borderColor: isDefault ? "var(--theme-border)" : "rgba(14,165,233,0.3)",
          color: isDefault ? "var(--theme-text-secondary)" : "#0EA5E9",
          background: isDefault ? "transparent" : "rgba(14,165,233,0.05)",
        }}
      >
        {label}
        <svg className={cn("h-3 w-3 transition-transform", open && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-1 min-w-[180px] rounded-lg border py-1 shadow-xl"
          style={{
            background: "var(--theme-surface)",
            borderColor: "var(--theme-border)",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={cn(
                "block w-full px-3 py-2 text-left text-[13px] transition-colors hover:bg-[rgba(14,165,233,0.08)]",
              )}
              style={{
                color: opt === value ? "#0EA5E9" : "var(--theme-text-secondary)",
                fontWeight: opt === value ? 600 : 400,
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
