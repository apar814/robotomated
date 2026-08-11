import type { Metadata } from "next";
import Link from "next/link";
import { GLOSSARY_TERMS, termsByLetter } from "@/lib/learn/glossary-index";
import { GROUP_LABELS, type GlossaryGroup } from "@/lib/learn/glossary-types";
import { DefinedTermSetSchema } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Robotics glossary — every term a robot buyer needs | Robotomated",
  description:
    "Plain-language definitions of robot types, technical concepts, commercial terms, and safety standards — with standards citations where they exist.",
};

const GROUP_ORDER: GlossaryGroup[] = [
  "robot-types",
  "technical",
  "commercial",
  "safety-standards",
];

export default function GlossaryIndexPage() {
  const letters = termsByLetter();

  return (
    <div>
      <DefinedTermSetSchema
        name="Robotomated robotics glossary"
        description="Definitions of robot types, technical concepts, commercial terms, and safety standards."
        url="/learn/glossary"
        terms={GLOSSARY_TERMS.map((t) => ({
          term: t.term,
          slug: t.slug,
          definition: t.definition,
        }))}
      />

      {/* Header */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Learn", href: "/learn" },
              { name: "Glossary", href: "/learn/glossary" },
            ]}
          />
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary">
            01 / Glossary
          </p>
          <h1 className="mt-3 text-3xl font-medium sm:text-4xl">
            Robotics glossary
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            {GLOSSARY_TERMS.length} terms across robot types, technical
            concepts, commercial language, and safety standards. Standards
            citations included where a published standard defines the term.
          </p>

          {/* A-Z jump */}
          <nav className="mt-8 flex flex-wrap gap-x-4 gap-y-2 font-mono text-sm">
            {letters.map(({ letter }) => (
              <a
                key={letter}
                href={`#${letter}`}
                className="text-text-tertiary transition-colors hover:text-foreground"
              >
                {letter}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* By group */}
      <section className="border-b border-border px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {GROUP_ORDER.map((g) => (
              <span key={g} className="text-sm text-text-tertiary">
                <span className="font-mono">
                  {GLOSSARY_TERMS.filter((t) => t.group === g).length}
                </span>{" "}
                {GROUP_LABELS[g].toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* A-Z listing */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          {letters.map(({ letter, terms }) => (
            <div key={letter} id={letter} className="mb-12 scroll-mt-24">
              <div className="flex items-baseline gap-6 border-b border-border pb-2">
                <h2 className="font-mono text-xl text-text-tertiary">
                  {letter}
                </h2>
              </div>
              <ul className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                {terms.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/learn/glossary/${t.slug}`}
                      className="group block"
                    >
                      <span className="font-medium text-foreground transition-colors group-hover:underline">
                        {t.term}
                      </span>
                      <span className="mt-1 block text-sm text-muted">
                        {t.definition.split(". ")[0]}.
                      </span>
                      <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.12em] text-text-tertiary">
                        {GROUP_LABELS[t.group]}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
