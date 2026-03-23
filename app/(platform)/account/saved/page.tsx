import type { Metadata } from "next";
import Link from "next/link";
import { createAuthClient } from "@/lib/supabase/auth-server";
import { createServerClient } from "@/lib/supabase/server";
import { RoboScoreBadge } from "@/components/ui/robo-score";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = { title: "Saved Robots" };

interface SavedRobot {
  robot_id: string;
  robots: {
    slug: string;
    name: string;
    robo_score: number | null;
    price_current: number | null;
    description_short: string | null;
    manufacturers: { name: string } | null;
    robot_categories: { slug: string } | null;
  } | null;
}

export default async function SavedRobotsPage() {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const adminSupabase = createServerClient();
  const { data: saved } = await adminSupabase
    .from("user_saved_robots")
    .select("robot_id, robots(slug, name, robo_score, price_current, description_short, manufacturers(name), robot_categories(slug))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<SavedRobot[]>();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Breadcrumbs items={[
        { name: "Account", href: "/account" },
        { name: "Saved Robots", href: "/account/saved" },
      ]} />
      <h1 className="mt-6 text-2xl font-bold">Saved Robots</h1>
      <p className="mt-2 text-sm text-muted">{saved?.length || 0} robot{(saved?.length || 0) === 1 ? "" : "s"} saved</p>

      {!saved?.length ? (
        <div className="mt-8 rounded-xl border border-border bg-navy-light p-12 text-center">
          <p className="text-muted">You haven&apos;t saved any robots yet.</p>
          <Link href="/explore" className="mt-3 inline-block text-sm text-blue hover:underline">
            Browse robots
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((s) => {
            const r = s.robots;
            if (!r) return null;
            const catSlug = (r.robot_categories as { slug: string } | null)?.slug || "all";
            const mfr = (r.manufacturers as { name: string } | null)?.name || "";
            return (
              <Link
                key={s.robot_id}
                href={`/explore/${catSlug}/${r.slug}`}
                className="group rounded-xl border border-border bg-navy-light p-5 transition-all hover:border-blue/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-muted">{mfr}</p>
                    <h3 className="truncate font-semibold transition-colors group-hover:text-blue">{r.name}</h3>
                  </div>
                  {r.robo_score != null && <RoboScoreBadge score={r.robo_score} />}
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-muted">{r.description_short}</p>
                {r.price_current != null && (
                  <p className="mt-3 font-mono text-sm font-semibold">${r.price_current.toLocaleString()}</p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
