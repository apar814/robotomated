import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { cn } from "@/lib/utils/cn";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://robotomated.com";

interface RSPRow {
  id: string;
  slug: string;
  company_name: string;
  description: string | null;
  bio: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  service_radius: number;
  rating: number;
  total_jobs: number;
  completed_jobs: number;
  response_time_hours: number | null;
  verified: boolean;
  insurance_verified: boolean;
  background_checked: boolean;
  specializations: string[];
  fulfillment_types: string[];
  website: string | null;
  linkedin: string | null;
  created_at: string;
  is_founding_rsp?: boolean;
  founding_rsp_number?: number | null;
}

interface RSPRobotRow {
  id: string;
  custom_name: string | null;
  custom_manufacturer: string | null;
  custom_category: string | null;
  description: string | null;
  daily_rate: number | null;
  weekly_rate: number | null;
  monthly_rate: number | null;
  minimum_days: number;
  available: boolean;
  operator_included: boolean;
  remote_capable: boolean;
  fulfillment_types: string[];
}

interface ReviewRow {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  reviewer_name: string | null;
  reviewer_company: string | null;
  would_hire_again: boolean;
  created_at: string;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data } = await supabase
    .from("robot_service_providers")
    .select("company_name, city, state, description")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Provider Not Found" };

  const location = [data.city, data.state].filter(Boolean).join(", ");
  return {
    title: `${data.company_name} — Robot Service Provider${location ? ` in ${location}` : ""}`,
    description:
      data.description?.slice(0, 155) ||
      `${data.company_name} is a robot service provider${location ? ` based in ${location}` : ""}. View fleet, rates, and reviews.`,
    openGraph: {
      title: `${data.company_name} — RoboWork Provider`,
      description: data.description?.slice(0, 155) || undefined,
    },
  };
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const dim = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn(dim, star <= Math.round(rating) ? "text-[#C8FF00]" : "text-white/10")}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatMemberSince(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

function formatRate(val: number | null) {
  if (val == null) return null;
  return `$${Number(val).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default async function ProviderProfilePage({ params }: Props) {
  const { slug } = await params;
  const supabase = createServerClient();

  const { data: provider } = await supabase
    .from("robot_service_providers")
    .select("*")
    .eq("slug", slug)
    .single<RSPRow>();

  if (!provider) notFound();

  const [{ data: robots }, { data: reviews }] = await Promise.all([
    supabase
      .from("rsp_robots")
      .select("id, custom_name, custom_manufacturer, custom_category, description, daily_rate, weekly_rate, monthly_rate, minimum_days, available, operator_included, remote_capable, fulfillment_types")
      .eq("rsp_id", provider.id)
      .order("available", { ascending: false })
      .returns<RSPRobotRow[]>(),
    supabase
      .from("robowork_reviews")
      .select("id, rating, title, body, reviewer_name, reviewer_company, would_hire_again, created_at")
      .eq("rsp_id", provider.id)
      .order("created_at", { ascending: false })
      .returns<ReviewRow[]>(),
  ]);

  const allRobots = robots || [];
  const allReviews = reviews || [];
  const location = [provider.city, provider.state].filter(Boolean).join(", ");

  return (
    <div>
      {/* Schema.org LocalBusiness JSON-LD */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: provider.company_name,
          description: provider.description || provider.bio || undefined,
          url: `${BASE_URL}/robowork/providers/${provider.slug}`,
          ...(location && {
            address: {
              "@type": "PostalAddress",
              addressLocality: provider.city || undefined,
              addressRegion: provider.state || undefined,
              addressCountry: provider.country || "US",
            },
          }),
          aggregateRating:
            allReviews.length > 0
              ? {
                  "@type": "AggregateRating",
                  ratingValue: Number(provider.rating).toFixed(1),
                  reviewCount: allReviews.length,
                  bestRating: 5,
                  worstRating: 1,
                }
              : undefined,
        }}
      />

      {/* Hero */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "RoboWork", href: "/robowork" },
              { name: "Providers", href: "/robowork/providers" },
              { name: provider.company_name, href: `/robowork/providers/${provider.slug}` },
            ]}
          />

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-mono text-[9px] tracking-widest uppercase text-text-ghost">
                ROBOT SERVICE PROVIDER
              </p>
              <h1 className="mt-2 font-sans text-3xl font-bold text-text-primary sm:text-4xl">
                {provider.company_name}
                {provider.is_founding_rsp && provider.founding_rsp_number && (
                  <span
                    className="ml-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold align-middle"
                    style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#000" }}
                  >
                    Founding RSP #{provider.founding_rsp_number}
                  </span>
                )}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                {location && (
                  <span className="flex items-center gap-1.5 font-sans text-sm text-text-secondary">
                    <svg className="h-4 w-4 text-text-ghost" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {location}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <StarRating rating={provider.rating} size="lg" />
                  <span className="font-mono text-sm text-text-primary">{Number(provider.rating).toFixed(1)}</span>
                  <span className="text-xs text-text-ghost">
                    ({allReviews.length} review{allReviews.length !== 1 ? "s" : ""})
                  </span>
                </div>
                <span className="font-sans text-xs text-text-ghost">
                  Member since {formatMemberSince(provider.created_at)}
                </span>
              </div>
            </div>
            <Link
              href={`mailto:?subject=RoboWork inquiry: ${provider.company_name}`}
              className="shrink-0 rounded-lg bg-[#0EA5E9] px-6 py-3 font-mono text-[10px] font-semibold tracking-wider text-black transition-shadow hover:shadow-[0_0_16px_rgba(14,165,233,0.3)]"
            >
              CONTACT PROVIDER
            </Link>
          </div>
        </div>
      </section>

      {/* About + Verification + Stats */}
      <section className="border-b border-border px-4 py-10">
        <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-3">
          {/* About */}
          <div className="lg:col-span-2">
            <h2 className="font-mono text-[9px] tracking-widest uppercase text-text-ghost">About</h2>
            <p className="mt-3 font-sans text-sm leading-relaxed text-text-secondary">
              {provider.description || provider.bio || "This provider has not added a description yet."}
            </p>

            {/* Specializations */}
            {provider.specializations.length > 0 && (
              <div className="mt-6">
                <h3 className="font-mono text-[9px] tracking-widest uppercase text-text-ghost">Specializations</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {provider.specializations.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-[#0EA5E9]/10 px-3 py-1 font-sans text-xs font-medium text-[#0EA5E9]"
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats + badges sidebar */}
          <div className="space-y-6">
            {/* Verification badges */}
            <div className="rounded-xl border border-border bg-obsidian-surface p-5">
              <h3 className="font-mono text-[9px] tracking-widest uppercase text-text-ghost">Verification</h3>
              <div className="mt-3 space-y-2">
                <div className={cn("flex items-center gap-2 font-sans text-xs", provider.verified ? "text-[#0EA5E9]" : "text-text-ghost")}>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {provider.verified ? "Identity Verified" : "Identity Not Verified"}
                </div>
                <div className={cn("flex items-center gap-2 font-sans text-xs", provider.insurance_verified ? "text-[#00E5A0]" : "text-text-ghost")}>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM13.707 8.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {provider.insurance_verified ? "Insurance Verified" : "Insurance Not Verified"}
                </div>
                <div className={cn("flex items-center gap-2 font-sans text-xs", provider.background_checked ? "text-[#14B8A6]" : "text-text-ghost")}>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                  </svg>
                  {provider.background_checked ? "Background Checked" : "Background Check Pending"}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-xl border border-border bg-obsidian-surface p-5">
              <h3 className="font-mono text-[9px] tracking-widest uppercase text-text-ghost">Stats</h3>
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs text-text-secondary">Jobs Completed</span>
                  <span className="font-mono text-sm font-medium text-text-primary">{provider.completed_jobs}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs text-text-secondary">Response Time</span>
                  <span className="font-mono text-sm font-medium text-text-primary">
                    {provider.response_time_hours != null
                      ? provider.response_time_hours < 1
                        ? "<1 hour"
                        : `${Math.round(provider.response_time_hours)} hours`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs text-text-secondary">Total Reviews</span>
                  <span className="font-mono text-sm font-medium text-text-primary">{allReviews.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs text-text-secondary">Service Radius</span>
                  <span className="font-mono text-sm font-medium text-text-primary">{provider.service_radius} mi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Robot Fleet */}
      <section className="border-b border-border px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-mono text-[9px] tracking-widest uppercase text-text-ghost">Robot Fleet</h2>
          <p className="mt-1 font-sans text-xl font-semibold text-text-primary">
            {allRobots.length} Robot{allRobots.length !== 1 ? "s" : ""} Available
          </p>

          {allRobots.length === 0 ? (
            <p className="mt-6 font-sans text-sm text-text-ghost">
              This provider has not listed any robots yet.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allRobots.map((robot) => (
                <div
                  key={robot.id}
                  className="rounded-xl border border-border bg-obsidian-surface p-5 transition-all hover:border-[#0EA5E9]/20"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-sans text-sm font-semibold text-text-primary">
                        {robot.custom_name || "Unnamed Robot"}
                      </h3>
                      {robot.custom_manufacturer && (
                        <p className="mt-0.5 font-sans text-[11px] text-text-ghost">{robot.custom_manufacturer}</p>
                      )}
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 font-mono text-[9px] tracking-wider",
                        robot.available
                          ? "bg-[#00E5A0]/10 text-[#00E5A0]"
                          : "bg-white/[0.04] text-text-ghost"
                      )}
                    >
                      {robot.available ? "AVAILABLE" : "UNAVAILABLE"}
                    </span>
                  </div>

                  {robot.description && (
                    <p className="mt-2 font-sans text-xs leading-relaxed text-text-tertiary line-clamp-2">
                      {robot.description}
                    </p>
                  )}

                  {/* Rates */}
                  <div className="mt-3 flex flex-wrap gap-3">
                    {robot.daily_rate != null && (
                      <div>
                        <p className="font-mono text-[9px] tracking-wider text-text-ghost">DAILY</p>
                        <p className="font-mono text-sm font-medium text-text-primary">{formatRate(robot.daily_rate)}</p>
                      </div>
                    )}
                    {robot.weekly_rate != null && (
                      <div>
                        <p className="font-mono text-[9px] tracking-wider text-text-ghost">WEEKLY</p>
                        <p className="font-mono text-sm font-medium text-text-primary">{formatRate(robot.weekly_rate)}</p>
                      </div>
                    )}
                    {robot.monthly_rate != null && (
                      <div>
                        <p className="font-mono text-[9px] tracking-wider text-text-ghost">MONTHLY</p>
                        <p className="font-mono text-sm font-medium text-text-primary">{formatRate(robot.monthly_rate)}</p>
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {robot.operator_included && (
                      <span className="rounded-full bg-[#7B2FFF]/10 px-2 py-0.5 font-mono text-[9px] tracking-wider text-[#7B2FFF]">
                        OPERATOR INCLUDED
                      </span>
                    )}
                    {robot.remote_capable && (
                      <span className="rounded-full bg-[#14B8A6]/10 px-2 py-0.5 font-mono text-[9px] tracking-wider text-[#14B8A6]">
                        REMOTE CAPABLE
                      </span>
                    )}
                    {robot.fulfillment_types.map((ft) => (
                      <span
                        key={ft}
                        className="rounded-full bg-white/[0.04] px-2 py-0.5 font-mono text-[9px] tracking-wider text-text-ghost"
                      >
                        {ft.replace(/_/g, " ").toUpperCase()}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    className="mt-4 w-full rounded-lg border border-[#C8FF00]/30 bg-[#C8FF00]/5 py-2 font-sans text-xs font-medium text-[#C8FF00] transition-colors hover:bg-[#C8FF00]/10"
                  >
                    Request Booking
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reviews */}
      <section className="border-b border-border px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-mono text-[9px] tracking-widest uppercase text-text-ghost">Reviews</h2>
          <p className="mt-1 font-sans text-xl font-semibold text-text-primary">
            {allReviews.length} Review{allReviews.length !== 1 ? "s" : ""}
          </p>

          {allReviews.length === 0 ? (
            <p className="mt-6 font-sans text-sm text-text-ghost">No reviews yet.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {allReviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-xl border border-border bg-obsidian-surface p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={review.rating} />
                        <span className="font-mono text-xs text-text-secondary">
                          {review.rating}/5
                        </span>
                      </div>
                      {review.title && (
                        <h4 className="mt-1.5 font-sans text-sm font-semibold text-text-primary">
                          {review.title}
                        </h4>
                      )}
                    </div>
                    {review.would_hire_again && (
                      <span className="rounded-full bg-[#00E5A0]/10 px-2.5 py-0.5 font-mono text-[9px] tracking-wider text-[#00E5A0]">
                        WOULD HIRE AGAIN
                      </span>
                    )}
                  </div>
                  {review.body && (
                    <p className="mt-3 font-sans text-xs leading-relaxed text-text-secondary">
                      {review.body}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-2 text-text-ghost">
                    <span className="font-sans text-[11px]">
                      {review.reviewer_name || "Anonymous"}
                      {review.reviewer_company && (
                        <span className="text-text-ghost"> at {review.reviewer_company}</span>
                      )}
                    </span>
                    <span className="text-[11px]">&middot;</span>
                    <span className="font-sans text-[11px]">{formatDate(review.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-sans text-2xl font-bold text-text-primary">
            Need a robot for your project?
          </h2>
          <p className="mt-3 font-sans text-sm text-text-secondary">
            Contact {provider.company_name} to discuss your requirements and get a custom quote.
          </p>
          <Link
            href={`mailto:?subject=RoboWork inquiry: ${provider.company_name}`}
            className="mt-6 inline-block rounded-lg bg-[#0EA5E9] px-8 py-3 font-mono text-[10px] font-semibold tracking-wider text-black transition-shadow hover:shadow-[0_0_16px_rgba(14,165,233,0.3)]"
          >
            CONTACT PROVIDER
          </Link>
        </div>
      </section>
    </div>
  );
}
