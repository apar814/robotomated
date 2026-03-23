"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { RobotCard, type RobotCardData } from "@/components/robots/robot-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

interface Category {
  id: string;
  slug: string;
  name: string;
}

interface Manufacturer {
  id: string;
  name: string;
}

interface BrowseClientProps {
  categories: Category[];
  manufacturers: Manufacturer[];
  initialCategory?: string;
}

const SORT_OPTIONS = [
  { value: "score_desc", label: "Top Rated" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

export function BrowseClient({ categories, manufacturers, initialCategory }: BrowseClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read state from URL
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = initialCategory || searchParams.get("category") || "";
  const urlManufacturer = searchParams.get("manufacturer") || "";
  const urlPriceMin = searchParams.get("priceMin") || "";
  const urlPriceMax = searchParams.get("priceMax") || "";
  const urlScoreMin = searchParams.get("scoreMin") || "";
  const urlStatus = searchParams.get("status") || "";
  const urlSort = searchParams.get("sort") || "score_desc";
  const urlPage = parseInt(searchParams.get("page") || "1", 10);

  // Local filter state
  const [search, setSearch] = useState(urlSearch);
  const [category, setCategory] = useState(urlCategory);
  const [manufacturer, setManufacturer] = useState(urlManufacturer);
  const [priceMin, setPriceMin] = useState(urlPriceMin);
  const [priceMax, setPriceMax] = useState(urlPriceMax);
  const [scoreMin, setScoreMin] = useState(urlScoreMin);
  const [status, setStatus] = useState(urlStatus);
  const [sort, setSort] = useState(urlSort);
  const [page, setPage] = useState(urlPage);

  // Data state
  const [robots, setRobots] = useState<RobotCardData[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // Compare state
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Sidebar mobile toggle
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Build query params and push to URL
  const updateUrl = useCallback((overrides: Record<string, string | number>) => {
    const params = new URLSearchParams();
    const state = { search, category, manufacturer, priceMin, priceMax, scoreMin, status, sort, page, ...overrides };

    if (state.search) params.set("search", String(state.search));
    if (state.category && !initialCategory) params.set("category", String(state.category));
    if (state.manufacturer) params.set("manufacturer", String(state.manufacturer));
    if (state.priceMin) params.set("priceMin", String(state.priceMin));
    if (state.priceMax) params.set("priceMax", String(state.priceMax));
    if (state.scoreMin) params.set("scoreMin", String(state.scoreMin));
    if (state.status) params.set("status", String(state.status));
    if (state.sort && state.sort !== "score_desc") params.set("sort", String(state.sort));
    if (state.page && state.page > 1) params.set("page", String(state.page));

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [search, category, manufacturer, priceMin, priceMax, scoreMin, status, sort, page, pathname, router, initialCategory]);

  // Fetch robots
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    const params = new URLSearchParams();
    if (search) params.set("search", search);
    const cat = initialCategory || category;
    if (cat) params.set("category", cat);
    if (manufacturer) params.set("manufacturer", manufacturer);
    if (priceMin) params.set("priceMin", priceMin);
    if (priceMax) params.set("priceMax", priceMax);
    if (scoreMin) params.set("scoreMin", scoreMin);
    if (status) params.set("status", status);
    if (sort) params.set("sort", sort);
    params.set("page", String(page));

    fetch(`/api/robots?${params}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        setRobots(data.robots || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 0);
        setLoading(false);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setLoading(false);
      });

    return () => controller.abort();
  }, [search, category, manufacturer, priceMin, priceMax, scoreMin, status, sort, page, initialCategory]);

  function applyFilter(key: string, value: string) {
    const setters: Record<string, (v: string) => void> = {
      category: setCategory, manufacturer: setManufacturer,
      priceMin: setPriceMin, priceMax: setPriceMax,
      scoreMin: setScoreMin, status: setStatus,
    };
    setters[key]?.(value);
    setPage(1);
    updateUrl({ [key]: value, page: 1 });
  }

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
    updateUrl({ search: value, page: 1 });
  }

  function handleSort(value: string) {
    setSort(value);
    setPage(1);
    updateUrl({ sort: value, page: 1 });
  }

  function handlePage(p: number) {
    setPage(p);
    updateUrl({ page: p });
  }

  function clearFilters() {
    setSearch(""); setCategory(""); setManufacturer("");
    setPriceMin(""); setPriceMax(""); setScoreMin(""); setStatus("");
    setSort("score_desc"); setPage(1);
    router.push(pathname, { scroll: false });
  }

  function toggleCompare(id: string) {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  }

  const hasFilters = search || category || manufacturer || priceMin || priceMax || scoreMin || status;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Search + Sort bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search robots, manufacturers, specs..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-navy-light py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-blue focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="rounded-lg border border-border px-3 py-2 text-sm text-muted hover:text-foreground lg:hidden"
          >
            Filters {hasFilters ? "●" : ""}
          </button>
          <select
            value={sort}
            onChange={(e) => handleSort(e.target.value)}
            className="rounded-lg border border-border bg-navy-light px-3 py-2.5 text-sm text-foreground focus:border-blue focus:outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className={cn(
          "w-56 shrink-0 space-y-6",
          filtersOpen ? "block" : "hidden lg:block"
        )}>
          {/* Category */}
          {!initialCategory && (
            <FilterSection title="Category">
              {categories.map((c) => (
                <FilterButton
                  key={c.id}
                  label={c.name}
                  active={category === c.slug}
                  onClick={() => applyFilter("category", category === c.slug ? "" : c.slug)}
                />
              ))}
            </FilterSection>
          )}

          {/* Manufacturer */}
          <FilterSection title="Manufacturer">
            {manufacturers.map((m) => (
              <FilterButton
                key={m.id}
                label={m.name}
                active={manufacturer === m.id}
                onClick={() => applyFilter("manufacturer", manufacturer === m.id ? "" : m.id)}
              />
            ))}
          </FilterSection>

          {/* Price Range */}
          <FilterSection title="Price Range">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={priceMin}
                onChange={(e) => applyFilter("priceMin", e.target.value)}
                className="w-full rounded border border-border bg-navy-lighter px-2 py-1.5 text-xs text-foreground focus:border-blue focus:outline-none"
              />
              <span className="text-muted">–</span>
              <input
                type="number"
                placeholder="Max"
                value={priceMax}
                onChange={(e) => applyFilter("priceMax", e.target.value)}
                className="w-full rounded border border-border bg-navy-lighter px-2 py-1.5 text-xs text-foreground focus:border-blue focus:outline-none"
              />
            </div>
          </FilterSection>

          {/* RoboScore Min */}
          <FilterSection title="Min RoboScore">
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={scoreMin || 0}
              onChange={(e) => applyFilter("scoreMin", e.target.value === "0" ? "" : e.target.value)}
              className="w-full accent-blue"
            />
            <div className="flex justify-between text-[10px] text-muted">
              <span>0</span>
              <span className="font-mono text-foreground">{scoreMin || "Any"}</span>
              <span>100</span>
            </div>
          </FilterSection>

          {/* Status */}
          <FilterSection title="Status">
            {[
              { value: "active", label: "Available" },
              { value: "coming_soon", label: "Coming Soon" },
              { value: "discontinued", label: "Discontinued" },
            ].map((s) => (
              <FilterButton
                key={s.value}
                label={s.label}
                active={status === s.value}
                onClick={() => applyFilter("status", status === s.value ? "" : s.value)}
              />
            ))}
          </FilterSection>

          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-muted hover:text-foreground">
              Clear all filters
            </button>
          )}
        </aside>

        {/* Results */}
        <div className="min-w-0 flex-1">
          <p className="mb-4 text-sm text-muted">
            {loading ? "Loading..." : `${total} robot${total === 1 ? "" : "s"} found`}
          </p>

          {!loading && robots.length === 0 && (
            <div className="flex flex-col items-center py-20 text-center">
              <p className="text-lg font-semibold">No robots found</p>
              <p className="mt-2 text-sm text-muted">Try adjusting your filters or search terms.</p>
              {hasFilters && (
                <button onClick={clearFilters} className="mt-4 text-sm text-blue hover:underline">
                  Clear all filters
                </button>
              )}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {robots.map((robot) => (
              <RobotCard
                key={robot.id}
                robot={robot}
                compareSelected={compareIds.includes(robot.id)}
                onCompareToggle={toggleCompare}
                compareDisabled={compareIds.length >= 3}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                disabled={page <= 1}
                onClick={() => handlePage(page - 1)}
                className="text-xs"
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePage(p)}
                  className={cn(
                    "h-8 w-8 rounded-lg text-xs font-medium transition-colors",
                    p === page ? "bg-blue text-navy" : "text-muted hover:bg-navy-lighter hover:text-foreground"
                  )}
                >
                  {p}
                </button>
              ))}
              <Button
                variant="secondary"
                disabled={page >= totalPages}
                onClick={() => handlePage(page + 1)}
                className="text-xs"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Compare bar */}
      {compareIds.length >= 2 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-navy-light/95 px-4 py-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">
                {compareIds.length} robots selected
              </span>
              <button onClick={() => setCompareIds([])} className="text-xs text-muted hover:text-foreground">
                Clear
              </button>
            </div>
            <Link
              href={`/explore/compare?ids=${compareIds.join(",")}`}
              className="rounded-lg bg-blue px-6 py-2 text-sm font-semibold text-navy transition-opacity hover:opacity-90"
            >
              Compare Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{title}</h4>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "block w-full rounded-md px-2.5 py-1.5 text-left text-xs transition-colors",
        active ? "bg-blue/10 font-medium text-blue" : "text-muted hover:bg-navy-lighter hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}
