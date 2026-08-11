import Link from "next/link";
import type { Explainer } from "@/lib/learn/explainer-types";
import { getTerms } from "@/lib/learn/glossary-index";
import { ArticleSchema, FaqSchema } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

/**
 * Long-form explainer renderer. Sections numbered per the section-marker
 * convention; mono uppercase labels; hairline rules; no decorative color.
 */
export function ExplainerArticle({ explainer }: { explainer: Explainer }) {
  const glossaryTerms = getTerms(explainer.glossaryLinks);
  const lead = explainer.sections[0];
  const rest = explainer.sections.slice(1);

  return (
    <div>
      <ArticleSchema
        title={explainer.title}
        description={explainer.description}
        url={`/learn/${explainer.slug}`}
        publishedAt={explainer.publishedAt}
      />
      {explainer.faq && explainer.faq.length > 0 && (
        <FaqSchema
          items={explainer.faq.map((f) => ({ question: f.q, answer: f.a }))}
        />
      )}

      {/* Header */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Learn", href: "/learn" },
              { name: explainer.title, href: `/learn/${explainer.slug}` },
            ]}
          />
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary">
            Field guide
          </p>
          <h1 className="mt-3 text-3xl font-medium leading-tight sm:text-4xl">
            {explainer.title}
          </h1>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary">
            <span className="font-mono">{explainer.readTime}</span> min read
            &middot; Updated {explainer.publishedAt}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Lead */}
          <div className="space-y-5">
            {lead.paragraphs.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-lg leading-relaxed text-foreground/90"
                    : "leading-relaxed text-foreground/80"
                }
              >
                {p}
              </p>
            ))}
          </div>

          {/* Numbered sections */}
          {rest.map((section, si) => (
            <div key={si} className="mt-14">
              <div className="border-b border-border pb-2">
                <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary">
                  {String(si + 1).padStart(2, "0")} /{" "}
                  {(section.heading || "").toUpperCase()}
                </h2>
              </div>
              <div className="mt-5 space-y-5">
                {section.paragraphs.map((p, pi) => (
                  <p key={pi} className="leading-relaxed text-foreground/80">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}

          {/* FAQ */}
          {explainer.faq && explainer.faq.length > 0 && (
            <div className="mt-14">
              <div className="border-b border-border pb-2">
                <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary">
                  {String(rest.length + 1).padStart(2, "0")} / QUESTIONS
                </h2>
              </div>
              <dl className="mt-5 space-y-6">
                {explainer.faq.map((f) => (
                  <div key={f.q}>
                    <dt className="font-medium text-foreground">{f.q}</dt>
                    <dd className="mt-2 leading-relaxed text-foreground/80">
                      {f.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Citations */}
          {explainer.citations.length > 0 && (
            <div className="mt-14 border-t border-border pt-6">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary">
                Sources
              </p>
              <ul className="mt-3 space-y-1 text-sm text-muted">
                {explainer.citations.map((c) => (
                  <li key={c.source}>
                    {c.source} ({c.year}){c.note ? ` — ${c.note}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Glossary terms */}
          {glossaryTerms.length > 0 && (
            <div className="mt-10 border-t border-border pt-6">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary">
                Terms in this guide
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                {glossaryTerms.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/learn/glossary/${t.slug}`}
                      className="text-sm text-foreground underline-offset-4 hover:underline"
                    >
                      {t.term}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next step */}
          <div className="mt-14 border border-border p-8">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary">
              Next step
            </p>
            <p className="mt-3 leading-relaxed text-foreground/80">
              {explainer.nextStep.blurb}
            </p>
            <Link
              href={explainer.nextStep.href}
              className="mt-5 inline-block border border-foreground px-6 py-3 font-mono text-xs uppercase tracking-[0.12em] text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              {explainer.nextStep.label} &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
