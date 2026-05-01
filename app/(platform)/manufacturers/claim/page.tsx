"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { CompanyLogo } from "@/components/ui/company-logo";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Manufacturer {
  id: string;
  slug: string;
  name: string;
  country: string | null;
  website: string | null;
  logo_url: string | null;
}

interface ClaimForm {
  /* Step 1 */
  manufacturerId: string;
  manufacturerName: string;
  manufacturerWebsite: string | null;
  /* Step 2 */
  workEmail: string;
  jobTitle: string;
  linkedInUrl: string;
  /* Step 3 */
  description: string;
  contactEmail: string;
  contactPhone: string;
  logoUrl: string;
  catalogUrl: string;
  /* Step 4 */
  featuredListing: boolean;
  sponsoredRobots: boolean;
  preferredContact: string;
}

const INITIAL_FORM: ClaimForm = {
  manufacturerId: "",
  manufacturerName: "",
  manufacturerWebsite: null,
  workEmail: "",
  jobTitle: "",
  linkedInUrl: "",
  description: "",
  contactEmail: "",
  contactPhone: "",
  logoUrl: "",
  catalogUrl: "",
  featuredListing: false,
  sponsoredRobots: false,
  preferredContact: "email",
};

const STEPS = [
  "Find Your Company",
  "Verify Ownership",
  "Enhance Profile",
  "Partnership",
] as const;

/* ------------------------------------------------------------------ */
/*  Page (metadata is not exportable from "use client", but Next.js   */
/*  will pick up generateMetadata from a parent layout or we rely on  */
/*  the <title> tag set via head)                                      */
/* ------------------------------------------------------------------ */

