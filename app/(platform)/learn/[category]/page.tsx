import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles, getCategories, formatCategoryName } from "@/lib/learn/articles";
import { ArticleCard } from "@/components/learn/article-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { NextStepBar } from "@/components/ui/next-step-bar";

interface Props { params: Promise<{ category: string }> }

export async function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const name = formatCategoryName(category);
  return {
    title: `${name} — RoboLearn`,
    description: `Learn about ${name.toLowerCase()} robots. Guides and articles for every skill level.`,
  };
}

export default async function LearnCategoryPage({ params }: Props) {
  const { category } = await params;
  const allArticles = getAllArticles();
  const articles = allArticles.filter((a) => a.categorySlug === category);
  const categories = getCategories();
  const name = formatCategoryName(category);

  return (
    <div>
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs items={[
            { name: "Home", href: "/" },
            { name: "Learn", href: "/learn" },
            { name, href: `/learn/${category}` },
          ]} />
          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{name}</h1>
          <p className="mt-3 text-muted">
            {articles.length} article{articles.length === 1 ? "" : "s"} about {name.toLowerCase()} robots.
          </p>
        </div>
      </section>

      {/* Category tabs */}
      <section className="border-b border-border px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/learn"
              className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-blue/30 hover:text-foreground"
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/learn/${cat.slug}`}
                className={
                  cat.slug === category
                    ? "rounded-full bg-blue/10 px-4 py-2 text-sm font-medium text-blue"
                    : "rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-blue/30 hover:text-foreground"
                }
              >
                {cat.name} ({cat.count})
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          {articles.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-navy-light p-12 text-center">
              <svg className="mx-auto mb-3 h-8 w-8 text-white/28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
              <p className="text-sm text-muted">Articles for this category are being written. Want to learn something specific?</p>
              <Link href="/advisor" className="mt-3 inline-block text-sm font-medium text-[#2563EB] hover:underline">
                Ask Robotimus any robotics question &rarr;
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <ArticleCard key={a.frontmatter.slug} article={a.frontmatter} categorySlug={a.categorySlug} />
              ))}
            </div>
          )}
        </div>
      </section>

      <NextStepBar preset="learn" />
    </div>
  );
}
