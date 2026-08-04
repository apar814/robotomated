import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";

interface NewsItem {
  id: string;
  title: string;
  summary: string | null;
  source: string;
  category: string | null;
  url: string;
  created_at: string;
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "JUST NOW";
  if (hours < 24) return `${hours}H AGO`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}D AGO`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}W AGO`;
  return new Date(dateStr)
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toUpperCase();
}

export async function NewsHub({ limit = 6, featured = false }: { limit?: number; featured?: boolean }) {
  try {
    const supabase = createServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;

    const { data, error } = await sb
      .from("news_items")
      .select("id, title, summary, source, category, url, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    const newsItems = (data ?? []) as NewsItem[];
    if (newsItems.length === 0) return null;

    return (
      <section className="px-6 py-28" style={{ background: "var(--theme-bg)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="section-marker">04 / INTELLIGENCE</div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2
              className="font-[family-name:var(--font-sans)] font-medium tracking-[-0.02em]"
              style={{ fontSize: "clamp(32px, 4vw, 40px)", color: "var(--theme-text-primary)" }}
            >
              Latest robotics intelligence
            </h2>
            <Link
              href="/news"
              className="text-[12px] font-medium uppercase tracking-[0.12em] text-white/40 transition-colors hover:text-white"
            >
              View all &rarr;
            </Link>
          </div>

          {/* Editorial cards — no backgrounds, no borders; hairline rules between items */}
          <div className={`mt-12 grid gap-x-10 ${featured ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {newsItems.map((item) => (
              <article key={item.id} className="pt-6 pb-10" style={{ borderTop: "1px solid var(--theme-border)" }}>
                {/* Metadata row — uppercase labels, timestamp in --interactive */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium uppercase tracking-[0.12em]">
                  <span style={{ color: "var(--theme-text-muted)" }}>{item.source}</span>
                  <span style={{ color: "var(--theme-text-muted)" }}>&middot;</span>
                  <span style={{ color: "var(--theme-text-muted)" }}>{item.category || "INDUSTRY"}</span>
                  <span style={{ color: "var(--theme-text-muted)" }}>&middot;</span>
                  <span className="font-[family-name:var(--font-mono)]" style={{ color: "var(--interactive, #D4D4D4)" }}>
                    {relativeTime(item.created_at)}
                  </span>
                </div>

                <h3 className="mt-3">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-[family-name:var(--font-sans)] text-[18px] font-medium leading-snug text-white/90 transition-colors hover:text-white"
                  >
                    {item.title}
                  </a>
                </h3>

                {item.summary && item.summary !== item.title && (
                  <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed" style={{ color: "var(--theme-text-secondary)" }}>
                    {item.summary}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error("NewsHub error:", error);
    return null;
  }
}
