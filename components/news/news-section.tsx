"use client";

import Link from "next/link";
import type { NewsArticle } from "@/lib/data/news";

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
    <span
      className="inline-block rounded px-2 py-0.5 text-xs font-medium"
      style={{ background: color + "15", color, border: `0.5px solid ${color}30` }}
    >
      {label}
    </span>
  );
}

function SourceBadge({ source }: { source: string }) {
  const colors: Record<string, string> = {
    "Engadget": "#00a86b",
    "TechCrunch": "#e8632c",
    "The Robot Report": "#1a56a8",
    "Crunchbase": "#0288d1",
    "StartUs Insights": "#7c3aed",
  };
  return <span className="text-xs font-medium" style={{ color: colors[source] || "#6b7280" }}>{source}</span>;
}

function HeroArticle({ article }: { article: NewsArticle }) {
  return (
    <a
      href={article.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="glass glass-hover group block overflow-hidden rounded-xl transition-all"
    >
      <div className="flex h-52 items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
        <div className="px-8 text-center">
          <div className="mb-3 text-5xl">
            {article.category === "Funding" ? "💰" : article.category.includes("Acquisition") ? "🤝" : "🤖"}
          </div>
          <SourceBadge source={article.source} />
        </div>
      </div>
      <div className="p-5">
        <div className="mb-2.5 flex flex-wrap items-center gap-2">
          <TagPill label={article.tag} color={article.tagColor} />
          <span className="text-xs text-neutral-400">{article.category}</span>
          <span className="text-xs text-neutral-300">·</span>
          <span className="text-xs text-neutral-400">{relativeTime(article.publishedAt)}</span>
        </div>
        <h3 className="mb-2 text-lg font-medium leading-snug text-foreground transition-colors group-hover:text-blue">
          {article.title}
        </h3>
        <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-neutral-500">
          {article.summary}
        </p>
        <div className="flex items-center justify-between">
          <SourceBadge source={article.source} />
          <span className="text-xs text-blue group-hover:underline">Read article →</span>
        </div>
      </div>
    </a>
  );
}

function ArticleRow({ article }: { article: NewsArticle }) {
  return (
    <a
      href={article.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group -mx-2 flex items-start gap-3 rounded border-b border-neutral-100 px-2 py-3 transition-colors last:border-0 hover:bg-neutral-50/50"
    >
      <div className="mt-0.5 min-h-[40px] w-1 shrink-0 self-stretch rounded-full" style={{ background: article.tagColor }} />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <TagPill label={article.tag} color={article.tagColor} />
          <span className="text-[11px] text-neutral-400">{relativeTime(article.publishedAt)}</span>
        </div>
        <p className="mb-0.5 line-clamp-2 text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-blue">
          {article.title}
        </p>
        <SourceBadge source={article.source} />
      </div>
      <span className="mt-1 shrink-0 text-sm text-neutral-300 transition-colors group-hover:text-blue">→</span>
    </a>
  );
}

export function NewsSection({ articles }: { articles: NewsArticle[] }) {
  if (!articles.length) return null;

  const [featured, ...rest] = articles;
  const secondary = rest.slice(0, 5);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-baseline justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Industry Pulse</h2>
          <p className="mt-0.5 text-sm text-neutral-500">Latest robotics news, funding, and moves</p>
        </div>
        <Link href="/news" className="text-sm text-blue hover:underline">All news →</Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        <HeroArticle article={featured} />
        <div className="rounded-xl border border-border bg-white p-4">
          <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-neutral-400">Recent news</p>
          {secondary.map((a) => <ArticleRow key={a.id} article={a} />)}
          <Link href="/news" className="mt-3 block text-center text-xs text-blue hover:underline">View all news →</Link>
        </div>
      </div>
    </section>
  );
}
