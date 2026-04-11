"use client";

import { useState } from "react";
import Link from "next/link";
import { NEWS_ARTICLES, NEWS_CATEGORIES, type NewsArticle } from "@/lib/data/news";
import { NextStepBar } from "@/components/ui/next-step-bar";
import { cn } from "@/lib/utils/cn";

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  if (d < 30) return `${Math.floor(d / 7)} weeks ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function TagPill({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-block rounded px-2 py-0.5 text-xs font-medium"
      style={{ background: color + "15", color, border: `0.5px solid ${color}30` }}>
      {label}
    </span>
  );
}

function ArticleCard({ article }: { article: NewsArticle }) {
  return (
    <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer"
      className="glass glass-hover group flex flex-col overflow-hidden rounded-xl transition-all">
      <div className="h-1 w-full shrink-0" style={{ background: article.tagColor }} />
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <TagPill label={article.tag} color={article.tagColor} />
          <span className="text-[11px] text-white/30">{relativeTime(article.publishedAt)}</span>
        </div>
        <h3 className="line-clamp-3 text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-blue">
          {article.title}
        </h3>
        <p className="line-clamp-3 flex-1 text-xs leading-relaxed text-white/35">{article.summary}</p>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-2">
          <span className="text-xs font-medium text-white/35">{article.source}</span>
          <span className="text-[11px] text-white/30 transition-colors group-hover:text-blue">Read →</span>
        </div>
      </div>
    </a>
  );
}

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const sources = ["All", ...new Set(NEWS_ARTICLES.map(a => a.source))];
  const [activeSource, setActiveSource] = useState("All");

  const filtered = NEWS_ARTICLES.filter(a => {
    if (activeCategory !== "All" && a.category !== activeCategory) return false;
    if (activeSource !== "All" && a.source !== activeSource) return false;
    return true;
  });

  const breaking = filtered.filter(a => a.importance === "breaking");
  const major = filtered.filter(a => a.importance === "major");
  const standard = filtered.filter(a => a.importance === "standard");

  return (
    <div>
      <div className="border-b border-border px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-display text-3xl font-bold text-foreground">Industry Pulse</h1>
          <p className="mt-1 text-white/35">Robotics news, funding rounds, acquisitions, and product launches — curated daily.</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-[57px] z-20 border-b border-border bg-navy/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-6 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-white/30">Category</span>
            {["All", ...NEWS_CATEGORIES].map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={cn("rounded-full border px-3 py-1 text-xs transition-all",
                  activeCategory === cat ? "border-blue bg-blue/10 font-medium text-blue" : "border-border text-white/35 hover:border-white/[0.15]"
                )}>
                {cat}
              </button>
            ))}
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <span className="text-xs text-white/30">Source</span>
            {sources.map(src => (
              <button key={src} onClick={() => setActiveSource(src)}
                className={cn("rounded-full border px-3 py-1 text-xs transition-all",
                  activeSource === src ? "border-blue bg-blue/10 font-medium text-blue" : "border-border text-white/35 hover:border-white/[0.15]"
                )}>
                {src}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-10 px-6 py-8">
        {breaking.length > 0 && (
          <section>
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-red-500 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-white">Breaking</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {breaking.map(a => <ArticleCard key={a.id} article={a} />)}
            </div>
          </section>
        )}

        {major.length > 0 && (
          <section>
            <div className="mb-4 flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">Major</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {major.map(a => <ArticleCard key={a.id} article={a} />)}
            </div>
          </section>
        )}

        {standard.length > 0 && (
          <section>
            <div className="mb-4 flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">Latest</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {standard.map(a => <ArticleCard key={a.id} article={a} />)}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <svg className="mx-auto mb-4 h-8 w-8 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <p className="text-lg font-semibold">No articles match these filters</p>
            <p className="mt-2 text-sm text-white/35">Try a broader category or clear the source filter to see all coverage.</p>
          </div>
        )}
      </div>

      <NextStepBar preset="news" />
    </div>
  );
}
