import Link from "next/link";
import { getTerms } from "@/lib/learn/glossary-index";

/**
 * Map /explore category slugs to the glossary terms a shopper in that
 * category will actually meet on spec sheets and vendor calls.
 */
const CATEGORY_TERMS: Record<string, string[]> = {
  warehouse: ["amr", "agv", "fleet-management", "wms", "slam", "throughput", "raas"],
  manufacturing: ["cobot", "scara", "delta-robot", "payload", "repeatability", "iso-10218", "power-and-force-limiting"],
  humanoid: ["humanoid-robot", "degrees-of-freedom", "sim-to-real", "end-effector"],
  construction: ["quadruped", "machine-vision", "digital-twin", "risk-assessment"],
  agricultural: ["machine-vision", "slam", "uptime", "raas"],
  delivery: ["amr", "slam", "fleet-management"],
  drone: ["machine-vision", "digital-twin", "waypoint"],
  medical: ["cobot", "end-effector", "risk-assessment"],
  security: ["quadruped", "slam", "fleet-management", "uptime"],
  hospitality: ["amr", "fleet-management", "uptime"],
  consumer: ["slam", "machine-vision", "degrees-of-freedom"],
};

export function CategoryGlossaryStrip({ category }: { category: string }) {
  const terms = getTerms(CATEGORY_TERMS[category] ?? []);
  if (terms.length === 0) return null;

  return (
    <section className="border-t border-border px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary">
          Glossary
        </p>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {terms.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/learn/glossary/${t.slug}`}
                className="text-sm text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {t.term}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
