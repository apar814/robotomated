import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GLOSSARY_TERMS, getTerm, getTerms } from "@/lib/learn/glossary-index";
import { GROUP_LABELS } from "@/lib/learn/glossary-types";
import { DefinedTermSchema } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return GLOSSARY_TERMS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const term = getTerm(slug);
  if (!term) return { title: "Term not found" };
  return {
    title: `${term.term} — robotics glossary | Robotomated`,
    description: term.definition.slice(0, 157),
  };
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params;
  const term = getTerm(slug);
  if (!term) notFound();

  const related = getTerms(term.related);

  return (
    <div>
      <DefinedTermSchema
        term={term.term}
        slug={term.slug}
        definition={term.definition}
      />

      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Learn", href: "/learn" },
              { name: "Glossary", href: "/learn/glossary" },
              { name: term.term, href: `/learn/glossary/${term.slug}` },
            ]}
          />
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary">
            {GROUP_LABELS[term.group]}
          </p>
          <h1 className="mt-3 text-3xl font-medium sm:text-4xl">{term.term}</h1>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-foreground/90">
            {term.definition}
          </p>

          {term.citation && (
            <p className="mt-8 border-l border-border pl-4 text-sm text-muted">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-tertiary">
                Standard
              </span>
              <br />
              {term.citation.source} ({term.citation.year})
            </p>
          )}

          {related.length > 0 && (
            <div className="mt-12 border-t border-border pt-8">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary">
                Related terms
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/learn/glossary/${r.slug}`}
                      className="text-foreground underline-offset-4 hover:underline"
                    >
                      {r.term}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {term.explore && term.explore.length > 0 && (
            <div className="mt-8 border-t border-border pt-8">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary">
                In the database
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {term.explore.map((e) => (
                  <li key={e.href}>
                    <Link
                      href={e.href}
                      className="text-foreground underline-offset-4 hover:underline"
                    >
                      {e.label} &rarr;
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-12">
            <Link
              href="/learn/glossary"
              className="font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary transition-colors hover:text-foreground"
            >
              &larr; All terms
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
