"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

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
  const [closing, setClosing] = useState(false);
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
        setClosing(false);
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
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setQuery("");
      setResults(null);
      setSelected(0);
    }, 150);
  }

  function navigateTo(href: string) {
    router.push(href);
    setOpen(false);
    setClosing(false);
    setQuery("");
    setResults(null);
    setSelected(0);
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

  /* ── Track item index across sections ── */
  let itemIndex = 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9999]"
        style={{
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          animation: closing ? "cpFadeOut 150ms ease-in forwards" : "cpFadeIn 220ms ease-out",
        }}
        onClick={close}
      />

      {/* Modal */}
      <div
        className="fixed left-1/2 z-[10000]"
        style={{
          top: "12%",
          width: "min(720px, 92vw)",
          transform: "translateX(-50%)",
          animation: closing
            ? "cpSlideOut 150ms ease-in forwards"
            : "cpSlideIn 220ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative overflow-hidden"
          style={{
            background: "#080808",
            border: "1px solid rgba(14,165,233,0.25)",
            borderRadius: "16px",
            boxShadow:
              "0 0 0 1px rgba(14,165,233,0.1), 0 0 60px rgba(14,165,233,0.15), 0 32px 80px rgba(0,0,0,0.8)",
          }}
        >
          {/* Corner brackets */}
          <CornerBracket position="top-left" />
          <CornerBracket position="top-right" />
          <CornerBracket position="bottom-left" />
          <CornerBracket position="bottom-right" />

          {/* Search input row */}
          <div
            className="flex items-center gap-3"
            style={{ padding: "18px 20px", borderBottom: "1px solid rgba(14,165,233,0.1)" }}
          >
            {loading ? (
              <div
                className="h-[20px] w-[20px] shrink-0 animate-spin rounded-full border-2 border-transparent"
                style={{ borderTopColor: "#0EA5E9" }}
              />
            ) : (
              <svg
                className="h-[20px] w-[20px] shrink-0"
                style={{ color: "#0EA5E9" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            )}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search robots, manufacturers, tasks..."
              className="min-w-0 flex-1 bg-transparent font-normal text-white outline-none"
              style={{
                fontSize: "20px",
                caretColor: "#0EA5E9",
                fontFamily: "inherit",
              }}
            />
            <kbd
              className="shrink-0 cursor-pointer select-none font-mono"
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.3)",
                fontSize: "10px",
                padding: "3px 7px",
                borderRadius: "4px",
              }}
              onClick={close}
            >
              ESC
            </kbd>
          </div>

          {/* Results area */}
          <div
            className="cp-scroll"
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
                    animDelay={i * 20}
                  >
                    <span className="text-base">{link.icon}</span>
                    <span className="flex-1 text-sm font-medium text-white">{link.label}</span>
                    <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>&rarr;</span>
                  </ResultRow>
                ))}

                <SectionHeader label="Search by Task" />
                <div className="flex flex-wrap gap-2 px-5 pb-4">
                  {BROWSE_CHIPS.map((chip) => (
                    <button
                      key={chip.href}
                      onClick={() => navigateTo(chip.href)}
                      className="transition-all duration-150"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.7)",
                        padding: "6px 14px",
                        borderRadius: "6px",
                        fontSize: "12px",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = "rgba(14,165,233,0.5)";
                        e.currentTarget.style.color = "#0EA5E9";
                        e.currentTarget.style.background = "rgba(14,165,233,0.08)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      }}
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
                    <SectionHeader label="Robots" />
                    {results.robots.map((r) => {
                      const idx = itemIndex++;
                      return (
                        <ResultRow
                          key={r.id}
                          selected={selected === idx}
                          onClick={() => navigateTo(`/explore/${r.category_slug}/${r.slug}`)}
                          onMouseEnter={() => setSelected(idx)}
                          animDelay={idx * 20}
                          tall
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
                            <p className="truncate text-sm font-bold text-white">{r.name}</p>
                            <p className="truncate text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                              {r.manufacturer_name} &middot; {r.category_name}
                            </p>
                          </div>
                          {/* Score + price */}
                          <div className="flex shrink-0 items-center gap-2">
                            {r.robo_score != null && r.robo_score > 0 && (
                              <span
                                className="font-mono text-xs font-bold"
                                style={{
                                  background: "rgba(14,165,233,0.15)",
                                  color: "#0EA5E9",
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  border: "1px solid rgba(14,165,233,0.2)",
                                }}
                              >
                                {Math.round(r.robo_score)}
                              </span>
                            )}
                            <span className="text-xs font-semibold" style={{ color: "#84CC16" }}>
                              {r.price_current ? `$${r.price_current.toLocaleString()}` : "Quote"}
                            </span>
                          </div>
                        </ResultRow>
                      );
                    })}
                  </>
                )}

                {results.manufacturers.length > 0 && (
                  <>
                    <SectionHeader label="Manufacturers" />
                    {results.manufacturers.map((m) => {
                      const idx = itemIndex++;
                      return (
                        <ResultRow
                          key={m.id}
                          selected={selected === idx}
                          onClick={() => navigateTo(`/manufacturers/${m.slug}`)}
                          onMouseEnter={() => setSelected(idx)}
                          animDelay={idx * 20}
                        >
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center text-xs font-bold"
                            style={{
                              borderRadius: "6px",
                              background: "rgba(255,255,255,0.06)",
                              color: "rgba(255,255,255,0.4)",
                            }}
                          >
                            {m.name[0]}
                          </div>
                          <span className="flex-1 text-sm font-medium text-white">{m.name}</span>
                          <span className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                            /{m.slug}
                          </span>
                        </ResultRow>
                      );
                    })}
                  </>
                )}

                {results.categories.length > 0 && (
                  <>
                    <SectionHeader label="Categories" />
                    {results.categories.map((c) => {
                      const idx = itemIndex++;
                      return (
                        <ResultRow
                          key={c.id}
                          selected={selected === idx}
                          onClick={() => navigateTo(`/explore/${c.slug}`)}
                          onMouseEnter={() => setSelected(idx)}
                          animDelay={idx * 20}
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
                <div className="mx-auto mb-4 text-5xl" style={{ opacity: 0.08 }}>{"\ud83e\udd16"}</div>
                <p className="text-[15px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                  No robots found for &ldquo;{query}&rdquo;
                </p>
                <p className="mt-1 text-[13px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                  Try: warehouse, cobot, Boston Dynamics
                </p>
              </div>
            )}

            {/* Loading with no results yet */}
            {hasQuery && loading && !results && (
              <div className="flex items-center justify-center py-12">
                <div
                  className="h-6 w-6 animate-spin rounded-full border-2 border-transparent"
                  style={{ borderTopColor: "#0EA5E9" }}
                />
              </div>
            )}
          </div>

          {/* AI Insight bar */}
          {hasQuery && (
            <button
              onClick={() => navigateTo(`/advisor?q=${encodeURIComponent(query)}`)}
              className="flex w-full items-center gap-3 text-left transition-colors duration-150 hover:bg-[rgba(14,165,233,0.08)]"
              style={{
                padding: "12px 20px",
                borderTop: "1px solid rgba(14,165,233,0.1)",
                background: "rgba(14,165,233,0.05)",
              }}
            >
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                style={{ background: "rgba(14,165,233,0.15)", border: "1px solid rgba(14,165,233,0.25)" }}
              >
                <svg className="h-3 w-3" style={{ color: "#0EA5E9" }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2a1 1 0 0 1 1 1v2.07A8.002 8.002 0 0 1 19.93 12H22a1 1 0 1 1 0 2h-2.07A8.002 8.002 0 0 1 13 20.93V23a1 1 0 1 1-2 0v-2.07A8.002 8.002 0 0 1 4.07 14H2a1 1 0 1 1 0-2h2.07A8.002 8.002 0 0 1 11 5.07V3a1 1 0 0 1 1-1zm0 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                </svg>
              </div>
              <span className="flex-1 text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                Ask Robotimus about &lsquo;<span className="text-white/70">{query}</span>&rsquo;
              </span>
              <span className="text-[11px] font-semibold" style={{ color: "#0EA5E9" }}>&rarr;</span>
            </button>
          )}

          {/* Keyboard shortcuts footer */}
          <div
            className="flex items-center justify-between"
            style={{
              height: "36px",
              padding: "0 20px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center gap-3">
              <KbdHint keys={["\u2191\u2193"]} label="navigate" />
              <KbdHint keys={["\u21b5"]} label="select" />
              <KbdHint keys={["esc"]} label="close" />
            </div>
            <span
              className="select-none font-[family-name:var(--font-brand)]"
              style={{
                fontSize: "8px",
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.15)",
                textTransform: "uppercase",
              }}
            >
              Robotomated Intelligence
            </span>
          </div>
        </div>
      </div>

      {/* Animations + scrollbar */}
      <style jsx global>{`
        @keyframes cpFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes cpFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes cpSlideIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-12px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }
        @keyframes cpSlideOut {
          from {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateX(-50%) translateY(0) scale(0.97);
          }
        }
        @keyframes cpRowIn {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .cp-scroll::-webkit-scrollbar { width: 4px; }
        .cp-scroll::-webkit-scrollbar-track { background: transparent; }
        .cp-scroll::-webkit-scrollbar-thumb { background: rgba(14,165,233,0.2); border-radius: 2px; }
        .cp-scroll::-webkit-scrollbar-thumb:hover { background: rgba(14,165,233,0.4); }
      `}</style>
    </>
  );
}

/* ── Subcomponents ── */

function CornerBracket({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const size = 12;
  const width = 2;
  const color = "rgba(14,165,233,0.4)";
  const offset = 6;

  const styles: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    pointerEvents: "none",
    zIndex: 1,
  };

  switch (position) {
    case "top-left":
      styles.top = offset;
      styles.left = offset;
      styles.borderTop = `${width}px solid ${color}`;
      styles.borderLeft = `${width}px solid ${color}`;
      break;
    case "top-right":
      styles.top = offset;
      styles.right = offset;
      styles.borderTop = `${width}px solid ${color}`;
      styles.borderRight = `${width}px solid ${color}`;
      break;
    case "bottom-left":
      styles.bottom = offset;
      styles.left = offset;
      styles.borderBottom = `${width}px solid ${color}`;
      styles.borderLeft = `${width}px solid ${color}`;
      break;
    case "bottom-right":
      styles.bottom = offset;
      styles.right = offset;
      styles.borderBottom = `${width}px solid ${color}`;
      styles.borderRight = `${width}px solid ${color}`;
      break;
  }

  return <div style={styles} />;
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div
      className="font-mono"
      style={{
        padding: "10px 20px 4px",
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.14em",
        color: "rgba(255,255,255,0.25)",
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
  );
}

function ResultRow({
  selected,
  onClick,
  onMouseEnter,
  children,
  animDelay = 0,
  tall = false,
}: {
  selected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  children: React.ReactNode;
  animDelay?: number;
  tall?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className="flex w-full items-center gap-3 text-left transition-all duration-100"
      style={{
        height: tall ? "56px" : undefined,
        padding: tall ? "0 20px" : "10px 20px",
        background: selected ? "rgba(14,165,233,0.08)" : "transparent",
        borderLeft: selected ? "2px solid #0EA5E9" : "2px solid transparent",
        animation: `cpRowIn 180ms ${animDelay}ms both cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      {children}
    </button>
  );
}

function KbdHint({ keys, label }: { keys: string[]; label: string }) {
  return (
    <span
      className="flex items-center gap-1 font-mono"
      style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}
    >
      {keys.map((k) => (
        <kbd
          key={k}
          style={{
            background: "rgba(255,255,255,0.08)",
            padding: "1px 5px",
            borderRadius: "3px",
            fontSize: "10px",
          }}
        >
          {k}
        </kbd>
      ))}
      <span className="ml-0.5">{label}</span>
    </span>
  );
}
