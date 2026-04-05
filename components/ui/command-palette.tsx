"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* ── Types ── */

interface RobotResult {
  id: string;
  slug: string;
  name: string;
  robo_score: number | null;
  price_current: number | null;
  category_slug: string;
  category_name: string;
  manufacturer_name: string;
  manufacturer_slug: string;
  image_url: string | null;
}

interface ManufacturerResult { id: string; name: string; slug: string }
interface CategoryResult { id: string; name: string; slug: string }

interface SearchResults {
  robots: RobotResult[];
  manufacturers: ManufacturerResult[];
  categories: CategoryResult[];
}

/* ── Quick access items ── */

const QUICK_LINKS = [
  { icon: "\ud83e\udd16", label: "Explore All Robots", href: "/explore" },
  { icon: "\u26a1", label: "Post a RoboWork Job", href: "/robowork/post" },
  { icon: "\ud83c\udf93", label: "Get RCO Certified", href: "/certify" },
  { icon: "\ud83d\udd0d", label: "Find My Robot", href: "/find-my-robot" },
];

const BROWSE_CHIPS = [
  { label: "Warehouse", href: "/explore/warehouse" },
  { label: "Medical", href: "/explore/medical" },
  { label: "Security", href: "/explore/security" },
  { label: "Manufacturing", href: "/explore/manufacturing" },
];

