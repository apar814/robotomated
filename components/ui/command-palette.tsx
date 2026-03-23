"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RoboScoreBadge } from "@/components/ui/robo-score";
import { PriceDisplay } from "@/components/ui/price-display";

interface SearchResult {
  id: string;
  slug: string;
  name: string;
  robo_score: number | null;
  price_current: number | null;
  category_slug: string;
  category_name: string;
  manufacturer_name: string;
  image_url: string | null;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Cmd+K / Ctrl+K
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen(true); }
      if (e.key === "Escape") { setOpen(false); setQuery(""); setResults([]); }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  // Search
  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/robots?search=${encodeURIComponent(q)}&sort=score_desc&perPage=6`);
      const data = await res.json();
      setResults(data.robots || []);
      setSelected(0);
    } catch { setResults([]); }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 200);
    return () => clearTimeout(timer);
  }, [query, search]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => Math.min(s + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
    if (e.key === "Enter" && results[selected]) {
      const r = results[selected];
      router.push(`/explore/${r.category_slug}/${r.slug}`);
      setOpen(false); setQuery(""); setResults([]);
    }
  }

  function navigate(r: SearchResult) {
    router.push(`/explore/${r.category_slug}/${r.slug}`);
    setOpen(false); setQuery(""); setResults([]);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-navy/80 pt-[12vh] backdrop-blur-sm" onClick={() => { setOpen(false); setQuery(""); setResults([]); }}>
      <div className="glass-card mx-4 w-full max-w-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4">
          <svg className="h-5 w-5 shrink-0 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search robots, manufacturers, categories..."
            className="w-full bg-transparent py-4 text-sm text-white placeholder:text-white/30 focus:outline-none"
          />
          <kbd className="rounded bg-white/[0.06] px-2 py-1 font-mono text-[10px] text-white/30">ESC</kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="max-h-80 overflow-y-auto p-2">
            {results.map((r, i) => (
              <button
                key={r.id}
                onClick={() => navigate(r)}
                className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${i === selected ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"}`}
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                  {r.image_url ? (
                    <Image src={r.image_url} alt={r.name} fill sizes="40px" className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-white/[0.04] text-xs">&#129302;</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{r.name}</p>
                  <p className="truncate text-[10px] text-white/40">{r.manufacturer_name} &middot; {r.category_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <PriceDisplay price={r.price_current} size="sm" />
                  {r.robo_score != null && r.robo_score > 0 && <RoboScoreBadge score={r.robo_score} className="text-[9px]" />}
                </div>
              </button>
            ))}
          </div>
        )}

        {query && results.length === 0 && !loading && (
          <div className="p-6 text-center text-sm text-white/30">No robots found for &ldquo;{query}&rdquo;</div>
        )}

        {loading && (
          <div className="p-6 text-center text-sm text-white/30">Searching...</div>
        )}

        {!query && (
          <div className="p-4 text-center text-xs text-white/20">Type to search robots, manufacturers, and categories</div>
        )}
      </div>
    </div>
  );
}
