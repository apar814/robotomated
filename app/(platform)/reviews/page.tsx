import type { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { RoboScoreBadge, RoboScoreRing } from "@/components/ui/robo-score";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import type { RoboScoreBreakdown } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Latest Robot Reviews",
  description: "Expert and community robot reviews with transparent RoboScore ratings. In-depth analysis of the latest robots across all categories.",
};

interface ReviewRow {
  id: string;
  review_type: string;
  title: string;
  body: string;
  robo_score: number | null;
  score_breakdown: RoboScoreBreakdown | null;
  verdict: string | null;
  verified_purchase: boolean;
  published_at: string | null;
  robots: {
    slug: string;
    name: string;
    robot_categories: { slug: string; name: string } | null;
    manufacturers: { name: string } | null;
  } | null;
}

interface CategoryRow { slug: string; name: string }

export default async function ReviewsPage() {
  const supabase = createServerClient();

  const [{ data: reviews }, { data: categories }] = await Promise.all([
    supabase
      .from("reviews")
      .select("id, review_type, title, body, robo_score, score_breakdown, verdict, verified_purchase, published_at, robots(slug, name, robot_categories(slug, name), manufacturers(name))")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(20)
      .returns<ReviewRow[]>(),
    supabase
      .from("robot_categories")
      .select("slug, name")
      .order("display_order")
      .returns<CategoryRow[]>(),
  ]);

  const allReviews = reviews || [];
  const expertReviews = allReviews.filter((r) => r.review_type === "expert");
  const communityReviews = allReviews.filter((r) => r.review_type === "community");

  return (
    <div>
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs items={[
            { name: "Home", href: "/" },
            { name: "Reviews", href: "/reviews" },
          ]} />
          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">Latest Reviews</h1>
          <p className="mt-3 max-w-2xl text-muted">
            Expert and community robot reviews with transparent, explainable RoboScore ratings.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <section className="border-b border-border px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-white">All</span>
            {(categories || []).map((cat) => (
              <Link
                key={cat.slug}
                href={`/explore/${cat.slug}`}
                className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-white/20 hover:text-foreground"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Expert reviews */}
      {expertReviews.length > 0 && (
        <section className="border-b border-border px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-xl font-bold">Expert Reviews</h2>
            <div className="space-y-6">
              {expertReviews.map((review) => {
                const robot = review.robots;
                const catSlug = (robot?.robot_categories as { slug: string } | null)?.slug || "all";
                const mfr = (robot?.manufacturers as { name: string } | null)?.name || "";

                return (
                  <div key={review.id} className="rounded-xl border border-white/20 bg-navy-light p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs font-semibold uppercase tracking-wider text-white">Expert Review</span>
                        </div>
                        <Link href={`/explore/${catSlug}/${robot?.slug}`}>
                          <p className="mt-1 text-xs text-muted">{mfr}</p>
                          <h3 className="text-xl font-bold transition-colors hover:text-white">{review.title}</h3>
                        </Link>
                      </div>
                      {review.robo_score != null && <RoboScoreRing score={review.robo_score} size={80} />}
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm text-muted">{review.body}</p>

                    {review.verdict && (
                      <p className="mt-3 text-sm">
                        <span className="font-semibold text-white">Verdict:</span>{" "}
                        <span className="text-muted">{review.verdict}</span>
                      </p>
                    )}

                    <div className="mt-4">
                      <Link
                        href={`/explore/${catSlug}/${robot?.slug}`}
                        className="text-sm font-medium text-white hover:underline"
                      >
                        Read Full Review &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Community reviews */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-xl font-bold">Community Reviews</h2>
          {allReviews.length === 0 ? (
            <div className="rounded-xl border border-border bg-navy-light p-12 text-center">
              <p className="text-lg font-semibold">No reviews yet</p>
              <p className="mt-2 text-sm text-muted">
                Be the first to review a robot.{" "}
                <Link href="/explore" className="text-white hover:underline">Browse robots</Link> and share your experience.
              </p>
            </div>
          ) : communityReviews.length === 0 ? (
            <div className="rounded-xl border border-border bg-navy-light p-8 text-center">
              <p className="text-muted">No community reviews yet. Browse a robot and be the first to share your experience.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {communityReviews.map((review) => {
                const robot = review.robots;
                const catSlug = (robot?.robot_categories as { slug: string } | null)?.slug || "all";

                return (
                  <div key={review.id} className="rounded-xl border border-border bg-navy-light p-5">
                    <Link href={`/explore/${catSlug}/${robot?.slug}`}>
                      <p className="text-xs text-muted">{robot?.name}</p>
                    </Link>
                    <h4 className="mt-1 font-semibold">{review.title}</h4>
                    <div className="mt-1 flex items-center gap-2">
                      {review.robo_score != null && <RoboScoreBadge score={review.robo_score} />}
                      {review.verified_purchase && (
                        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[13px] font-medium" style={{ color: "var(--status-success-text, #6B8AB8)" }}>Verified</span>
                      )}
                    </div>
                    <p className="mt-2 line-clamp-3 text-sm text-muted">{review.body}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
