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
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function NewsHub({ limit = 6, featured = false }: { limit?: number; featured?: boolean }) {
  try {
    const supabase = createServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;

    const { data: newsItems, error } = await sb
      .from("news_items")
      .select("id, title, summary, source, category, url, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (
      <section className={featured ? "bg-black py-16" : "py-12"}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">
              {featured ? "Robotics Intelligence Feed" : "Latest News"}
            </h2>
            <Link href="/news" className="text-sm text-blue-400 hover:text-blue-300">
              View all &rarr;
            </Link>
          </div>

          {/* News Grid */}
          <div className={`grid gap-6 ${featured ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {(newsItems as NewsItem[] | null)?.map((item) => (
              <article
                key={item.id}
                className="rounded-lg border border-gray-800 bg-gray-900 p-6 transition-all hover:border-gray-700"
              >
                {/* Category Badge */}
                <div className="mb-3 inline-block">
                  <span className="rounded-full bg-blue-900 px-3 py-1 text-xs font-semibold text-blue-200">
                    {item.category || "Industry"}
                  </span>
                </div>

                {/* Date */}
                <p className="mb-2 text-xs text-gray-500">{relativeTime(item.created_at)}</p>

                {/* Title */}
                <h3 className="mb-3 line-clamp-2 text-lg font-semibold text-white">
                  {item.title}
                </h3>

                {/* Summary */}
                <p className="mb-4 line-clamp-3 text-sm text-gray-400">{item.summary}</p>

                {/* Footer: Source + Link */}
                <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                  <span className="text-xs text-gray-500">{item.source}</span>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-blue-400 hover:text-blue-300"
                    >
                      Read &rarr;
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Empty State */}
          {(!newsItems || newsItems.length === 0) && (
            <div className="py-12 text-center">
              <p className="text-gray-400">No news available yet.</p>
            </div>
          )}
        </div>
      </section>
    );
  } catch (error) {
    console.error("NewsHub error:", error);
    return null;
  }
}