/* ── Component ── */

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // All navigable items flattened for keyboard nav
  const allItems = results
    ? [
        ...results.robots.map((r) => ({ type: "robot" as const, href: `/explore/${r.category_slug}/${r.slug}`, data: r })),
        ...results.manufacturers.map((m) => ({ type: "manufacturer" as const, href: `/manufacturers/${m.slug}`, data: m })),
        ...results.categories.map((c) => ({ type: "category" as const, href: `/explore/${c.slug}`, data: c })),
      ]
    : [];

  /* ── Open / Close ── */

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape" && open) {
        close();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function close() {
    setOpen(false);
    setQuery("");
    setResults(null);
    setSelected(0);
  }

  function navigateTo(href: string) {
    router.push(href);
    close();
  }

  /* ── Search ── */

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults(null); setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=6`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
        setSelected(0);
      }
    } catch {
      // Silent fail
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults(null); return; }
    const timer = setTimeout(() => doSearch(query), 250);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  /* ── Keyboard navigation ── */

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, (query ? allItems.length : QUICK_LINKS.length) - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (query && allItems[selected]) {
        navigateTo(allItems[selected].href);
      } else if (!query && QUICK_LINKS[selected]) {
        navigateTo(QUICK_LINKS[selected].href);
      }
    }
  }

  if (!open) return null;

  const hasQuery = query.trim().length > 0;
  const noResults = hasQuery && results && results.robots.length === 0 && results.manufacturers.length === 0 && results.categories.length === 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9999]"
        style={{
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(8px)",
          animation: "searchFadeIn 150ms ease-out",
        }}
        onClick={close}
      />

      {/* Modal */}
      <div
        className="fixed left-1/2 z-[10000] w-[min(680px,90vw)]"
        style={{
          top: "15%",
          transform: "translateX(-50%)",
          animation: "searchSlideIn 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            background: "#0D0D0D",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            boxShadow: "0 0 0 1px rgba(14,165,233,0.15), 0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(14,165,233,0.08)",
            overflow: "hidden",
          }}
        >
          {/* Search input row */}
          <div
            className="flex items-center gap-3"
            style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <svg className="h-[18px] w-[18px] shrink-0" style={{ color: "#0EA5E9" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search robots, manufacturers, tasks..."
              className="min-w-0 flex-1 bg-transparent text-lg font-normal text-white outline-none"
              style={{ caretColor: "#0EA5E9", fontFamily: "inherit" }}
            />
            {loading && (
              <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-transparent" style={{ borderTopColor: "#0EA5E9" }} />
            )}
            {!loading && (
              <kbd
                className="shrink-0 cursor-pointer select-none"
                style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", fontSize: "11px", padding: "2px 6px", borderRadius: "4px" }}
                onClick={close}
              >
                ESC
              </kbd>
            )}
          </div>

          {/* Results area */}
          <div
            className="search-results-scroll"
            style={{ maxHeight: "480px", overflowY: "auto" }}
          >
            {/* Default state — no query */}
            {!hasQuery && (
              <>
                <SectionHeader label="Quick Access" />
                {QUICK_LINKS.map((link, i) => (
                  <ResultRow
                    key={link.href}
                    selected={selected === i}
                    onClick={() => navigateTo(link.href)}
                    onMouseEnter={() => setSelected(i)}
                  >
                    <span className="text-base">{link.icon}</span>
                    <span className="flex-1 text-sm font-medium text-white">{link.label}</span>
                    <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>&rarr;</span>
                  </ResultRow>
                ))}

                <SectionHeader label="Browse by Category" />
                <div className="flex flex-wrap gap-2 px-5 pb-4">
                  {BROWSE_CHIPS.map((chip) => (
                    <button
                      key={chip.href}
                      onClick={() => navigateTo(chip.href)}
                      className="transition-colors"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.7)",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = "#0EA5E9"; e.currentTarget.style.color = "#0EA5E9"; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Search results */}
            {hasQuery && results && (
              <>
                {results.robots.length > 0 && (
                  <>
                    <SectionHeader label={`Robots (${results.robots.length})`} />
                    {results.robots.map((r, i) => (
                      <ResultRow
                        key={r.id}
                        selected={selected === i}
                        onClick={() => navigateTo(`/explore/${r.category_slug}/${r.slug}`)}
                        onMouseEnter={() => setSelected(i)}
                      >
                        {/* Image */}
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden"
                          style={{ borderRadius: "8px", background: "rgba(255,255,255,0.04)" }}
                        >
                          {r.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={r.image_url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-sm" style={{ color: "rgba(255,255,255,0.15)" }}>{"\ud83e\udd16"}</span>
                          )}
                        </div>
                        {/* Name + details */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">{r.name}</p>
                          <p className="truncate text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                            {r.manufacturer_name} &middot; {r.category_name}
                          </p>
                        </div>
                        {/* Score + price */}
                        <div className="flex shrink-0 items-center gap-2">
                          {r.robo_score != null && r.robo_score > 0 && (
                            <span
                              className="font-mono text-xs font-bold"
                              style={{ background: "rgba(14,165,233,0.15)", color: "#0EA5E9", padding: "2px 6px", borderRadius: "4px" }}
                            >
                              {Math.round(r.robo_score)}
                            </span>
                          )}
                          <span className="text-xs font-medium" style={{ color: "#C8FF00" }}>
                            {r.price_current ? `$${r.price_current.toLocaleString()}` : "Quote"}
                          </span>
                        </div>
                      </ResultRow>
                    ))}
                  </>
                )}

                {results.manufacturers.length > 0 && (
                  <>
                    <SectionHeader label="Manufacturers" />
                    {results.manufacturers.map((m, i) => {
                      const idx = results.robots.length + i;
                      return (
                        <ResultRow
                          key={m.id}
                          selected={selected === idx}
                          onClick={() => navigateTo(`/manufacturers/${m.slug}`)}
                          onMouseEnter={() => setSelected(idx)}
                        >
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center text-xs font-bold"
                            style={{ borderRadius: "6px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
                          >
                            {m.name[0]}
                          </div>
                          <span className="flex-1 text-sm font-medium text-white">{m.name}</span>
                          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>&rarr;</span>
                        </ResultRow>
                      );
                    })}
                  </>
                )}

                {results.categories.length > 0 && (
                  <>
                    <SectionHeader label="Categories" />
                    {results.categories.map((c, i) => {
                      const idx = results.robots.length + results.manufacturers.length + i;
                      return (
                        <ResultRow
                          key={c.id}
                          selected={selected === idx}
                          onClick={() => navigateTo(`/explore/${c.slug}`)}
                          onMouseEnter={() => setSelected(idx)}
                        >
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center text-sm"
                            style={{ borderRadius: "6px", background: "rgba(14,165,233,0.1)" }}
                          >
                            {"\ud83d\udcc1"}
                          </div>
                          <span className="flex-1 text-sm font-medium text-white">{c.name}</span>
                          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>&rarr;</span>
                        </ResultRow>
                      );
                    })}
                  </>
                )}
              </>
            )}

            {/* No results */}
            {noResults && (
              <div className="px-5 py-12 text-center">
                <div className="mx-auto mb-4 text-5xl" style={{ opacity: 0.1 }}>{"\ud83e\udd16"}</div>
                <p className="text-[15px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                  No robots found for &ldquo;{query}&rdquo;
                </p>
                <p className="mt-1 text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Try: warehouse, cobot, Boston Dynamics
                </p>
                <button
                  onClick={() => navigateTo(`/advisor?q=${encodeURIComponent(query)}`)}
                  className="mt-4 text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ color: "#0EA5E9" }}
                >
                  Ask Robotimus &rarr;
                </button>
              </div>
            )}

            {/* Loading with no results yet */}
            {hasQuery && loading && !results && (
              <div className="flex items-center justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-transparent" style={{ borderTopColor: "#0EA5E9" }} />
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between"
            style={{
              height: "40px",
              padding: "0 20px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center gap-3">
              <KbdHint keys={["\u2191\u2193"]} label="navigate" />
              <KbdHint keys={["\u21b5"]} label="open" />
              <KbdHint keys={["esc"]} label="close" />
            </div>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
              Powered by Robotomated
            </span>
          </div>
        </div>
      </div>

      {/* Animations + scrollbar */}
      <style jsx global>{`
        @keyframes searchFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes searchSlideIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-16px) scale(0.97); }
          to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        .search-results-scroll::-webkit-scrollbar { width: 4px; }
        .search-results-scroll::-webkit-scrollbar-track { background: transparent; }
        .search-results-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>
    </>
  );
}

/* ── Subcomponents ── */

function SectionHeader({ label }: { label: string }) {
  return (
    <div style={{ padding: "8px 20px 4px", fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
      {label}
    </div>
  );
}

function ResultRow({
  selected,
  onClick,
  onMouseEnter,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className="flex w-full items-center gap-3 text-left transition-colors"
      style={{
        padding: "10px 20px",
        background: selected ? "rgba(14,165,233,0.08)" : "transparent",
        borderLeft: selected ? "2px solid #0EA5E9" : "2px solid transparent",
      }}
    >
      {children}
    </button>
  );
}

function KbdHint({ keys, label }: { keys: string[]; label: string }) {
  return (
    <span className="flex items-center gap-1" style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>
      {keys.map((k) => (
        <kbd key={k} style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: "3px", fontSize: "10px" }}>
          {k}
        </kbd>
      ))}
      <span>{label}</span>
    </span>
  );
}
