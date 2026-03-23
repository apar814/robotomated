import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles, getCategories, formatCategoryName } from "@/lib/learn/articles";
import { ArticleCard } from "@/components/learn/article-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

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
            <div className="rounded-xl border border-border bg-navy-light p-12 text-center">
              <p className="text-muted">No articles in this category yet.</p>
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
    </div>
  );
}
