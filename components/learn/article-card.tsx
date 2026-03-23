import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { ArticleFrontmatter } from "@/lib/learn/articles";

const audienceColors: Record<string, string> = {
  beginner: "bg-green/10 text-green",
  enthusiast: "bg-blue/10 text-blue",
  professional: "bg-violet/10 text-violet",
  developer: "bg-orange/10 text-orange",
};

export function ArticleCard({
  article,
  categorySlug,
}: {
  article: ArticleFrontmatter;
  categorySlug: string;
}) {
  return (
    <Link
      href={`/learn/${categorySlug}/${article.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-navy-light p-5 transition-all hover:border-blue/30"
    >
      <div className="flex items-center gap-2">
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", audienceColors[article.audience] || audienceColors.beginner)}>
          {article.audience}
        </span>
        <span className="text-[10px] text-muted">{article.readTime} min read</span>
      </div>
      <h3 className="mt-3 font-semibold transition-colors group-hover:text-blue">
        {article.title}
      </h3>
      <p className="mt-2 line-clamp-2 flex-1 text-xs text-muted">
        {article.description}
      </p>
      <div className="mt-4 flex items-center justify-between text-[10px] text-muted">
        <span>{article.author}</span>
        <span>{new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
      </div>
    </Link>
  );
}
