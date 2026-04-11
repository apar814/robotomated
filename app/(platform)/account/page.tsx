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
          <h2 className="text-xl font-bold">Your Shortlist</h2>
          {(saved?.length || 0) > 0 && (
            <Link href="/account/saved" className="text-sm text-blue hover:underline">View all</Link>
          )}
        </div>
        {!saved?.length ? (
          <div className="mt-4 rounded-xl border border-dashed border-border bg-navy-light p-8 text-center">
            <svg className="mx-auto mb-3 h-8 w-8 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="5" y="8" width="14" height="12" rx="2" /><path d="M9 13h0M15 13h0" strokeWidth={2.5} /><path d="M9 17h6M12 2v4M7 8V6M17 8V6" /></svg>
            <p className="text-sm text-muted">Save robots while you research to build your shortlist.</p>
            <Link href="/explore" className="mt-3 inline-block text-sm font-medium text-blue hover:underline">
              Start exploring robots
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

      {/* Robotimus conversations */}
      <section className="mt-12">
        <h2 className="text-xl font-bold">Advisor Conversations</h2>
        {!conversations?.length ? (
          <div className="mt-4 rounded-xl border border-dashed border-border bg-navy-light p-8 text-center">
            <svg className="mx-auto mb-3 h-8 w-8 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
            <p className="text-sm text-muted">Robotimus is your AI advisor for robot selection, pricing, and deployment strategy.</p>
            <Link href="/advisor" className="mt-3 inline-block text-sm font-medium text-blue hover:underline">
              Get a recommendation
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
        <h2 className="text-xl font-bold">Reviews You&apos;ve Written</h2>
        {!reviews?.length ? (
          <div className="mt-4 rounded-xl border border-dashed border-border bg-navy-light p-8 text-center">
            <svg className="mx-auto mb-3 h-8 w-8 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            <p className="text-sm text-muted">Share your hands-on experience to help others make better automation decisions.</p>
            <Link href="/explore" className="mt-3 inline-block text-sm font-medium text-blue hover:underline">
              Review a robot you&apos;ve used
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
