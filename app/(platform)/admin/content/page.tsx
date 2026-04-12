"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Article {
  slug: string;
  title: string;
  category: string;
  word_count: number;
  read_time: number;
  published_at: string | null;
  created_at: string;
}

export default function AdminContentPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/meta?type=articles")
      .then((r) => r.json())
      .then((d) => setArticles(d.data || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter
    ? articles.filter((a) => a.category === filter)
    : articles;

  const categories = [...new Set(articles.map((a) => a.category))].sort();

  if (loading) return <div className="py-20 text-center text-white/40">Loading...</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Content Management</h1>
        <Link href="/admin" className="text-xs text-white/40 hover:text-white/60">Back to Dashboard</Link>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <p className="text-sm text-white/40">{articles.length} articles total</p>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-white/60"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 space-y-1">
        {filtered.map((a) => (
          <Link
            key={a.slug}
            href={`/learn/${a.category}/${a.slug}`}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2.5 transition-colors hover:bg-white/[0.04]"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{a.title}</p>
              <p className="text-[13px] text-white/50">
                {a.category} -- {a.word_count} words -- {a.read_time} min
              </p>
            </div>
            <span className={`ml-3 rounded px-2 py-0.5 text-[13px] font-mono ${
              a.published_at ? "bg-[#00E5A0]/10 text-[#00E5A0]" : "bg-white/10 text-white/40"
            }`}>
              {a.published_at ? "Published" : "Draft"}
            </span>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-white/50">No articles found</p>
        )}
      </div>
    </div>
  );
}
