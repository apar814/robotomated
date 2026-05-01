import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Certified Pre-Owned Robots — Verified & Ready to Deploy | Robotomated",
  description:
    "Browse certified pre-owned robots with verified inspection reports, warranty coverage, and transparent pricing. Save 30-60% versus new.",
};

interface CpoListing {
  id: string;
  robot_name: string;
  manufacturer: string;
  year: number;
  condition: number;
  operating_hours: number;
  price: number;
  location: string;
  category: string;
  certified: boolean;
  description: string;
  created_at: string;
}

function ConditionStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Condition: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "text-[#00E5A0]" : "text-white/45"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatHours(hours: number): string {
  return new Intl.NumberFormat("en-US").format(hours);
}

function CpoCard({ listing }: { listing: CpoListing }) {
  return (
    <div className="glass rounded-xl border border-white/10 p-6 transition-colors hover:border-[#00C2FF]/30">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">
            {listing.robot_name}
          </h3>
          <p className="text-sm text-muted">
            {listing.manufacturer} -- {listing.year}
          </p>
        </div>
        {listing.certified && (
          <span className="rounded-full bg-[#00E5A0]/20 px-3 py-1 font-[family-name:var(--font-ui)] text-[13px] font-semibold uppercase tracking-[0.08em] text-[#00E5A0]">
            CPO Certified
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <ConditionStars rating={listing.condition} />
        <span className="font-[family-name:var(--font-mono)] text-sm text-muted">
          {formatHours(listing.operating_hours)} hrs
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted">
        {listing.description}
      </p>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-2xl font-bold text-white">
            {formatPrice(listing.price)}
          </p>
          <p className="text-xs text-muted">{listing.location}</p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-[#00C2FF]/10 px-4 py-2 text-sm font-semibold text-[#00C2FF] transition-colors hover:bg-[#00C2FF]/20"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

const FILTER_CATEGORIES = [
  "All",
  "Industrial Arms",
  "Cobots",
  "Mobile Robots",
  "Warehouse",
  "Drones",
  "Service Robots",
] as const;

export default async function CpoPage() {
  const supabase = createServerClient();
  const { data: listings } = await supabase
    .from("cpo_listings")
    .select("*")
    .eq("status", "listed")
    .order("created_at", { ascending: false });

  const cpoListings: CpoListing[] = (listings || []).map(
    (row: Record<string, unknown>) => ({
      id: row.id as string,
      robot_name: (row.robot_name as string) || "Unknown Robot",
      manufacturer: (row.robot_manufacturer as string) || "Unknown",
      year: (row.year as number) || 2020,
      condition: (row.condition as number) || 3,
      operating_hours: (row.operating_hours as number) || 0,
      price: (row.asking_price as number) || 0,
      location: (row.city as string) || (row.state as string) || "N/A",
      category: (row.condition_report as string) || "Other",
      certified: (row.robotomated_certified as boolean) ?? true,
      description: (row.condition_report as string) || "",
      created_at: row.created_at as string,
    })
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Certified Pre-Owned", href: "/cpo" },
        ]}
      />

      <section className="mt-8 text-center">
        <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-white/60">
          [ CPO MARKETPLACE ]
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Certified Pre-Owned Robots
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
          Every robot inspected, tested, and certified. Transparent history.
          Warranty included. Save 30-60% versus buying new.
        </p>
      </section>

      <section className="mt-12">
        <div className="flex flex-wrap gap-3">
          {FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className="rounded-full border border-white/10 px-4 py-1.5 font-[family-name:var(--font-ui)] text-[11px] uppercase tracking-[0.08em] text-muted transition-colors hover:border-[#00C2FF] hover:text-white"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8">
        {cpoListings.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cpoListings.map((listing) => (
              <CpoCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="glass flex flex-col items-center justify-center rounded-xl border border-white/10 py-20 text-center">
            <div className="text-4xl text-white/45">--</div>
            <h3 className="mt-4 font-display text-lg font-semibold text-white/60">
              No CPO listings yet
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted">
              The certified pre-owned marketplace is launching soon. List your
              robot to be among the first sellers.
            </p>
            <a
              href="#list"
              className="mt-6 rounded-lg bg-[#00C2FF] px-6 py-2.5 font-display text-sm font-semibold text-[#0A0F1E] transition-colors hover:bg-[#00C2FF]/80"
            >
              List Your Robot
            </a>
          </div>
        )}
      </section>

      <section id="list" className="mt-20">
        <div className="glass rounded-2xl border border-white/10 p-8 sm:p-12">
          <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-white/60">
            [ SELLER PORTAL ]
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-white">
            List Your Robot
          </h2>
          <p className="mt-2 text-muted">
            Submit your robot for CPO certification. Our team inspects, tests,
            and lists it with full transparency.
          </p>
          <div className="mt-8">
            <form
              action="/api/cpo"
              method="POST"
              className="grid gap-6 sm:grid-cols-2"
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="robot_name"
                  className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted"
                >
                  Robot Name / Model
                </label>
                <input
                  id="robot_name"
                  name="robot_name"
                  type="text"
                  required
                  placeholder="e.g. Fanuc CRX-10iA"
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#00C2FF] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="cpo_manufacturer"
                  className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted"
                >
                  Manufacturer
                </label>
                <input
                  id="cpo_manufacturer"
                  name="manufacturer"
                  type="text"
                  required
                  placeholder="e.g. Fanuc"
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#00C2FF] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="cpo_year"
                  className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted"
                >
                  Year
                </label>
                <input
                  id="cpo_year"
                  name="year"
                  type="number"
                  required
                  min="2000"
                  max="2026"
                  placeholder="2022"
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#00C2FF] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="cpo_hours"
                  className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted"
                >
                  Operating Hours
                </label>
                <input
                  id="cpo_hours"
                  name="operating_hours"
                  type="number"
                  required
                  min="0"
                  placeholder="12000"
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#00C2FF] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="cpo_price"
                  className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted"
                >
                  Asking Price (USD)
                </label>
                <input
                  id="cpo_price"
                  name="price"
                  type="number"
                  required
                  min="0"
                  placeholder="35000"
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#00C2FF] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="cpo_location"
                  className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted"
                >
                  Location
                </label>
                <input
                  id="cpo_location"
                  name="location"
                  type="text"
                  required
                  placeholder="City, State"
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#00C2FF] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <label
                  htmlFor="cpo_description"
                  className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted"
                >
                  Description
                </label>
                <textarea
                  id="cpo_description"
                  name="description"
                  rows={3}
                  required
                  placeholder="Describe the robot, its history, and any upgrades or known issues..."
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#00C2FF] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="cpo_email"
                  className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted"
                >
                  Contact Email
                </label>
                <input
                  id="cpo_email"
                  name="contact_email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#00C2FF] focus:outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#00E5A0] px-8 py-3 font-display font-semibold text-[#0A0F1E] transition-colors hover:bg-[#00E5A0]/80"
                >
                  Submit for Certification
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
