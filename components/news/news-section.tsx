import Link from "next/link";
import type { NewsArticle } from "@/lib/data/news";

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  if (d < 365) return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function TagPill({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-block rounded px-2 py-0.5 text-xs font-medium"
      style={{ background: color + "20", color, border: `0.5px solid ${color}30` }}
    >
      {label}
    </span>
  );
}

function SourceBadge({ source }: { source: string }) {
  const colors: Record<string, string> = {
    "Engadget": "#00a86b",
    "TechCrunch": "#e8632c",
    "The Robot Report": "#4da6ff",
    "Crunchbase": "#22d3ee",
    "StartUs Insights": "#a78bfa",
  };
  return <span className="text-xs font-medium" style={{ color: colors[source] || "#6b7280" }}>{source}</span>;
}

function HeroArticle({ article }: { article: NewsArticle }) {
  const emoji = article.category === "Funding" ? "💰" : article.category.includes("Acquisition") ? "🤝" : article.category === "Manufacturing" ? "🏭" : "🤖";
  return (
    <a
      href={article.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col justify-between overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] p-6 transition-all hover:border-blue/20 hover:shadow-[0_4px_30px_rgba(0,194,255,0.06)]"
      style={{ maxHeight: 320 }}
    >
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <SourceBadge source={article.source} />
          <TagPill label={article.tag} color={article.tagColor} />
          <span className="text-xs text-white/20">{relativeTime(article.publishedAt)}</span>
        </div>
        <h3 className="mb-3 text-xl font-bold leading-snug text-white/90 transition-colors group-hover:text-blue">
          {article.title}
        </h3>
        <p className="line-clamp-4 text-sm leading-relaxed text-white/40">
          {article.summary}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-4">
        <span className="text-[11px] text-white/25">{article.category}</span>
        <span className="text-xs font-medium text-blue group-hover:underline">Read article →</span>
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
      className="group flex items-start gap-3 rounded-lg border-b border-white/[0.04] px-2 py-3 transition-colors last:border-0 hover:bg-white/[0.03]"
    >
      <div className="mt-1 min-h-[36px] w-1 shrink-0 self-stretch rounded-full" style={{ background: article.tagColor }} />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <TagPill label={article.tag} color={article.tagColor} />
          <span className="text-[11px] text-white/25">{relativeTime(article.publishedAt)}</span>
        </div>
        <p className="line-clamp-2 text-sm font-medium leading-snug text-white/80 transition-colors group-hover:text-blue">
          {article.title}
        </p>
        <div className="mt-1">
          <SourceBadge source={article.source} />
        </div>
      </div>
      <span className="mt-2 shrink-0 text-sm text-white/15 transition-colors group-hover:text-blue">→</span>
    </a>
  );
}

export function NewsSection({ articles }: { articles: NewsArticle[] }) {
  if (!articles || articles.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue">Industry Pulse</p>
          <h2 className="font-display text-2xl font-bold text-white">Latest News</h2>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
          <p className="text-sm text-white/25">News feed loading — check back shortly.</p>
        </div>
      </section>
    );
  }

  const [featured, ...rest] = articles;
  const secondary = rest.slice(0, 5);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-baseline justify-between">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue">Industry Pulse</p>
          <h2 className="font-display text-2xl font-bold text-white">Latest News</h2>
        </div>
        <Link href="/news" className="text-sm text-blue hover:underline">All news →</Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        <HeroArticle article={featured} />
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-white/20">Recent</p>
          {secondary.map((a) => <ArticleRow key={a.id} article={a} />)}
          <Link href="/news" className="mt-3 block text-center text-xs text-blue hover:underline">View all news →</Link>
        </div>
      </div>
    </section>
  );
}
