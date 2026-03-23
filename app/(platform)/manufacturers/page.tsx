import type { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Robot Manufacturers — Directory",
  description: "Browse all robot manufacturers. Find companies building humanoids, cobots, drones, and more.",
};

interface MfrRow {
  id: string; slug: string; name: string;
  country: string | null; founded_year: number | null; website: string | null;
  robot_count: number;
}

export default async function ManufacturersPage() {
  const supabase = createServerClient();

  const { data: mfrs } = await supabase
    .from("manufacturers")
    .select("id, slug, name, country, founded_year, website")
    .order("name")
    .returns<Omit<MfrRow, "robot_count">[]>();

  const { data: robots } = await supabase
    .from("robots")
    .select("manufacturer_id")
    .returns<{ manufacturer_id: string }[]>();

  const counts: Record<string, number> = {};
  robots?.forEach((r) => { counts[r.manufacturer_id] = (counts[r.manufacturer_id] || 0) + 1; });

  const manufacturers = (mfrs || [])
    .map((m) => ({ ...m, robot_count: counts[m.id] || 0 }))
    .filter((m) => m.robot_count > 0)
    .sort((a, b) => b.robot_count - a.robot_count);

  return (
    <div>
      <section className="border-b border-white/[0.06] px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Manufacturers", href: "/manufacturers" }]} />
          <h1 className="mt-6 font-display text-3xl font-bold">Robot Manufacturers</h1>
          <p className="mt-3 text-muted">{manufacturers.length} companies building the future of robotics.</p>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {manufacturers.map((m) => (
              <div key={m.id} className="glass glass-hover rounded-xl p-5 transition-all hover:-translate-y-1">
                <div className="flex items-start justify-between">
                  <div>
                    <Link href={`/manufacturers/${m.slug}`}>
                      <h3 className="font-semibold hover:text-blue">{m.name}</h3>
                    </Link>
                    <p className="mt-0.5 text-xs text-muted/60">
                      {m.country && <span>{m.country}</span>}
                      {m.founded_year && <span> &middot; Est. {m.founded_year}</span>}
                    </p>
                  </div>
                  <span className="rounded-full bg-white/[0.04] px-2.5 py-0.5 font-mono text-xs font-medium text-muted">
                    {m.robot_count}
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href={`/manufacturers/${m.slug}`} className="rounded-lg bg-blue/10 px-3 py-1.5 text-xs font-medium text-blue hover:bg-blue/20">
                    View Robots
                  </Link>
                  {m.website && (
                    <a href={m.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs text-muted hover:text-foreground">
                      Website
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
