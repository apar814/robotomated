import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { cn } from "@/lib/utils/cn";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://robotomated.com";

/* ══════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════ */

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
  years_in_robotics?: number | null;
  rsp_score?: number;
  rsp_score_breakdown?: Record<string, number>;
  rsp_score_percentile?: number;
  availability_status?: string;
  certifications?: { name: string; level: number; credential_id: string }[];
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
  delivery_on_time: boolean | null;
  issues_resolved_within_4hrs: boolean | null;
  robot_used: string | null;
  job_type: string | null;
  job_duration_days: number | null;
  uptime_achieved: number | null;
  verified_job: boolean;
  created_at: string;
}

interface FamiliarityRow {
  id: string;
  robot_category: string;
  robot_manufacturer: string | null;
  tier: string;
  years_experience: number;
  total_deployments: number;
  verified: boolean;
  self_reported: boolean;
}

interface CapabilityRow {
  id: string;
  capability: string;
  category: string;
  verified: boolean;
  verified_job_count: number;
  self_reported: boolean;
}

interface CaseStudyRow {
  id: string;
  title: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string;
  client_name: string | null;
  client_industry: string | null;
  robot_used: string | null;
  duration_description: string | null;
  metrics: Record<string, string>;
}

interface CertificationRow {
  id: string;
  certification_name: string;
  certification_level: number;
  specialization: string | null;
  score: number | null;
  credential_id: string | null;
  verified: boolean;
  issued_at: string | null;
  expires_at: string | null;
}

interface Props {
  params: Promise<{ slug: string }>;
}

/* ══════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════ */

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const dim = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn(dim, star <= Math.round(rating) ? "text-white" : "text-white/28")}
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
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function formatMemberSince(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

function formatRate(val: number | null) {
  if (val == null) return null;
  return `$${Number(val).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function RspScoreBadge({ score, percentile }: { score: number; percentile?: number | null }) {
  const color =
    score >= 80 ? "text-[#00E5A0] border-[#00E5A0]/30 bg-[#00E5A0]/5" :
    score >= 60 ? "text-amber-400 border-amber-500/30 bg-amber-500/5" :
    "text-red-400 border-red-500/30 bg-red-500/5";

  return (
    <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 ${color}`}>
      <span className="font-[family-name:var(--font-brand)] text-3xl font-bold">{score}</span>
      <div className="text-left">
        <p className="font-[family-name:var(--font-ui)] text-[13px] font-bold uppercase tracking-wider opacity-70">RSP Score</p>
        {percentile && percentile >= 90 && (
          <p className="text-[13px] font-semibold">Top {100 - percentile}%</p>
        )}
      </div>
    </div>
  );
}

function TierDots({ tier }: { tier: string }) {
  const filled = tier === "expert" ? 3 : tier === "intermediate" ? 2 : 1;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn(
            "h-2 w-2 rounded-full",
            i <= filled ? "bg-[#00E5A0]" : "bg-white/10"
          )}
        />
      ))}
    </div>
  );
}

function AvailabilityBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string }> = {
    available: { label: "Available Now", color: "bg-[#00E5A0]/10 text-[#00E5A0] border-[#00E5A0]/20" },
    busy: { label: "Currently Busy", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    unavailable: { label: "Unavailable", color: "bg-red-500/10 text-red-400 border-red-500/20" },
    by_appointment: { label: "By Appointment", color: "bg-white/10 text-white border-white/20" },
  };
  const c = config[status] || config.available;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-[family-name:var(--font-mono)] text-[13px] font-medium tracking-wider ${c.color}`}>
      <span className={cn("h-1.5 w-1.5 rounded-full", status === "available" ? "bg-[#00E5A0] animate-pulse" : "bg-current")} />
      {c.label}
    </span>
  );
}

/* ══════════════════════════════════════════════
   Metadata
   ══════════════════════════════════════════════ */

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
    title: `${data.company_name} — Robot Service Provider${location ? ` in ${location}` : ""} | RoboWork`,
    description:
      data.description?.slice(0, 155) ||
      `${data.company_name} — certified robot service provider. View fleet, certifications, reviews, and rates.`,
  };
}

/* ══════════════════════════════════════════════
   Page
   ══════════════════════════════════════════════ */

export default async function ProviderProfilePage({ params }: Props) {
  const { slug } = await params;
  const supabase = createServerClient();

  const { data: provider } = await supabase
    .from("robot_service_providers")
    .select("*")
    .eq("slug", slug)
    .single<RSPRow>();

  if (!provider) notFound();

  // Parallel data fetches
  const [
    { data: robots },
    { data: reviews },
    { data: familiarity },
    { data: capabilities },
    { data: caseStudies },
    { data: certifications },
  ] = await Promise.all([
    supabase
      .from("rsp_robots")
      .select("id, custom_name, custom_manufacturer, custom_category, description, daily_rate, weekly_rate, monthly_rate, minimum_days, available, operator_included, remote_capable, fulfillment_types")
      .eq("rsp_id", provider.id)
      .order("available", { ascending: false })
      .returns<RSPRobotRow[]>(),
    supabase
      .from("robowork_reviews")
      .select("id, rating, title, body, reviewer_name, reviewer_company, would_hire_again, delivery_on_time, issues_resolved_within_4hrs, robot_used, job_type, job_duration_days, uptime_achieved, verified_job, created_at")
      .eq("rsp_id", provider.id)
      .order("created_at", { ascending: false })
      .returns<ReviewRow[]>(),
    supabase
      .from("rsp_robot_familiarity")
      .select("id, robot_category, robot_manufacturer, tier, years_experience, total_deployments, verified, self_reported")
      .eq("rsp_id", provider.id)
      .order("tier", { ascending: false })
      .returns<FamiliarityRow[]>(),
    supabase
      .from("rsp_capabilities")
      .select("id, capability, category, verified, verified_job_count, self_reported")
      .eq("rsp_id", provider.id)
      .order("verified", { ascending: false })
      .returns<CapabilityRow[]>(),
    supabase
      .from("rsp_case_studies")
      .select("id, title, summary, challenge, solution, results, client_name, client_industry, robot_used, duration_description, metrics")
      .eq("rsp_id", provider.id)
      .eq("published", true)
      .order("featured", { ascending: false })
      .returns<CaseStudyRow[]>(),
    supabase
      .from("rsp_certifications")
      .select("id, certification_name, certification_level, specialization, score, credential_id, verified, issued_at, expires_at")
      .eq("rsp_id", provider.id)
      .order("certification_level", { ascending: false })
      .returns<CertificationRow[]>(),
  ]);

  const allRobots = robots || [];
  const allReviews = reviews || [];
  const allFamiliarity = familiarity || [];
  const allCapabilities = capabilities || [];
  const allCaseStudies = caseStudies || [];
  const allCertifications = certifications || [];
  const location = [provider.city, provider.state].filter(Boolean).join(", ");

  const hireAgainPct = allReviews.length > 0
    ? Math.round((allReviews.filter((r) => r.would_hire_again).length / allReviews.length) * 100)
    : 0;
  const onTimePct = allReviews.filter((r) => r.delivery_on_time !== null).length > 0
    ? Math.round(
        (allReviews.filter((r) => r.delivery_on_time === true).length /
          allReviews.filter((r) => r.delivery_on_time !== null).length) *
          100
      )
    : null;
  const avgUptime = allReviews.filter((r) => r.uptime_achieved != null).length > 0
    ? (
        allReviews
          .filter((r) => r.uptime_achieved != null)
          .reduce((sum, r) => sum + (r.uptime_achieved || 0), 0) /
        allReviews.filter((r) => r.uptime_achieved != null).length
      ).toFixed(1)
    : null;

  const verifiedCaps = allCapabilities.filter((c) => c.verified);
  const selfReportedCaps = allCapabilities.filter((c) => !c.verified);

  const rspScore = provider.rsp_score || 0;

  return (
    <div>
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

      {/* ═══ HERO ═══ */}
      <section className="border-b border-border px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "RoboWork", href: "/robowork" },
              { name: "Providers", href: "/robowork/providers" },
              { name: provider.company_name, href: `/robowork/providers/${provider.slug}` },
            ]}
          />

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-[family-name:var(--font-mono)] text-[13px] tracking-widest uppercase text-muted">
                  ROBOT SERVICE PROVIDER
                </p>
                {provider.is_founding_rsp && provider.founding_rsp_number && (
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[13px] font-bold tracking-wider"
                    style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#000" }}
                  >
                    FOUNDING RSP #{provider.founding_rsp_number}
                  </span>
                )}
              </div>

              <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
                {provider.company_name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-4">
                {location && (
                  <span className="flex items-center gap-1.5 text-sm text-muted">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {location}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <StarRating rating={provider.rating} size="lg" />
                  <span className="font-[family-name:var(--font-mono)] text-sm text-white">
                    {Number(provider.rating).toFixed(1)}
                  </span>
                  <span className="text-xs text-muted">
                    ({allReviews.length} review{allReviews.length !== 1 ? "s" : ""})
                  </span>
                </div>
                <AvailabilityBadge status={provider.availability_status || "available"} />
              </div>

              <p className="mt-1 text-xs text-muted">
                Member since {formatMemberSince(provider.created_at)}
                {provider.years_in_robotics && ` · ${provider.years_in_robotics} years in robotics`}
              </p>
            </div>

            {/* Right sidebar: Score + Contact */}
            <div className="flex flex-col items-end gap-3">
              {rspScore > 0 && (
                <RspScoreBadge score={rspScore} percentile={provider.rsp_score_percentile} />
              )}
              <Link
                href={`mailto:?subject=RoboWork inquiry: ${provider.company_name}`}
                className="rounded-lg bg-white/5 border border-white/20 px-6 py-3 font-[family-name:var(--font-mono)] text-[13px] font-semibold tracking-wider text-white transition-colors hover:bg-white/10"
              >
                CONTACT PROVIDER
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MAIN CONTENT (2-column on desktop) ═══ */}
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content (2/3) */}
          <div className="space-y-10 lg:col-span-2">
            {/* About */}
            <section>
              <h2 className="font-[family-name:var(--font-mono)] text-[13px] tracking-widest uppercase text-muted">About</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {provider.description || provider.bio || "This provider has not added a description yet."}
              </p>
              {provider.specializations.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {provider.specializations.map((s) => (
                    <span key={s} className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white">
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Certifications */}
            {allCertifications.length > 0 && (
              <section>
                <h2 className="font-[family-name:var(--font-mono)] text-[13px] tracking-widest uppercase text-muted">
                  RCO Certifications
                </h2>
                <div className="mt-3 space-y-2">
                  {allCertifications.map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between rounded-lg border border-border bg-[#0A0A0A] px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                          cert.certification_level === 4 ? "bg-amber-500/10 text-amber-400" :
                          cert.certification_level === 3 ? "bg-violet/10 text-violet" :
                          cert.certification_level === 2 ? "bg-green/10 text-green" :
                          "bg-white/5 text-white"
                        )}>
                          L{cert.certification_level}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-white">{cert.certification_name}</p>
                          {cert.specialization && (
                            <p className="text-[13px] text-muted">{cert.specialization}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {cert.score && (
                          <span className="font-[family-name:var(--font-mono)] text-sm text-white">{cert.score}%</span>
                        )}
                        {cert.verified && (
                          <svg className="h-4 w-4 text-[#00E5A0]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        {cert.credential_id && (
                          <Link href={`/verify/${cert.credential_id}`} className="text-[13px] text-white hover:underline">
                            Verify
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Robot Familiarity */}
            {allFamiliarity.length > 0 && (
              <section>
                <h2 className="font-[family-name:var(--font-mono)] text-[13px] tracking-widest uppercase text-muted">
                  Robot Familiarity
                </h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {allFamiliarity.map((f) => (
                    <div key={f.id} className="flex items-center justify-between rounded-lg border border-border bg-[#0A0A0A] px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {f.robot_manufacturer ? `${f.robot_manufacturer} — ` : ""}{f.robot_category}
                        </p>
                        <p className="text-[13px] text-muted">
                          {f.years_experience > 0 ? `${f.years_experience}yr` : ""}{f.total_deployments > 0 ? ` · ${f.total_deployments} deployments` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <TierDots tier={f.tier} />
                        <span className="font-[family-name:var(--font-ui)] text-[13px] font-bold uppercase tracking-wider text-muted">
                          {f.tier}
                        </span>
                        {f.verified ? (
                          <span className="rounded-full bg-[#00E5A0]/10 px-1.5 py-0.5 text-[8px] font-bold text-[#00E5A0]">VERIFIED</span>
                        ) : (
                          <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[8px] text-muted">SELF-REPORTED</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Capabilities */}
            {allCapabilities.length > 0 && (
              <section>
                <h2 className="font-[family-name:var(--font-mono)] text-[13px] tracking-widest uppercase text-muted">
                  Capabilities
                </h2>
                {verifiedCaps.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-2 text-[13px] font-semibold text-[#00E5A0]">Verified by Robotomated Jobs</p>
                    <div className="flex flex-wrap gap-1.5">
                      {verifiedCaps.map((c) => (
                        <span key={c.id} className="flex items-center gap-1 rounded-full border border-[#00E5A0]/20 bg-[#00E5A0]/5 px-3 py-1 text-xs text-[#00E5A0]">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          {c.capability} ({c.verified_job_count} jobs)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {selfReportedCaps.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-2 text-[13px] text-muted">Self-Reported</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selfReportedCaps.map((c) => (
                        <span key={c.id} className="rounded-full border border-border px-3 py-1 text-xs text-muted">
                          {c.capability}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Robot Fleet */}
            <section>
              <h2 className="font-[family-name:var(--font-mono)] text-[13px] tracking-widest uppercase text-muted">Robot Fleet</h2>
              <p className="mt-1 text-lg font-semibold text-white">
                {allRobots.length} Robot{allRobots.length !== 1 ? "s" : ""}
              </p>
              {allRobots.length === 0 ? (
                <p className="mt-4 text-sm text-muted">No robots listed yet.</p>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {allRobots.map((robot) => (
                    <div key={robot.id} className="rounded-xl border border-border bg-[#0A0A0A] p-5 transition-all hover:border-white/20">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-white">{robot.custom_name || "Unnamed Robot"}</h3>
                          {robot.custom_manufacturer && <p className="text-[11px] text-muted">{robot.custom_manufacturer}</p>}
                        </div>
                        <span className={cn(
                          "rounded-full px-2 py-0.5 font-[family-name:var(--font-mono)] text-[13px] tracking-wider",
                          robot.available ? "bg-[#00E5A0]/10 text-[#00E5A0]" : "bg-white/5 text-muted"
                        )}>
                          {robot.available ? "AVAILABLE" : "UNAVAILABLE"}
                        </span>
                      </div>
                      {robot.description && (
                        <p className="mt-2 text-xs leading-relaxed text-muted line-clamp-2">{robot.description}</p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-3">
                        {robot.daily_rate != null && (
                          <div><p className="font-[family-name:var(--font-mono)] text-[13px] text-muted">DAILY</p><p className="font-[family-name:var(--font-mono)] text-sm font-medium text-white">{formatRate(robot.daily_rate)}</p></div>
                        )}
                        {robot.weekly_rate != null && (
                          <div><p className="font-[family-name:var(--font-mono)] text-[13px] text-muted">WEEKLY</p><p className="font-[family-name:var(--font-mono)] text-sm font-medium text-white">{formatRate(robot.weekly_rate)}</p></div>
                        )}
                        {robot.monthly_rate != null && (
                          <div><p className="font-[family-name:var(--font-mono)] text-[13px] text-muted">MONTHLY</p><p className="font-[family-name:var(--font-mono)] text-sm font-medium text-white">{formatRate(robot.monthly_rate)}</p></div>
                        )}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {robot.operator_included && <span className="rounded-full bg-violet/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[13px] tracking-wider text-violet">OPERATOR INCLUDED</span>}
                        {robot.remote_capable && <span className="rounded-full bg-[#14B8A6]/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[13px] tracking-wider text-[#14B8A6]">REMOTE CAPABLE</span>}
                      </div>
                      <button className="mt-4 w-full rounded-lg border border-white/20 bg-white/5 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10">
                        Request Booking
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Case Studies */}
            {allCaseStudies.length > 0 && (
              <section>
                <h2 className="font-[family-name:var(--font-mono)] text-[13px] tracking-widest uppercase text-muted">Case Studies</h2>
                <div className="mt-4 space-y-4">
                  {allCaseStudies.map((cs) => (
                    <div key={cs.id} className="rounded-xl border border-border bg-[#0A0A0A] p-6">
                      <div className="flex items-start justify-between">
                        <h3 className="font-display text-base font-bold text-white">{cs.title}</h3>
                        {cs.client_industry && (
                          <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[13px] text-white">{cs.client_industry}</span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-muted">{cs.summary}</p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-lg border border-border/50 bg-[#0C0C0C] p-3">
                          <p className="text-[13px] font-bold uppercase tracking-wider text-red-400">Challenge</p>
                          <p className="mt-1 text-xs text-muted">{cs.challenge}</p>
                        </div>
                        <div className="rounded-lg border border-border/50 bg-[#0C0C0C] p-3">
                          <p className="text-[13px] font-bold uppercase tracking-wider text-white">Solution</p>
                          <p className="mt-1 text-xs text-muted">{cs.solution}</p>
                        </div>
                        <div className="rounded-lg border border-border/50 bg-[#0C0C0C] p-3">
                          <p className="text-[13px] font-bold uppercase tracking-wider text-[#00E5A0]">Results</p>
                          <p className="mt-1 text-xs text-muted">{cs.results}</p>
                        </div>
                      </div>
                      {cs.metrics && Object.keys(cs.metrics).length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-3">
                          {Object.entries(cs.metrics).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <p className="font-[family-name:var(--font-brand)] text-lg font-bold text-white">{value}</p>
                              <p className="text-[13px] uppercase text-muted">{key}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            <section>
              <h2 className="font-[family-name:var(--font-mono)] text-[13px] tracking-widest uppercase text-muted">Reviews</h2>
              <p className="mt-1 text-lg font-semibold text-white">
                {allReviews.length} Review{allReviews.length !== 1 ? "s" : ""}
              </p>

              {/* Review metrics */}
              {allReviews.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="rounded-lg border border-border bg-[#0A0A0A] px-4 py-2.5 text-center">
                    <p className="font-[family-name:var(--font-brand)] text-xl font-bold text-white">{hireAgainPct}%</p>
                    <p className="text-[13px] uppercase text-muted">Would Hire Again</p>
                  </div>
                  {onTimePct !== null && (
                    <div className="rounded-lg border border-border bg-[#0A0A0A] px-4 py-2.5 text-center">
                      <p className="font-[family-name:var(--font-brand)] text-xl font-bold text-white">{onTimePct}%</p>
                      <p className="text-[13px] uppercase text-muted">On-Time Delivery</p>
                    </div>
                  )}
                  {avgUptime && (
                    <div className="rounded-lg border border-border bg-[#0A0A0A] px-4 py-2.5 text-center">
                      <p className="font-[family-name:var(--font-brand)] text-xl font-bold text-white">{avgUptime}%</p>
                      <p className="text-[13px] uppercase text-muted">Avg Uptime</p>
                    </div>
                  )}
                </div>
              )}

              {allReviews.length === 0 ? (
                <p className="mt-4 text-sm text-muted">No reviews yet.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {allReviews.map((review) => (
                    <div key={review.id} className="rounded-xl border border-border bg-[#0A0A0A] p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} />
                            <span className="font-[family-name:var(--font-mono)] text-xs text-white">{review.rating}/5</span>
                          </div>
                          {review.title && (
                            <h4 className="mt-1.5 text-sm font-semibold text-white">{review.title}</h4>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {review.verified_job && (
                            <span className="rounded-full bg-white/5 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[8px] tracking-wider text-white">
                              VERIFIED JOB
                            </span>
                          )}
                          {review.would_hire_again && (
                            <span className="rounded-full bg-[#00E5A0]/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[8px] tracking-wider text-[#00E5A0]">
                              WOULD HIRE AGAIN
                            </span>
                          )}
                        </div>
                      </div>

                      {review.body && (
                        <p className="mt-3 text-xs leading-relaxed text-muted">{review.body}</p>
                      )}

                      {/* Review metrics */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {review.robot_used && (
                          <span className="rounded-full border border-border px-2 py-0.5 text-[13px] text-muted">Robot: {review.robot_used}</span>
                        )}
                        {review.job_type && (
                          <span className="rounded-full border border-border px-2 py-0.5 text-[13px] text-muted">{review.job_type}</span>
                        )}
                        {review.job_duration_days && (
                          <span className="rounded-full border border-border px-2 py-0.5 text-[13px] text-muted">{review.job_duration_days} days</span>
                        )}
                        {review.delivery_on_time === true && (
                          <span className="rounded-full bg-[#00E5A0]/10 px-2 py-0.5 text-[13px] text-[#00E5A0]">On Time</span>
                        )}
                        {review.uptime_achieved != null && (
                          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[13px] text-white">{review.uptime_achieved}% uptime</span>
                        )}
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-muted">
                        <span className="text-[11px]">
                          {review.reviewer_name || "Anonymous"}
                          {review.reviewer_company && <span> at {review.reviewer_company}</span>}
                        </span>
                        <span className="text-[11px]">&middot;</span>
                        <span className="text-[11px]">{formatDate(review.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar (1/3) */}
          <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            {/* Verification badges */}
            <div className="rounded-xl border border-border bg-[#0A0A0A] p-5">
              <h3 className="font-[family-name:var(--font-mono)] text-[13px] tracking-widest uppercase text-muted">Verification</h3>
              <div className="mt-3 space-y-2">
                <div className={cn("flex items-center gap-2 text-xs", provider.verified ? "text-white" : "text-muted")}>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  {provider.verified ? "Identity Verified" : "Identity Not Verified"}
                </div>
                <div className={cn("flex items-center gap-2 text-xs", provider.insurance_verified ? "text-[#00E5A0]" : "text-muted")}>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM13.707 8.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  {provider.insurance_verified ? "Insurance Verified" : "Insurance Not Verified"}
                </div>
                <div className={cn("flex items-center gap-2 text-xs", provider.background_checked ? "text-[#14B8A6]" : "text-muted")}>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" /></svg>
                  {provider.background_checked ? "Background Checked" : "Background Check Pending"}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-xl border border-border bg-[#0A0A0A] p-5">
              <h3 className="font-[family-name:var(--font-mono)] text-[13px] tracking-widest uppercase text-muted">Stats</h3>
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">Jobs Completed</span>
                  <span className="font-[family-name:var(--font-mono)] text-sm font-medium text-white">{provider.completed_jobs}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">Response Time</span>
                  <span className="font-[family-name:var(--font-mono)] text-sm font-medium text-white">
                    {provider.response_time_hours != null
                      ? provider.response_time_hours < 1 ? "<1 hour" : `${Math.round(provider.response_time_hours)} hours`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">Reviews</span>
                  <span className="font-[family-name:var(--font-mono)] text-sm font-medium text-white">{allReviews.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">Service Radius</span>
                  <span className="font-[family-name:var(--font-mono)] text-sm font-medium text-white">{provider.service_radius} mi</span>
                </div>
                {provider.years_in_robotics && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted">Years in Robotics</span>
                    <span className="font-[family-name:var(--font-mono)] text-sm font-medium text-white">{provider.years_in_robotics}</span>
                  </div>
                )}
              </div>
            </div>

            {/* RSP Score Breakdown */}
            {rspScore > 0 && provider.rsp_score_breakdown && Object.keys(provider.rsp_score_breakdown).length > 0 && (
              <div className="rounded-xl border border-border bg-[#0A0A0A] p-5">
                <h3 className="font-[family-name:var(--font-mono)] text-[13px] tracking-widest uppercase text-muted">Score Breakdown</h3>
                <div className="mt-3 space-y-2">
                  {Object.entries(provider.rsp_score_breakdown).map(([key, val]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted">{key.replace(/_/g, " ")}</span>
                        <span className="font-[family-name:var(--font-mono)] text-white">{val}</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-border">
                        <div
                          className={cn("h-1.5 rounded-full", val >= 80 ? "bg-[#00E5A0]" : val >= 60 ? "bg-amber-500" : "bg-red-400")}
                          style={{ width: `${val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="rounded-xl border border-white/20 bg-white/5 p-5 text-center">
              <h3 className="font-display text-base font-bold text-white">Need a robot?</h3>
              <p className="mt-2 text-xs text-muted">
                Contact {provider.company_name} for a custom quote.
              </p>
              <Link
                href={`mailto:?subject=RoboWork inquiry: ${provider.company_name}`}
                className="mt-4 block rounded-lg bg-white px-6 py-3 text-xs font-semibold text-black transition-colors hover:bg-white/90"
              >
                Contact Provider
              </Link>
              {provider.website && (
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-[13px] text-white hover:underline"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
