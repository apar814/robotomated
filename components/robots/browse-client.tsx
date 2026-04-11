"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { RobotCard, type RobotCardData } from "@/components/robots/robot-card";
import { FilterBar } from "@/components/robots/filter-bar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

interface Category { id: string; slug: string; name: string }
interface Manufacturer { id: string; name: string; robot_count?: number }

interface BrowseClientProps {
  categories: Category[];
  manufacturers: Manufacturer[];
  initialCategory?: string;
  totalRobotCount?: number;
}

export function BrowseClient({ categories, manufacturers, initialCategory, totalRobotCount }: BrowseClientProps) {
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
  const urlIndustry = searchParams.get("industry") || "";
  const urlStatus = searchParams.get("status") || "";
  const urlSort = searchParams.get("sort") || "score_desc";
  const urlPage = parseInt(searchParams.get("page") || "1", 10);

  const [search, setSearch] = useState(urlSearch);
  const [category, setCategory] = useState(urlCategory);
  const [manufacturer, setManufacturer] = useState(urlManufacturer);
  const [priceMin, setPriceMin] = useState(urlPriceMin);
  const [priceMax, setPriceMax] = useState(urlPriceMax);
  const [scoreMin, setScoreMin] = useState(urlScoreMin);
  const [industry, setIndustry] = useState(urlIndustry);
  const [status, setStatus] = useState(urlStatus);
  const [sort, setSort] = useState(urlSort);
  const [page, setPage] = useState(urlPage);

  const [robots, setRobots] = useState<RobotCardData[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const updateUrl = useCallback((overrides: Record<string, string | number>) => {
    const params = new URLSearchParams();
    const state = { search, category, manufacturer, priceMin, priceMax, scoreMin, industry, status, sort, page, ...overrides };

    if (state.search) params.set("search", String(state.search));
    if (state.category && !initialCategory) params.set("category", String(state.category));
    if (state.manufacturer) params.set("manufacturer", String(state.manufacturer));
    if (state.priceMin) params.set("priceMin", String(state.priceMin));
    if (state.priceMax) params.set("priceMax", String(state.priceMax));
    if (state.scoreMin) params.set("scoreMin", String(state.scoreMin));
    if (state.industry) params.set("industry", String(state.industry));
    if (state.status) params.set("status", String(state.status));
    if (state.sort && state.sort !== "score_desc") params.set("sort", String(state.sort));
    if (state.page && state.page > 1) params.set("page", String(state.page));

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [search, category, manufacturer, priceMin, priceMax, scoreMin, industry, status, sort, page, pathname, router, initialCategory]);

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
    if (industry) params.set("industry", industry);
    if (status) params.set("status", status);
    if (sort) params.set("sort", sort);
    params.set("page", String(page));

    fetch(`/api/robots?${params}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        const seen = new Set<string>();
        const deduped = (data.robots || []).filter((r: RobotCardData) => {
          if (seen.has(r.slug)) return false;
          seen.add(r.slug);
          return true;
        });
        setRobots(deduped);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 0);
        setLoading(false);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setLoading(false);
      });

    return () => controller.abort();
  }, [search, category, manufacturer, priceMin, priceMax, scoreMin, industry, status, sort, page, initialCategory]);

  function applyFilter(key: string, value: string) {
    const setters: Record<string, (v: string) => void> = {
      category: setCategory, manufacturer: setManufacturer,
      priceMin: setPriceMin, priceMax: setPriceMax,
      scoreMin: setScoreMin, industry: setIndustry, status: setStatus,
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

  function handlePriceChange(min: string, max: string) {
    setPriceMin(min);
    setPriceMax(max);
    setPage(1);
    updateUrl({ priceMin: min, priceMax: max, page: 1 });
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
    setPriceMin(""); setPriceMax(""); setScoreMin("");
    setIndustry(""); setStatus(""); setSort("score_desc"); setPage(1);
    router.push(pathname, { scroll: false });
  }

  function toggleCompare(id: string) {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  }

  const hasFilters = !!(search || (!initialCategory && category) || manufacturer || priceMin || priceMax || scoreMin || industry || status);

  return (
    <div>
      {/* New filter bar */}
      <FilterBar
        search={search}
        onSearchChange={handleSearch}
        priceMin={priceMin}
        priceMax={priceMax}
        onPriceChange={handlePriceChange}
        industry={industry}
        onIndustryChange={(v) => applyFilter("industry", v)}
        scoreMin={scoreMin}
        onScoreMinChange={(v) => applyFilter("scoreMin", v)}
        sortBy={sort}
        onSortChange={handleSort}
        onClear={clearFilters}
        hasFilters={hasFilters}
        totalCount={total}
        totalAll={totalRobotCount || total}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex gap-6">
          {/* Sidebar — manufacturers + category (when not on category page) */}
          <aside className="hidden w-52 shrink-0 space-y-6 lg:block">
            {!initialCategory && categories.length > 0 && (
              <FilterSection title="Category">
                {categories.map((c) => (
                  <FilterButton key={c.id} label={c.name} active={category === c.slug}
                    onClick={() => applyFilter("category", category === c.slug ? "" : c.slug)} />
                ))}
              </FilterSection>
            )}

            {manufacturers.length > 0 && (
              <FilterSection title="Manufacturer">
                {manufacturers.map((m) => (
                  <FilterButton
                    key={m.id}
                    label={m.robot_count ? `${m.name} (${m.robot_count})` : m.name}
                    active={manufacturer === m.id}
                    onClick={() => applyFilter("manufacturer", manufacturer === m.id ? "" : m.id)}
                  />
                ))}
              </FilterSection>
            )}

            {hasFilters && (
              <button onClick={clearFilters} className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-wide" style={{ color: "#FF006E" }}>
                Clear all filters
              </button>
            )}
          </aside>

          {/* Results */}
          <div className="min-w-0 flex-1">
            {loading && (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-xl p-5" style={{ background: "var(--theme-card)" }}>
                    <div className="mb-4 h-40 w-full animate-shimmer rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }} />
                    <div className="mb-2 h-2 w-16 animate-shimmer rounded" style={{ background: "rgba(255,255,255,0.03)" }} />
                    <div className="mb-2 h-5 w-3/4 animate-shimmer rounded" style={{ background: "rgba(255,255,255,0.03)" }} />
                    <div className="mb-3 h-3 w-full animate-shimmer rounded" style={{ background: "rgba(255,255,255,0.03)" }} />
                    <div className="h-3 w-2/3 animate-shimmer rounded" style={{ background: "rgba(255,255,255,0.03)" }} />
                  </div>
                ))}
              </div>
            )}

            {!loading && robots.length === 0 && (
              <div className="flex flex-col items-center rounded-xl border px-6 py-16 text-center" style={{ borderColor: "var(--theme-border)", background: "var(--theme-card)" }}>
                <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "var(--theme-tag-bg)" }}>
                  <svg className="h-7 w-7" style={{ color: "var(--theme-text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <p className="mt-4 text-lg font-semibold" style={{ color: "var(--theme-text-primary)" }}>No robots match these filters</p>
                <p className="mt-1 max-w-sm text-sm" style={{ color: "var(--theme-text-muted)" }}>
                  Adjust your criteria, or tell Robotimus what you need — it can search across all {totalRobotCount || total} robots for the best match.
                </p>
                <div className="mt-5 flex gap-3">
                  {hasFilters && (
                    <button onClick={clearFilters} className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors" style={{ borderColor: "var(--theme-border)", color: "var(--theme-text-secondary)" }}>
                      Clear filters
                    </button>
                  )}
                  <Link href="/advisor" className="rounded-lg px-4 py-2 text-sm font-semibold text-black" style={{ background: "#0EA5E9" }}>
                    Ask Robotimus &rarr;
                  </Link>
                </div>
              </div>
            )}

            {!loading && robots.length > 0 && (
              <>
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

                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <Button variant="secondary" disabled={page <= 1} onClick={() => handlePage(page - 1)} className="text-xs">Previous</Button>
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => handlePage(p)}
                        className={cn(
                          "h-8 w-8 rounded-md font-[family-name:var(--font-brand)] text-xs font-medium transition-colors",
                          p === page ? "bg-[#0EA5E9] text-white" : "hover:bg-[rgba(14,165,233,0.08)]"
                        )}
                        style={{ color: p === page ? undefined : "var(--theme-text-muted)" }}
                      >
                        {p}
                      </button>
                    ))}
                    <Button variant="secondary" disabled={page >= totalPages} onClick={() => handlePage(page + 1)} className="text-xs">Next</Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Compare bar */}
        {compareIds.length >= 2 && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t px-4 py-3 shadow-lg backdrop-blur-md" style={{ borderColor: "var(--theme-border)", background: "var(--theme-nav-bg)" }}>
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium" style={{ color: "var(--theme-text-primary)" }}><span className="font-[family-name:var(--font-brand)]">{compareIds.length}</span> robots selected</span>
                <button onClick={() => setCompareIds([])} className="text-xs" style={{ color: "var(--theme-text-muted)" }}>Clear</button>
              </div>
              <Link href={`/explore/compare?ids=${compareIds.join(",")}`}
                className="rounded-md px-6 py-2 text-sm font-semibold text-black"
                style={{ background: "#0EA5E9" }}>
                Compare Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="mb-1 block font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#0EA5E9]">[ {title} ]</span>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "block w-full rounded-md px-2.5 py-1.5 text-left font-[family-name:var(--font-ui)] text-[11px] uppercase tracking-wide transition-colors",
        active && "font-medium"
      )}
      style={{
        color: active ? "#0EA5E9" : "var(--theme-text-muted)",
        background: active ? "rgba(14,165,233,0.08)" : "transparent",
      }}
    >
      {label}
    </button>
  );
}