export default function ManufacturerClaimPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ClaimForm>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* Step 1 state */
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Manufacturer[]>([]);
  const [searching, setSearching] = useState(false);

  /* ---- Search manufacturers ---- */
  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(
        `/api/manufacturers/top?q=${encodeURIComponent(q)}&limit=8`
      );
      if (res.ok) {
        const data = await res.json();
        setResults(Array.isArray(data) ? data : data.manufacturers ?? []);
      }
    } catch {
      /* silently ignore network errors */
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 300);
    return () => clearTimeout(t);
  }, [query, search]);

  /* ---- Select manufacturer ---- */
  function selectManufacturer(m: Manufacturer) {
    setForm((f) => ({
      ...f,
      manufacturerId: m.id,
      manufacturerName: m.name,
      manufacturerWebsite: m.website,
    }));
  }

  /* ---- Validation per step ---- */
  function canAdvance(): boolean {
    switch (step) {
      case 0:
        return !!form.manufacturerId;
      case 1:
        return (
          !!form.workEmail &&
          form.workEmail.includes("@") &&
          !!form.jobTitle
        );
      case 2:
        return true; /* all optional */
      case 3:
        return true;
      default:
        return false;
    }
  }

  /* ---- Submit ---- */
  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/manufacturers/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body.error || `Request failed (${res.status})`
        );
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  }

  /* ---- Success screen ---- */
  if (submitted) {
    return (
      <div>
        <section className="border-b border-white/[0.06] px-4 py-12">
          <div className="mx-auto max-w-3xl">
            <Breadcrumbs
              items={[
                { name: "Home", href: "/" },
                { name: "Manufacturers", href: "/manufacturers" },
                { name: "Claim Profile", href: "/manufacturers/claim" },
              ]}
            />
          </div>
        </section>
        <section className="px-4 py-24">
          <div className="mx-auto max-w-lg text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "var(--status-success, #3A5876)" }}>
              <svg
                className="h-8 w-8" style={{ color: "var(--status-success-text, #6B8AB8)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Claim Submitted
            </h1>
            <p className="mt-3 text-muted">
              We will review your claim for{" "}
              <span className="font-semibold text-foreground">
                {form.manufacturerName}
              </span>{" "}
              and respond within 2 business days. Check your inbox at{" "}
              <span className="font-mono text-sm text-white">
                {form.workEmail}
              </span>
              .
            </p>
            <Link
              href="/manufacturers"
              className="mt-8 inline-block rounded-lg bg-white/5 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10"
            >
              Back to Manufacturers
            </Link>
          </div>
        </section>
      </div>
    );
  }

  /* ---- Main form ---- */
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-white/[0.06] px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Manufacturers", href: "/manufacturers" },
              { name: "Claim Profile", href: "/manufacturers/claim" },
            ]}
          />
          <p className="mt-6 font-mono text-[13px] tracking-widest uppercase text-muted/60">
            MANUFACTURER VERIFICATION
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Claim Your Manufacturer Profile
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted">
            Verify your company and take control of your profile on
            Robotomated. Update information, add products, and explore
            partnership opportunities.
          </p>
        </div>
      </section>

      {/* Stepper */}
      <section className="border-b border-white/[0.06] px-4 py-6">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <button
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-bold transition-colors ${
                  i === step
                    ? "bg-white text-black"
                    : i < step
                      ? "bg-white/10 text-white cursor-pointer"
                      : "bg-white/[0.04] text-muted/40"
                }`}
              >
                {i < step ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </button>
              <span
                className={`hidden text-xs sm:inline ${
                  i === step
                    ? "font-medium text-foreground"
                    : i < step
                      ? "text-white"
                      : "text-muted/40"
                }`}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`hidden h-px w-8 sm:block ${
                    i < step ? "bg-white/20" : "bg-white/[0.06]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Form steps */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-3xl">
          {/* ------ Step 1: Find Company ------ */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Search for your company
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Boston Dynamics, Universal Robots..."
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/40 focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
                />
                {searching && (
                  <p className="mt-2 text-xs text-muted/60">Searching...</p>
                )}
              </div>

              {results.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {results.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => selectManufacturer(m)}
                      className={`glass rounded-xl p-4 text-left transition-all hover:-translate-y-0.5 ${
                        form.manufacturerId === m.id
                          ? "ring-2 ring-white/30"
                          : "hover:ring-1 hover:ring-white/[0.12]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CompanyLogo
                          logoUrl={m.logo_url}
                          name={m.name}
                          height={36}
                        />
                        <div>
                          <p className="font-semibold text-foreground">
                            {m.name}
                          </p>
                          <p className="text-xs text-muted/60">
                            {m.country || ""}
                            {m.website && (
                              <span>
                                {m.country ? " -- " : ""}
                                {m.website.replace(/^https?:\/\//, "")}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {query.length >= 2 && results.length === 0 && !searching && (
                <div className="glass rounded-xl p-6 text-center">
                  <p className="text-sm text-muted">
                    No manufacturers found matching &quot;{query}&quot;.
                  </p>
                  <p className="mt-1 text-xs text-muted/60">
                    If your company is not listed, please{" "}
                    <Link
                      href="/contact"
                      className="text-white hover:underline"
                    >
                      contact us
                    </Link>{" "}
                    to add it.
                  </p>
                </div>
              )}

              {form.manufacturerId && (
                <div className="glass rounded-xl border border-white/20 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-white">
                    Selected
                  </p>
                  <p className="mt-1 font-semibold text-foreground">
                    {form.manufacturerName}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ------ Step 2: Verify Ownership ------ */}
          {step === 1 && (
            <div className="space-y-6">
              <p className="text-sm text-muted">
                Provide your work credentials so we can verify you represent{" "}
                <span className="font-semibold text-foreground">
                  {form.manufacturerName}
                </span>
                .
              </p>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Work Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={form.workEmail}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, workEmail: e.target.value }))
                  }
                  placeholder={
                    form.manufacturerWebsite
                      ? `you@${form.manufacturerWebsite.replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*/, "")}`
                      : "you@company.com"
                  }
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/40 focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
                />
                {form.manufacturerWebsite && (
                  <p className="mt-1.5 text-xs text-muted/60">
                    Must match your company domain for faster verification.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Job Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.jobTitle}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, jobTitle: e.target.value }))
                  }
                  placeholder="e.g. VP of Marketing, Product Manager"
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/40 focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={form.linkedInUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, linkedInUrl: e.target.value }))
                  }
                  placeholder="https://linkedin.com/in/your-profile"
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/40 focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
                />
                <p className="mt-1.5 text-xs text-muted/60">
                  Optional, but helps us verify your identity faster.
                </p>
              </div>
            </div>
          )}

          {/* ------ Step 3: Enhance Profile ------ */}
          {step === 2 && (
            <div className="space-y-6">
              <p className="text-sm text-muted">
                Help visitors learn more about{" "}
                <span className="font-semibold text-foreground">
                  {form.manufacturerName}
                </span>
                . All fields are optional and can be updated later.
              </p>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Company Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={4}
                  placeholder="Tell visitors about your company, mission, and products..."
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/40 focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        contactEmail: e.target.value,
                      }))
                    }
                    placeholder="contact@company.com"
                    className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/40 focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={form.contactPhone}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        contactPhone: e.target.value,
                      }))
                    }
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/40 focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={form.logoUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, logoUrl: e.target.value }))
                  }
                  placeholder="https://company.com/logo.png"
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/40 focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Product Catalog URL
                </label>
                <input
                  type="url"
                  value={form.catalogUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, catalogUrl: e.target.value }))
                  }
                  placeholder="https://company.com/products"
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/40 focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
                />
              </div>
            </div>
          )}

          {/* ------ Step 4: Partnership Inquiry ------ */}
          {step === 3 && (
            <div className="space-y-6">
              <p className="text-sm text-muted">
                Explore ways to increase your visibility on Robotomated.
                These are optional and non-binding.
              </p>

              {/* Featured listing toggle */}
              <div className="glass rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground">
                      Featured Listing
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Appear at the top of category and search results with a
                      highlighted profile card.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.featuredListing}
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        featuredListing: !f.featuredListing,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                      form.featuredListing ? "bg-white" : "bg-white/[0.08]"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                        form.featuredListing
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Sponsored robots toggle */}
              <div className="glass rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground">
                      Sponsored Robot Placements
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Promote specific robots in relevant comparison pages and
                      recommendation results. Clearly labeled as sponsored.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.sponsoredRobots}
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        sponsoredRobots: !f.sponsoredRobots,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                      form.sponsoredRobots ? "bg-white" : "bg-white/[0.08]"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                        form.sponsoredRobots
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Preferred contact method */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Best Way to Contact You
                </label>
                <select
                  value={form.preferredContact}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      preferredContact: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-foreground focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="video">Video Call</option>
                </select>
              </div>
            </div>
          )}

          {/* ------ Navigation + Error ------ */}
          {error && (
            <div className="mt-6 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            {step > 0 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="rounded-lg border border-white/[0.08] px-5 py-2.5 text-sm font-medium text-muted hover:text-foreground"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canAdvance()}
                className="rounded-lg bg-white px-6 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-lg bg-gradient-to-r from-white/10 to-white/5 px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Claim"}
              </button>
            )}
          </div>

          {/* Progress hint */}
          <p className="mt-4 text-center text-xs text-muted/40">
            Step {step + 1} of {STEPS.length}
          </p>
        </div>
      </section>
    </div>
  );
}
