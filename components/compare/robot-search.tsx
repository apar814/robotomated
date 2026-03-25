"use client";

import { useState, useEffect, useRef } from "react";

interface SearchResult {
  slug: string;
  name: string;
  manufacturer_name: string;
  robo_score: number | null;
}

export function RobotSearch({ onSelect, excludeSlugs = [] }: { onSelect: (slug: string) => void; excludeSlugs?: string[] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/robots?search=${encodeURIComponent(query)}&sort=score_desc`);
      const data = await res.json();
      setResults((data.robots || []).filter((r: SearchResult) => !excludeSlugs.includes(r.slug)).slice(0, 6));
      setOpen(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [query, excludeSlugs]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-2 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-4 py-3">
        <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search robots to add..."
          className="w-full bg-transparent text-sm text-foreground placeholder:text-neutral-400 focus:outline-none"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute inset-x-0 top-full z-10 mt-1 rounded-lg border border-border bg-white py-1 shadow-lg">
          {results.map((r) => (
            <button key={r.slug} onClick={() => { onSelect(r.slug); setQuery(""); setOpen(false); }}
              className="flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-neutral-50">
              <div>
                <span className="font-medium text-foreground">{r.name}</span>
                <span className="ml-2 text-xs text-neutral-400">{r.manufacturer_name}</span>
              </div>
              {r.robo_score != null && (
                <span className="font-mono text-xs text-neutral-500">{r.robo_score.toFixed(1)}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
