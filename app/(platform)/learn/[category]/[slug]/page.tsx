import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticle, getAllArticles, extractHeadings, formatCategoryName } from "@/lib/learn/articles";
import { createServerClient } from "@/lib/supabase/server";
import { MdxContent } from "@/components/learn/mdx-content";
import { TableOfContents } from "@/components/learn/table-of-contents";
import { ReadingProgress } from "@/components/learn/reading-progress";
import { ShareButtons } from "@/components/learn/share-buttons";
import { ArticleFeedback } from "@/components/learn/article-feedback";
import { ArticleCard } from "@/components/learn/article-card";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { RoboScoreBadge } from "@/components/ui/robo-score";
import { cn } from "@/lib/utils/cn";

const audienceLabels: Record<string, string> = {
  beginner: "Beginner-friendly",
  enthusiast: "For enthusiasts",
  professional: "Professional",
  developer: "Developer-focused",
};

interface Props { params: Promise<{ category: string; slug: string }> }

interface RelatedRobotRow {
  slug: string;
  name: string;
  robo_score: number | null;
  price_current: number | null;
  manufacturers: { name: string } | null;
  robot_categories: { slug: string } | null;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((a) => ({
    category: a.categorySlug,
    slug: a.frontmatter.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  if (!article) return { title: "Article Not Found" };

  return {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    alternates: { canonical: `/learn/${category}/${slug}` },
    openGraph: {
      title: article.frontmatter.title,
      description: article.frontmatter.description,
      type: "article",
      publishedTime: article.frontmatter.publishedAt,
      modifiedTime: article.frontmatter.updatedAt,
      authors: [article.frontmatter.author],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  if (!article) notFound();

  const { frontmatter, content } = article;
  const headings = extractHeadings(content);
  const catName = formatCategoryName(category);

  // Get related articles from same category
  const allArticles = getAllArticles();
  const related = allArticles
    .filter((a) => a.categorySlug === category && a.frontmatter.slug !== slug)
    .slice(0, 3);

  // Get related robots if robotSlugs are specified
  let relatedRobots: RelatedRobotRow[] = [];
  if (frontmatter.robotSlugs?.length) {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("robots")
      .select("slug, name, robo_score, price_current, manufacturers(name), robot_categories(slug)")
      .in("slug", frontmatter.robotSlugs)
      .returns<RelatedRobotRow[]>();
    relatedRobots = data || [];
  }

  return (
    <div>
      <ReadingProgress />

      {/* Header */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs items={[
            { name: "Home", href: "/" },
            { name: "Learn", href: "/learn" },
            { name: catName, href: `/learn/${category}` },
            { name: frontmatter.title, href: `/learn/${category}/${slug}` },
          ]} />

          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{frontmatter.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
            <span>{frontmatter.author}</span>
            <span className="text-border">|</span>
            <span>
              Updated {new Date(frontmatter.updatedAt).toLocaleDateString("en-US", {
                month: "long", day: "numeric", year: "numeric",
              })}
            </span>
            <span className="text-border">|</span>
            <span>{frontmatter.readTime} min read</span>
            <span className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-medium",
              frontmatter.audience === "beginner" ? "bg-green/10 text-green" :
              frontmatter.audience === "enthusiast" ? "bg-blue/10 text-blue" :
              frontmatter.audience === "professional" ? "bg-violet/10 text-violet" :
              "bg-orange/10 text-orange"
            )}>
              {audienceLabels[frontmatter.audience] || frontmatter.audience}
            </span>
          </div>

          <div className="mt-4">
            <ShareButtons title={frontmatter.title} url={`/learn/${category}/${slug}`} />
          </div>
        </div>
      </section>

      {/* Content + TOC */}
      <section className="px-4 py-12">
        <div className="mx-auto flex max-w-6xl gap-12">
          {/* Main content */}
          <div className="min-w-0 max-w-3xl flex-1">
            <MdxContent source={content} />

            {/* Feedback */}
            <div className="mt-12">
              <ArticleFeedback articleSlug={`${category}/${slug}`} />
            </div>

            {/* Author card */}
            <div className="mt-8 rounded-xl border border-border bg-navy-light p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue/10 text-lg font-bold text-blue">
                  {frontmatter.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold">{frontmatter.author}</h4>
                  <p className="mt-1 text-sm text-muted">
                    {frontmatter.authorBio || "Contributing writer at Robotomated, covering robotics technology and automation trends."}
                  </p>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-8 rounded-xl border border-border bg-navy-light p-6">
              <h3 className="text-lg font-semibold">Stay in the loop</h3>
              <p className="mb-4 mt-1 text-sm text-muted">
                Get weekly robotics insights, new reviews, and the best deals.
              </p>
              <div className="relative">
                <NewsletterForm />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-24 space-y-8">
              <TableOfContents headings={headings} />

              {/* Related robots */}
              {relatedRobots.length > 0 && (
                <div>
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                    Related Robots
                  </h4>
                  <div className="space-y-2">
                    {relatedRobots.map((r) => {
                      const catSlug = (r.robot_categories as { slug: string } | null)?.slug || "all";
                      const mfr = (r.manufacturers as { name: string } | null)?.name || "";
                      return (
                        <Link
                          key={r.slug}
                          href={`/explore/${catSlug}/${r.slug}`}
                          className="block rounded-lg border border-border bg-navy-lighter p-3 transition-all hover:border-blue/30"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div className="min-w-0">
                              <p className="truncate text-[10px] text-muted">{mfr}</p>
                              <p className="truncate text-xs font-semibold">{r.name}</p>
                            </div>
                            {r.robo_score != null && <RoboScoreBadge score={r.robo_score} className="text-[9px]" />}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="border-t border-border px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-xl font-bold">Continue Reading</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.frontmatter.slug} article={a.frontmatter} categorySlug={a.categorySlug} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
