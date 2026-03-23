import type { Metadata } from "next";
import Link from "next/link";
import { createAuthClient } from "@/lib/supabase/auth-server";
import { createServerClient } from "@/lib/supabase/server";
import { RoboScoreBadge } from "@/components/ui/robo-score";
import { SignOutButton } from "@/components/auth/sign-out-button";

export const metadata: Metadata = { title: "Your Account" };

interface SavedRobot {
  robot_id: string;
  robots: { slug: string; name: string; robo_score: number | null; manufacturers: { name: string } | null; robot_categories: { slug: string } | null } | null;
}

interface ConversationRow {
  id: string;
  session_id: string;
  use_case: string | null;
  created_at: string;
}

interface ReviewRow {
  id: string;
  title: string;
  robo_score: number | null;
  published_at: string | null;
  created_at: string;
  robots: { slug: string; name: string; robot_categories: { slug: string } | null } | null;
}

export default async function AccountPage() {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const adminSupabase = createServerClient();

  const [{ data: saved }, { data: conversations }, { data: reviews }] = await Promise.all([
    adminSupabase
      .from("user_saved_robots")
      .select("robot_id, robots(slug, name, robo_score, manufacturers(name), robot_categories(slug))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6)
      .returns<SavedRobot[]>(),
    adminSupabase
      .from("advisor_conversations")
      .select("id, session_id, use_case, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)
      .returns<ConversationRow[]>(),
    adminSupabase
      .from("reviews")
      .select("id, title, robo_score, published_at, created_at, robots(slug, name, robot_categories(slug))")
      .eq("reviewer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)
      .returns<ReviewRow[]>(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Profile */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue to-violet text-xl font-bold text-white">
            {(user.email?.[0] || "?").toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.user_metadata?.name || "Your Account"}</h1>
            <p className="text-sm text-muted">{user.email}</p>
          </div>
        </div>
        <SignOutButton />
      </div>

      {/* Saved robots */}
      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Saved Robots</h2>
          {(saved?.length || 0) > 0 && (
            <Link href="/account/saved" className="text-sm text-blue hover:underline">View all</Link>
          )}
        </div>
        {!saved?.length ? (
          <div className="mt-4 rounded-xl border border-border bg-navy-light p-8 text-center">
            <p className="text-muted">No saved robots yet.</p>
            <Link href="/explore" className="mt-2 inline-block text-sm text-blue hover:underline">
              Browse robots
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((s) => {
              const r = s.robots;
              if (!r) return null;
              const catSlug = (r.robot_categories as { slug: string } | null)?.slug || "all";
              const mfr = (r.manufacturers as { name: string } | null)?.name || "";
              return (
                <Link
                  key={s.robot_id}
                  href={`/explore/${catSlug}/${r.slug}`}
                  className="group rounded-xl border border-border bg-navy-light p-4 transition-all hover:border-blue/30"
                >
                  <p className="text-xs text-muted">{mfr}</p>
                  <h3 className="font-semibold transition-colors group-hover:text-blue">{r.name}</h3>
                  {r.robo_score != null && <RoboScoreBadge score={r.robo_score} className="mt-2" />}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Advisor conversations */}
      <section className="mt-12">
        <h2 className="text-xl font-bold">Advisor History</h2>
        {!conversations?.length ? (
          <div className="mt-4 rounded-xl border border-border bg-navy-light p-8 text-center">
            <p className="text-muted">No conversations yet.</p>
            <Link href="/advisor" className="mt-2 inline-block text-sm text-blue hover:underline">
              Talk to AI Advisor
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {conversations.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-xl border border-border bg-navy-light p-4">
                <div>
                  <p className="text-sm font-medium">{c.use_case || "General conversation"}</p>
                  <p className="text-xs text-muted">
                    {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <Link href={`/advisor?session=${c.session_id}`} className="text-sm text-blue hover:underline">
                  Continue
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reviews */}
      <section className="mt-12">
        <h2 className="text-xl font-bold">Your Reviews</h2>
        {!reviews?.length ? (
          <div className="mt-4 rounded-xl border border-border bg-navy-light p-8 text-center">
            <p className="text-muted">No reviews submitted yet.</p>
            <Link href="/explore" className="mt-2 inline-block text-sm text-blue hover:underline">
              Find a robot to review
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {reviews.map((rv) => {
              const r = rv.robots;
              const catSlug = (r?.robot_categories as { slug: string } | null)?.slug || "all";
              return (
                <div key={rv.id} className="flex items-center justify-between rounded-xl border border-border bg-navy-light p-4">
                  <div>
                    <p className="text-sm font-medium">{rv.title}</p>
                    <p className="text-xs text-muted">
                      {r?.name} &middot; {rv.published_at ? "Published" : "Pending review"}
                    </p>
                  </div>
                  {rv.robo_score != null && <RoboScoreBadge score={rv.robo_score} />}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
