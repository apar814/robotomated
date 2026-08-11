import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles, getCategories } from "@/lib/learn/articles";
import { EXPLAINERS } from "@/lib/learn/explainers";
import { GLOSSARY_TERMS } from "@/lib/learn/glossary-index";
import { ArticleCard } from "@/components/learn/article-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = {
  title: "RoboLearn — Robotics Education Hub",
  description:
    "Learn everything about robots — from basics to advanced automation. Guides, tutorials, and insights for every audience level.",
};

export default function LearnHub() {
  const articles = getAllArticles();
  const categories = getCategories();
  const featured = articles.filter((a) => a.frontmatter.featured);
  const recent = articles.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Learn", href: "/learn" }]} />
          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
            Robo<span className="text-white">Learn</span>
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            Everything you need to understand robots — from what they are to how to deploy them.
            Guides for beginners, professionals, and everyone in between.
          </p>
        </div>
      </section>

      {/* Category tabs */}
      <section className="border-b border-border px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/learn"
              className="rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-white"
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/learn/${cat.slug}`}
                className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-white/20 hover:text-foreground"
              >
                {cat.name} ({cat.count})
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Field guides */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="border-b border-border pb-2">
            <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary">
              01 / FIELD GUIDES
            </h2>
          </div>
          <p className="mt-4 max-w-2xl text-muted">
            Long-form guides for buyers and operators — how the technology,
            the commercial models, and the standards actually work.
          </p>
          <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {EXPLAINERS.map((e) => (
              <li key={e.slug}>
                <Link href={`/learn/${e.slug}`} className="group block py-1">
                  <span className="text-foreground transition-colors group-hover:underline">
                    {e.title}
                  </span>
                  <span className="ml-3 font-mono text-[11px] uppercase tracking-[0.12em] text-text-tertiary">
                    {e.readTime} min
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Glossary */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="border-b border-border pb-2">
            <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary">
              02 / GLOSSARY
            </h2>
          </div>
          <p className="mt-4 max-w-2xl text-muted">
            {GLOSSARY_TERMS.length} terms across robot types, technical
            concepts, commercial language, and safety standards — with
            standards citations where they exist.
          </p>
          <Link
            href="/learn/glossary"
            className="mt-5 inline-block border border-foreground px-6 py-3 font-mono text-xs uppercase tracking-[0.12em] text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            Browse the glossary &rarr;
          </Link>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="border-b border-border px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-xl font-bold">Featured</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((a) => (
                <ArticleCard key={a.frontmatter.slug} article={a.frontmatter} categorySlug={a.categorySlug} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All articles */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-xl font-bold">
            {featured.length > 0 ? "Recent Articles" : "All Articles"}
          </h2>
          {articles.length === 0 ? (
            <div className="rounded-xl border border-border bg-navy-light p-12 text-center">
              <p className="text-muted">Articles coming soon. Check back later!</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((a) => (
                <ArticleCard key={a.frontmatter.slug} article={a.frontmatter} categorySlug={a.categorySlug} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-navy-light p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold">Ready to explore?</h2>
          <p className="mt-3 text-muted">
            Browse our full database of robots with transparent scores and expert reviews.
          </p>
          <Link
            href="/explore"
            className="mt-6 inline-block rounded-lg bg-white px-8 py-3 text-sm font-semibold text-navy transition-opacity hover:opacity-90"
          >
            Explore Robots
          </Link>
        </div>
      </section>
    </div>
  );
}
