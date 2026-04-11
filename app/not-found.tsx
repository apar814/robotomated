import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";

async function getSuggestions() {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("robots")
      .select("slug, name, robo_score, manufacturers(name), robot_categories(slug)")
      .eq("status", "active")
      .not("robo_score", "is", null)
      .order("robo_score", { ascending: false })
      .limit(3);
    return data || [];
  } catch {
    return [];
  }
}

export default async function NotFound() {
  const suggestions = await getSuggestions();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-[family-name:var(--font-brand)] text-7xl font-bold text-[#0EA5E9]/20 sm:text-8xl">
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
        This page isn&apos;t in our database yet
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-white/40">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Here are some places to start instead.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/explore"
          className="rounded-lg bg-[#0EA5E9] px-6 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
        >
          Explore All Robots
        </Link>
        <Link
          href="/advisor"
          className="rounded-lg border border-white/[0.08] px-6 py-2.5 text-sm font-medium text-white/60 transition-colors hover:border-[#0EA5E9]/30 hover:text-white"
        >
          Ask Robotimus
        </Link>
      </div>

      {/* Top-rated robot suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-12 w-full max-w-2xl">
          <p className="mb-4 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">
            Highest-rated robots right now
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {suggestions.map((r: Record<string, unknown>) => {
              const mfr = (r.manufacturers as { name: string } | null)?.name || "";
              const catSlug = (r.robot_categories as { slug: string } | null)?.slug || "all";
              return (
                <Link
                  key={r.slug as string}
                  href={`/explore/${catSlug}/${r.slug}`}
                  className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition-all hover:border-[#0EA5E9]/20"
                >
                  <p className="text-[10px] text-[#0EA5E9]">{mfr}</p>
                  <p className="mt-0.5 text-sm font-semibold text-white transition-colors group-hover:text-[#0EA5E9]">
                    {r.name as string}
                  </p>
                  {r.robo_score != null && (
                    <p className="mt-2 font-[family-name:var(--font-mono)] text-xs text-white/40">
                      RoboScore {(r.robo_score as number).toFixed(1)}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
