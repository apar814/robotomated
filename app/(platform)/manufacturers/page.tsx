import type { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { CompanyLogo } from "@/components/ui/company-logo";
import { NextStepBar } from "@/components/ui/next-step-bar";

export const metadata: Metadata = {
  title: "Robot Manufacturers — Directory",
  description: "Browse all robot manufacturers. Find companies building humanoids, cobots, drones, and more.",
};

interface MfrRow {
  id: string; slug: string; name: string;
  country: string | null; founded_year: number | null; website: string | null; logo_url: string | null;
  robot_count: number;
}

export default async function ManufacturersPage() {
  const supabase = createServerClient();

  const { data: mfrs } = await supabase
    .from("manufacturers")
    .select("id, slug, name, country, founded_year, website, logo_url")
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
      <section className="border-b px-6 py-16" style={{ borderColor: "#1F1F1F" }}>
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Manufacturers", href: "/manufacturers" }]} />
          <span className="mt-6 block text-[12px] font-medium uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.45)" }}>
            01 / MANUFACTURERS
          </span>
          <h1 className="mt-3 font-[family-name:var(--font-sans)] text-3xl font-medium tracking-tight sm:text-4xl" style={{ color: "#FFFFFF", letterSpacing: "-0.02em" }}>
            Robot Manufacturers
          </h1>
          <p className="mt-3 text-[16px]" style={{ color: "rgba(255,255,255,0.45)" }}>
            {manufacturers.length} companies tracked.
          </p>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {manufacturers.map((m) => (
              <div key={m.id} className="border p-5 transition-colors" style={{ borderColor: "#1F1F1F", background: "#0A0A0A", borderRadius: "2px" }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <CompanyLogo logoUrl={m.logo_url} name={m.name} height={36} />
                    <div>
                    <Link href={`/manufacturers/${m.slug}`}>
                      <h3 className="font-medium text-white hover:text-white/70">{m.name}</h3>
                    </Link>
                    <p className="mt-0.5 text-xs text-muted/60">
                      {m.country && <span>{m.country}</span>}
                      {m.founded_year && <span> &middot; Est. {m.founded_year}</span>}
                    </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 font-mono text-[14px] font-medium text-white/45" style={{ border: "1px solid #1F1F1F", borderRadius: "2px" }}>
                    {m.robot_count}
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href={`/manufacturers/${m.slug}`} className="px-3 py-1.5 text-[12px] font-medium uppercase tracking-[0.12em] text-white/45 hover:text-white" style={{ border: "1px solid #1F1F1F", borderRadius: "2px" }}>
                    VIEW ROBOTS
                  </Link>
                  {m.website && (
                    <a href={m.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium uppercase tracking-[0.12em] text-white/25 hover:text-white" style={{ border: "1px solid #1F1F1F", borderRadius: "2px" }}>
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

      <NextStepBar preset="manufacturers" />
    </div>
  );
}
