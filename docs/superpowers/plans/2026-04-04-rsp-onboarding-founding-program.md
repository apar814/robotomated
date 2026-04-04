# RSP Onboarding & Founding Program — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing 5-step RSP registration with a premium 7-step onboarding wizard and add a Founding RSP program (100 spots) to acquire initial supply.

**Architecture:** Client-side multi-step wizard managing all form state in a single `WizardData` object, submitting via the existing `POST /api/robowork/providers` endpoint (extended to accept new fields). Founding RSP program is a separate page + API route with admin review queue.

**Tech Stack:** Next.js 15 App Router, TypeScript, Supabase (PostgreSQL + Storage), Resend (email), Tailwind CSS with `--theme-*` CSS variables.

**Spec:** `docs/superpowers/specs/2026-04-04-rsp-onboarding-founding-program.md`

---

## Task 1: Database Migration

**Files:**
- Create: `supabase/migrations/028_rsp_onboarding.sql`

- [ ] **Step 1: Write the migration**

```sql
-- 028_rsp_onboarding.sql
-- Extend RSP profiles for 7-step onboarding + founding RSP program

-- New columns on robot_service_providers
ALTER TABLE robot_service_providers
  ADD COLUMN IF NOT EXISTS business_type text,
  ADD COLUMN IF NOT EXISTS years_in_robotics integer,
  ADD COLUMN IF NOT EXISTS is_founding_rsp boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS founding_rsp_number integer UNIQUE,
  ADD COLUMN IF NOT EXISTS founding_perks_claimed jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS verification_tier integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS specialization_levels jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS stripe_connect_id text,
  ADD COLUMN IF NOT EXISTS stripe_onboarding_complete boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS phone_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false;

-- Founding RSP applications
CREATE TABLE IF NOT EXISTS founding_rsp_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  company_name text NOT NULL,
  email text NOT NULL,
  city text NOT NULL,
  robot_types text[] DEFAULT '{}',
  fleet_size integer,
  why_founding text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by text
);

-- RLS for founding_rsp_applications
ALTER TABLE founding_rsp_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can apply" ON founding_rsp_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own applications" ON founding_rsp_applications
  FOR SELECT USING (
    auth.uid() = user_id
    OR auth.jwt() ->> 'email' = email
  );

-- Index for founding RSP counter query
CREATE INDEX IF NOT EXISTS idx_founding_rsp_status ON founding_rsp_applications(status);
CREATE INDEX IF NOT EXISTS idx_rsp_founding ON robot_service_providers(is_founding_rsp) WHERE is_founding_rsp = true;
```

- [ ] **Step 2: Apply the migration**

Run: `npx supabase db push` or apply manually via Supabase dashboard.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/028_rsp_onboarding.sql
git commit -m "feat: migration 028 — RSP onboarding columns + founding RSP table"
```

---

## Task 2: Wizard Shell & Progress Bar

**Files:**
- Create: `components/robowork/register-wizard.tsx`
- Create: `components/robowork/wizard-progress.tsx`

- [ ] **Step 1: Create the WizardProgress component**

```tsx
// components/robowork/wizard-progress.tsx
"use client";

const STEP_LABELS = [
  "Business Basics",
  "Service Areas",
  "Robot Fleet",
  "Specializations",
  "Verification",
  "Payment",
  "Preview",
];

interface WizardProgressProps {
  currentStep: number; // 1-7
  completedSteps: number[];
}

export function WizardProgress({ currentStep, completedSteps }: WizardProgressProps) {
  return (
    <div className="w-full px-4 py-6">
      {/* Step label */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color: "var(--theme-text-primary)" }}>
          Step {currentStep} of 7
        </p>
        <p className="text-sm" style={{ color: "var(--theme-text-muted)" }}>
          {STEP_LABELS[currentStep - 1]}
        </p>
      </div>
      {/* Segmented progress bar */}
      <div className="flex gap-1.5">
        {STEP_LABELS.map((_, i) => {
          const stepNum = i + 1;
          const isComplete = completedSteps.includes(stepNum);
          const isCurrent = stepNum === currentStep;
          return (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full transition-colors duration-300"
              style={{
                background: isComplete || isCurrent
                  ? "#0EA5E9"
                  : "var(--theme-border)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the WizardData types file**

```tsx
// components/robowork/wizard-types.ts

export interface RobotEntry {
  id: string;
  // From DB search (if matched)
  robotId: string | null;
  // Manual or auto-filled
  name: string;
  manufacturer: string;
  category: string;
  description: string;
  dailyRate: string;
  weeklyRate: string;
  monthlyRate: string;
  minimumDays: string;
  fulfillmentTypes: string[];
  operatorIncluded: boolean;
  remoteCapable: boolean;
  available: boolean;
  availableFrom: string;
  images: string[]; // URLs after upload
}

export interface WizardData {
  // Step 1 — Business Basics
  companyName: string;
  businessType: string;
  yearsInRobotics: number;
  website: string;
  linkedin: string;
  bio: string;
  profileImage: File | null;
  profileImageUrl: string;

  // Step 2 — Service Areas
  city: string;
  state: string;
  country: string;
  serviceRadius: number;
  additionalCities: { city: string; state: string }[];

  // Step 3 — Robot Fleet
  robots: RobotEntry[];

  // Step 4 — Specializations
  specializations: string[];
  taskSpecializations: string[];
  specializationLevels: Record<string, "beginner" | "experienced" | "expert">;

  // Step 5 — Verification
  emailVerified: boolean;
  phoneNumber: string;
  phoneVerified: boolean;
  identityMethod: "government_id" | "linkedin" | null;
  identityDocUrl: string;
  insuranceDocUrl: string;
  backgroundCheckConsent: boolean;

  // Step 6 — Payment
  paymentSetupStarted: boolean;
}

export function createEmptyWizardData(): WizardData {
  return {
    companyName: "",
    businessType: "",
    yearsInRobotics: 3,
    website: "",
    linkedin: "",
    bio: "",
    profileImage: null,
    profileImageUrl: "",
    city: "",
    state: "",
    country: "US",
    serviceRadius: 50,
    additionalCities: [],
    robots: [],
    specializations: [],
    taskSpecializations: [],
    specializationLevels: {},
    emailVerified: false,
    phoneNumber: "",
    phoneVerified: false,
    identityMethod: null,
    identityDocUrl: "",
    insuranceDocUrl: "",
    backgroundCheckConsent: false,
    paymentSetupStarted: false,
  };
}

export function createEmptyRobot(): RobotEntry {
  return {
    id: crypto.randomUUID(),
    robotId: null,
    name: "",
    manufacturer: "",
    category: "",
    description: "",
    dailyRate: "",
    weeklyRate: "",
    monthlyRate: "",
    minimumDays: "1",
    fulfillmentTypes: [],
    operatorIncluded: false,
    remoteCapable: false,
    available: true,
    availableFrom: "",
    images: [],
  };
}
```

- [ ] **Step 3: Create the RegisterWizard shell**

```tsx
// components/robowork/register-wizard.tsx
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { WizardProgress } from "./wizard-progress";
import { WizardCelebration } from "./wizard-celebration";
import { StepBusinessBasics } from "./wizard-steps/step-business-basics";
import { StepServiceAreas } from "./wizard-steps/step-service-areas";
import { StepRobotFleet } from "./wizard-steps/step-robot-fleet";
import { StepSpecializations } from "./wizard-steps/step-specializations";
import { StepVerification } from "./wizard-steps/step-verification";
import { StepPayment } from "./wizard-steps/step-payment";
import { StepPreview } from "./wizard-steps/step-preview";
import { createEmptyWizardData, type WizardData } from "./wizard-types";

const ENCOURAGEMENTS = [
  "Great start! You're 15% of the way to your first job on Robotomated.",
  "Nice — that's a lot of potential jobs in your area.",
  "Your fleet is looking strong. Businesses love detailed listings.",
  "Almost there — verification is next, then you're live.",
  "Trust built. You're standing out from other RSPs already.",
  "Payment is ready for when we go live. One more step!",
];

export function RegisterWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(createEmptyWizardData);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [published, setPublished] = useState(false);
  const [encouragement, setEncouragement] = useState<string | null>(null);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const updateData = useCallback((partial: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  function goNext() {
    setCompletedSteps((prev) =>
      prev.includes(step) ? prev : [...prev, step]
    );
    // Show encouragement briefly
    if (step <= 6) {
      setEncouragement(ENCOURAGEMENTS[step - 1]);
      setTimeout(() => setEncouragement(null), 3000);
    }
    setDirection("forward");
    setStep((s) => Math.min(s + 1, 7));
  }

  function goBack() {
    setDirection("back");
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handlePublish() {
    setSubmitting(true);
    setError(null);

    try {
      // Build the API payload matching existing contract + new fields
      const payload = {
        company_name: data.companyName,
        description: data.bio,
        bio: data.bio,
        city: data.city,
        state: data.state,
        country: data.country,
        service_radius: data.serviceRadius,
        operating_regions: data.additionalCities.map(
          (c) => `${c.city}, ${c.state}`
        ),
        specializations: data.specializations,
        fulfillment_types: [
          ...new Set(data.robots.flatMap((r) => r.fulfillmentTypes)),
        ],
        website: data.website || null,
        linkedin: data.linkedin || null,
        profile_image: data.profileImageUrl || null,
        // New fields
        business_type: data.businessType || null,
        years_in_robotics: data.yearsInRobotics,
        phone: data.phoneNumber || null,
        phone_verified: data.phoneVerified,
        email_verified: data.emailVerified,
        verification_tier: data.identityDocUrl || data.identityMethod === "linkedin" ? 1 : 0,
        specialization_levels: data.specializationLevels,
        // Robots
        robots: data.robots.map((r) => ({
          robot_id: r.robotId || null,
          custom_name: r.name,
          custom_manufacturer: r.manufacturer,
          custom_category: r.category,
          description: r.description,
          daily_rate: r.dailyRate ? parseFloat(r.dailyRate) : null,
          weekly_rate: r.weeklyRate ? parseFloat(r.weeklyRate) : null,
          monthly_rate: r.monthlyRate ? parseFloat(r.monthlyRate) : null,
          minimum_days: parseInt(r.minimumDays) || 1,
          operator_included: r.operatorIncluded,
          remote_capable: r.remoteCapable,
          fulfillment_types: r.fulfillmentTypes,
          images: r.images,
        })),
      };

      const res = await fetch("/api/robowork/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Registration failed");
      }

      setPublished(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (published) {
    return <WizardCelebration companyName={data.companyName} />;
  }

  const stepComponents: Record<number, React.ReactNode> = {
    1: <StepBusinessBasics data={data} updateData={updateData} />,
    2: <StepServiceAreas data={data} updateData={updateData} />,
    3: <StepRobotFleet data={data} updateData={updateData} />,
    4: <StepSpecializations data={data} updateData={updateData} />,
    5: <StepVerification data={data} updateData={updateData} />,
    6: <StepPayment data={data} updateData={updateData} />,
    7: <StepPreview data={data} />,
  };

  // Step validation — determines if Next is enabled
  const canProceed: Record<number, boolean> = {
    1: !!data.companyName && !!data.businessType,
    2: !!data.city && !!data.state,
    3: data.robots.length > 0 && data.robots.every((r) => !!r.name),
    4: data.specializations.length > 0 && data.taskSpecializations.length > 0,
    5: data.emailVerified && data.phoneVerified,
    6: true, // skippable
    7: true, // publish button handles this
  };

  return (
    <div id="wizard" className="mx-auto max-w-3xl scroll-mt-8">
      <WizardProgress currentStep={step} completedSteps={completedSteps} />

      {/* Encouragement toast */}
      {encouragement && (
        <div
          className="mx-4 mb-4 rounded-lg px-4 py-3 text-center text-sm font-medium"
          style={{
            background: "rgba(14,165,233,0.1)",
            border: "1px solid rgba(14,165,233,0.2)",
            color: "#0EA5E9",
          }}
        >
          {encouragement}
        </div>
      )}

      {/* Step content with slide animation */}
      <div
        className="px-4 transition-all duration-200 ease-out"
        style={{
          opacity: 1,
          transform: "translateX(0)",
        }}
        key={step}
      >
        {stepComponents[step]}
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mt-4 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-center text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between px-4 py-6">
        <button
          onClick={goBack}
          disabled={step === 1}
          className="rounded-lg border px-6 py-2.5 text-sm font-medium transition-colors disabled:opacity-30"
          style={{
            borderColor: "var(--theme-border)",
            color: "var(--theme-text-secondary)",
          }}
        >
          Back
        </button>

        {step < 7 ? (
          <button
            onClick={goNext}
            disabled={!canProceed[step]}
            className="rounded-lg px-6 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ background: "#0EA5E9" }}
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handlePublish}
            disabled={submitting}
            className="rounded-lg px-8 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "#0EA5E9" }}
          >
            {submitting ? "Publishing..." : "Publish Your Profile"}
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify files compile**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: May have errors for missing step components (created in later tasks). That's OK.

- [ ] **Step 5: Commit**

```bash
git add components/robowork/register-wizard.tsx components/robowork/wizard-progress.tsx components/robowork/wizard-types.ts
git commit -m "feat: RSP wizard shell, progress bar, and WizardData types"
```

---

## Task 3: Wizard Celebration Screen

**Files:**
- Create: `components/robowork/wizard-celebration.tsx`

- [ ] **Step 1: Create the celebration component with CSS confetti**

```tsx
// components/robowork/wizard-celebration.tsx
"use client";

import Link from "next/link";

interface Props {
  companyName: string;
}

export function WizardCelebration({ companyName }: Props) {
  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden px-4 py-16 text-center">
      {/* CSS confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-2 w-2 rounded-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              background: ["#0EA5E9", "#F59E0B", "#10B981", "#7B2FFF", "#FF006E"][i % 5],
              animation: `confetti-fall ${2 + Math.random() * 2}s ease-in ${Math.random() * 0.5}s forwards`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(800px) rotate(720deg); opacity: 0; }
        }
      `}</style>

      {/* Content */}
      <div className="relative z-10">
        <div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-4xl"
          style={{ background: "rgba(14,165,233,0.15)" }}
        >
          🤖
        </div>
        <h1
          className="mt-6 font-display text-3xl font-bold sm:text-4xl"
          style={{ color: "var(--theme-text-primary)" }}
        >
          Welcome to Robotomated, {companyName}!
        </h1>
        <p className="mt-3 text-base" style={{ color: "var(--theme-text-secondary)" }}>
          Your profile is live. Here&apos;s what happens next.
        </p>

        {/* What happens next */}
        <div className="mx-auto mt-8 max-w-md space-y-3 text-left">
          {[
            "Your profile is live and searchable immediately",
            "You'll be notified when matching jobs are posted",
            "Verification documents will be reviewed within 24-48 hours",
            "You can browse and bid on open jobs right now",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <span className="mt-0.5 text-[#10B981]">✓</span>
              <p className="text-sm" style={{ color: "var(--theme-text-secondary)" }}>{item}</p>
            </div>
          ))}
        </div>

        {/* Action cards */}
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <Link
            href="/robowork/jobs"
            className="rounded-xl border p-5 text-center transition-colors hover:border-[#0EA5E9]/30"
            style={{ borderColor: "var(--theme-border)", background: "var(--theme-card)" }}
          >
            <span className="text-2xl">🔍</span>
            <p className="mt-2 text-sm font-semibold" style={{ color: "var(--theme-text-primary)" }}>Browse Open Jobs</p>
            <p className="mt-1 text-xs" style={{ color: "var(--theme-text-muted)" }}>Find work that matches your fleet</p>
          </Link>
          <Link
            href="/account"
            className="rounded-xl border p-5 text-center transition-colors hover:border-[#0EA5E9]/30"
            style={{ borderColor: "var(--theme-border)", background: "var(--theme-card)" }}
          >
            <span className="text-2xl">✅</span>
            <p className="mt-2 text-sm font-semibold" style={{ color: "var(--theme-text-primary)" }}>Complete Verification</p>
            <p className="mt-1 text-xs" style={{ color: "var(--theme-text-muted)" }}>Unlock premium jobs</p>
          </Link>
          <Link
            href="/certify"
            className="rounded-xl border p-5 text-center transition-colors hover:border-[#0EA5E9]/30"
            style={{ borderColor: "var(--theme-border)", background: "var(--theme-card)" }}
          >
            <span className="text-2xl">🏆</span>
            <p className="mt-2 text-sm font-semibold" style={{ color: "var(--theme-text-primary)" }}>Get RCO Certified</p>
            <p className="mt-1 text-xs" style={{ color: "var(--theme-text-muted)" }}>Top placement in search results</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/robowork/wizard-celebration.tsx
git commit -m "feat: RSP wizard celebration screen with CSS confetti"
```

---

## Task 4: Step 0 Landing Page

**Files:**
- Rewrite: `app/(platform)/robowork/providers/register/page.tsx`

- [ ] **Step 1: Rewrite the register page with Step 0 landing + wizard**

```tsx
// app/(platform)/robowork/providers/register/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { RegisterWizard } from "@/components/robowork/register-wizard";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Become a Robot Service Provider — RoboWork | Robotomated",
  description:
    "Build your robotics business on the world's first RaaS marketplace. List your fleet, set your rates, get certified, and connect with businesses that need automation.",
  openGraph: {
    title: "Become a RoboWork Provider | Robotomated",
    description:
      "Join 500+ Robot Service Providers. List your fleet, get verified, start winning jobs.",
    url: "https://robotomated.com/robowork/providers/register",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://robotomated.com/robowork/providers/register" },
};

const VALUE_PROPS = [
  {
    icon: "🎯",
    title: "GET FOUND",
    description: "975 businesses actively searching for robot operators. Be where they look.",
  },
  {
    icon: "💰",
    title: "GET PAID",
    description: "Integrated payments. Escrow protection. Automatic payouts. No invoicing headaches.",
  },
  {
    icon: "🏆",
    title: "GET CERTIFIED",
    description: "Earn your RCO certification. Win more jobs. Charge higher rates.",
  },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Build your profile", subtitle: "15 minutes", description: "Tell us about your business, list your robots, set your rates." },
  { step: "2", title: "Get verified", subtitle: "24-48 hours", description: "Upload insurance, verify identity. Verified RSPs win 3x more jobs." },
  { step: "3", title: "Start winning jobs", subtitle: "Immediately", description: "Browse open jobs, submit bids, and grow your robotics business." },
];

const BETA_MARKETS = ["Los Angeles", "Chicago", "Dallas", "Atlanta", "New Jersey"];

export default function RegisterProviderPage() {
  return (
    <div>
      {/* Hero */}
      <section className="px-4 py-16 sm:py-20" style={{ background: "var(--theme-bg)" }}>
        <div className="mx-auto max-w-4xl">
          <Breadcrumbs items={[
            { name: "Home", href: "/" },
            { name: "RoboWork", href: "/robowork" },
            { name: "Register", href: "/robowork/providers/register" },
          ]} />
          <h1
            className="mt-8 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
            style={{ color: "var(--theme-text-primary)" }}
          >
            Build your robotics business on the world&apos;s first RaaS marketplace.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed" style={{ color: "var(--theme-text-secondary)" }}>
            List your robots. Set your rates. Get matched with businesses that need automation.
            Registration is free and takes about 15 minutes.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#wizard"
              className="inline-flex items-center justify-center rounded-lg px-8 py-3.5 text-base font-bold text-black transition-opacity hover:opacity-90"
              style={{ background: "#0EA5E9" }}
            >
              Start Your Free Profile →
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-lg border px-8 py-3.5 text-base font-medium transition-colors"
              style={{ borderColor: "var(--theme-border)", color: "var(--theme-text-secondary)" }}
            >
              See how it works ↓
            </a>
          </div>
          {/* Social proof */}
          <p className="mt-6 text-sm" style={{ color: "var(--theme-text-muted)" }}>
            Joining 500+ Robot Service Providers across 5 markets
          </p>
        </div>
      </section>

      {/* Value props */}
      <section className="border-y px-4 py-12" style={{ borderColor: "var(--theme-border)" }}>
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
          {VALUE_PROPS.map((vp) => (
            <div
              key={vp.title}
              className="rounded-xl border p-6"
              style={{ borderColor: "var(--theme-border)", background: "var(--theme-card)" }}
            >
              <span className="text-2xl">{vp.icon}</span>
              <h3 className="mt-3 text-sm font-bold tracking-wider" style={{ color: "#0EA5E9" }}>
                {vp.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--theme-text-secondary)" }}>
                {vp.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-display text-2xl font-bold" style={{ color: "var(--theme-text-primary)" }}>
            How it works
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="text-center">
                <div
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full font-mono text-lg font-bold"
                  style={{ background: "rgba(14,165,233,0.1)", color: "#0EA5E9" }}
                >
                  {item.step}
                </div>
                <h3 className="mt-4 font-semibold" style={{ color: "var(--theme-text-primary)" }}>
                  {item.title}
                </h3>
                <p className="text-xs font-medium" style={{ color: "#0EA5E9" }}>{item.subtitle}</p>
                <p className="mt-2 text-sm" style={{ color: "var(--theme-text-muted)" }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beta markets */}
      <section className="border-t px-4 py-8" style={{ borderColor: "var(--theme-border)" }}>
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--theme-text-muted)" }}>
            Priority launch markets
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {BETA_MARKETS.map((m) => (
              <span
                key={m}
                className="rounded-full border px-3 py-1 text-xs font-medium"
                style={{ borderColor: "rgba(14,165,233,0.2)", color: "#0EA5E9", background: "rgba(14,165,233,0.05)" }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Founding RSP callout */}
      <section className="px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/robowork/founding-rsp"
            className="block rounded-xl border p-6 text-center transition-colors hover:border-[#F59E0B]/30"
            style={{ borderColor: "var(--theme-border)", background: "var(--theme-card)" }}
          >
            <span className="text-sm font-bold" style={{ color: "#F59E0B" }}>Founding RSP Program</span>
            <p className="mt-1 text-sm" style={{ color: "var(--theme-text-secondary)" }}>
              Apply to be one of 100 founding RSPs — free certification, reduced fees, priority placement.
            </p>
          </Link>
        </div>
      </section>

      {/* Wizard */}
      <section className="border-t px-4 py-12" style={{ borderColor: "var(--theme-border)" }}>
        <RegisterWizard />
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Verify the page renders**

Run: `npm run build 2>&1 | grep -E "error|Error" | head -10`
Expected: May have errors for missing step components. Stub them if needed to unblock.

- [ ] **Step 3: Commit**

```bash
git add app/(platform)/robowork/providers/register/page.tsx
git commit -m "feat: RSP Step 0 landing page with value props and how-it-works"
```

---

## Task 5: Steps 1-4 (Data Collection)

**Files:**
- Create: `components/robowork/wizard-steps/step-business-basics.tsx`
- Create: `components/robowork/wizard-steps/step-service-areas.tsx`
- Create: `components/robowork/wizard-steps/step-robot-fleet.tsx`
- Create: `components/robowork/wizard-steps/step-specializations.tsx`

Each step component receives `data: WizardData` and `updateData: (partial: Partial<WizardData>) => void` as props.

- [ ] **Step 1: Create Step 1 — Business Basics**

Create `components/robowork/wizard-steps/step-business-basics.tsx` with:
- Company name text input (required)
- Business type: 6 selectable cards with icons (`solo`, `small_fleet`, `mid_fleet`, `large_fleet`, `rental_company`, `integrator`). Each card shows icon + label + subtitle (e.g., "Solo Operator — Just me and my robot"). Active card gets blue border.
- Years in robotics: `<input type="range" min={0} max={20}>` with displayed value
- Website + LinkedIn text inputs (optional)
- Bio: `<textarea>` with 500 char max, character counter
- Photo upload: `<input type="file" accept="image/*">` with preview. On select, upload to Supabase Storage `rsp-profiles/{userId}/{filename}`, set `profileImageUrl` in data.

All inputs use theme CSS variables. Labels use `text-xs font-semibold uppercase tracking-wider` pattern from existing codebase.

- [ ] **Step 2: Create Step 2 — Service Areas**

Create `components/robowork/wizard-steps/step-service-areas.tsx` with:
- City text input + state dropdown (US states array)
- Service radius: `<input type="range" min={25} max={500} step={25}>` with label showing "{radius} miles"
- Beta market detection: `const BETA_CITIES = ["Los Angeles", "Chicago", "Dallas", "Atlanta", "Newark", "Jersey City"]`. On city change, check if value is in list. Show green "Priority launch market!" badge or amber "Priority waitlist" text.
- Additional cities: toggle button "Operate in multiple cities?" reveals up to 5 city+state pairs with add/remove buttons.

- [ ] **Step 3: Create Step 3 — Robot Fleet**

Create `components/robowork/wizard-steps/step-robot-fleet.tsx` with:
- "Add a robot" button that pushes `createEmptyRobot()` into `data.robots`
- Per robot: collapsible card with expand/collapse toggle
- Robot name search: debounced input (300ms) hitting `GET /api/robots?search={query}&limit=5`. Render dropdown of matches. On select, auto-fill name, manufacturer, category from the result. If no match, show manual entry fields.
- Rate inputs: daily ($), weekly ($), monthly ($), minimum booking (days)
- Fulfillment type checkboxes: "With operator", "Drop-off autonomous", "Remote operated"
- Availability: toggle + date picker (native `<input type="date">`)
- Remove robot button (trash icon)
- Fleet summary bar: count + sum of daily rates as revenue potential range

- [ ] **Step 4: Create Step 4 — Specializations**

Create `components/robowork/wizard-steps/step-specializations.tsx` with:
- Industry specializations: 10 toggleable cards in a grid. Each card has an icon (use emoji) and label. Selected cards have blue border + filled background.
- Task specializations: 10 toggleable cards, same pattern.
- For each selected item (from both lists), render an inline 3-option toggle: Beginner | Experienced | Expert. Default: "experienced". Store in `specializationLevels` keyed by the specialization slug.
- Note text: "Specialized RSPs earn 40% more per job."

- [ ] **Step 5: Verify build compiles**

Run: `npm run build 2>&1 | grep -E "error|Error" | head -10`
Expected: Clean or only errors from Step 5-7 components (not yet created).

- [ ] **Step 6: Commit**

```bash
git add components/robowork/wizard-steps/
git commit -m "feat: RSP wizard steps 1-4 — basics, areas, fleet, specializations"
```

---

## Task 6: Steps 5-7 (Verification, Payment, Preview)

**Files:**
- Create: `components/robowork/wizard-steps/step-verification.tsx`
- Create: `components/robowork/wizard-steps/step-payment.tsx`
- Create: `components/robowork/wizard-steps/step-preview.tsx`

- [ ] **Step 1: Create Step 5 — Verification**

Create `components/robowork/wizard-steps/step-verification.tsx` with:

**Required section:**
- Email verification: "Send code" button generates a random 6-digit code, calls `POST /api/robowork/providers/verify-email` (new endpoint that sends code via Resend). Input field for code. On match, sets `emailVerified = true`. For Phase 1, the API can generate a code, send it, and store it in a server-side map or session.
- Phone: input for phone number + "Send code" button. Phase 1: accepts any 6-digit input. Sets `phoneVerified = true`.

**Tier ladder section:**
- 4 cards stacked vertically, each showing: tier number, name, icon (shield variants), requirements, what it unlocks, status (completed/in-progress/locked).
- Tier 1: file input for ID OR text input for LinkedIn URL. On upload, store URL in `identityDocUrl`.
- Tier 2: file input for insurance PDF. Store URL in `insuranceDocUrl`. Show "Under review (24-48 hours)".
- Tier 3: consent checkbox. Show "$29.99 — free for Founding RSPs". Button disabled with "Coming soon".
- Tier 4: non-interactive. Link to `/certify`. Show discount code `RSP_DISCOUNT_50`.
- "Skip for now" link at bottom.

- [ ] **Step 2: Create email verification API endpoint**

Create `app/api/robowork/providers/verify-email/route.ts`:
- POST with `{ email }` → generates 6-digit code, sends via Resend, returns `{ sent: true }`. Store code in-memory (simple Map with 10-minute expiry).
- POST with `{ email, code }` → validates code, returns `{ verified: true/false }`.

- [ ] **Step 3: Create Step 6 — Payment**

Create `components/robowork/wizard-steps/step-payment.tsx` with:
- Headline "Set up payments in 2 minutes"
- Revenue flow visual: 3 boxes connected by arrows (Business → Robotomated Escrow → You). Show "88% to you, 12% platform fee" (or "92% / 8%" if founding RSP — check from context).
- Requirements list: bank account, SSN or EIN, business address
- "Connect your bank account" button → sets `paymentSetupStarted = true`, shows success message.
- Security + tax notes.
- "Set up later" skip link.

- [ ] **Step 4: Create Step 7 — Preview**

Create `components/robowork/wizard-steps/step-preview.tsx` with:
- Headline "Here's how businesses will find you"
- Preview card showing: company name + profile image, verification badges (filled/empty based on data), robot fleet cards (each showing name + rates), specialization tags, service area (city + radius), "RSP Score: Pending".
- This is a read-only view. Uses theme card styles.

- [ ] **Step 5: Verify full build compiles**

Run: `npm run build 2>&1 | grep -E "error|Error" | head -10`
Expected: Clean build.

- [ ] **Step 6: Commit**

```bash
git add components/robowork/wizard-steps/ app/api/robowork/providers/verify-email/
git commit -m "feat: RSP wizard steps 5-7 — verification, payment, preview"
```

---

## Task 7: Extend Provider API

**Files:**
- Modify: `app/api/robowork/providers/route.ts`

- [ ] **Step 1: Extend the POST handler to accept new fields**

In the existing `POST` handler, extend the insert object to include:

```typescript
// After existing fields in the insert call, add:
business_type: (body.business_type as string) || null,
years_in_robotics: (body.years_in_robotics as number) || null,
phone: (body.phone as string) || null,
phone_verified: (body.phone_verified as boolean) || false,
email_verified: (body.email_verified as boolean) || false,
verification_tier: (body.verification_tier as number) || 0,
specialization_levels: (body.specialization_levels as Record<string, string>) || {},
onboarding_completed_at: new Date().toISOString(),
```

Also extend the robot insert to include new fields:
```typescript
fulfillment_types: (r.fulfillment_types as string[]) || [],
images: (r.images as string[]) || [],
```

- [ ] **Step 2: Verify build compiles**

Run: `npm run build 2>&1 | grep -E "error|Error" | head -10`

- [ ] **Step 3: Commit**

```bash
git add app/api/robowork/providers/route.ts
git commit -m "feat: extend provider POST API for onboarding wizard fields"
```

---

## Task 8: Founding RSP — Landing Page & Form

**Files:**
- Create: `app/(platform)/robowork/founding-rsp/page.tsx`
- Create: `components/robowork/founding-rsp-form.tsx`

- [ ] **Step 1: Create the Founding RSP form component**

Create `components/robowork/founding-rsp-form.tsx`:
- Fields: name (text), email (text), company (text), city (text), robot types (multi-select from categories: warehouse, medical, manufacturing, agricultural, security, hospitality, construction, eldercare, consumer, drone), fleet size (number), "Why do you want to be a founding RSP?" (textarea, 200 char min).
- Submit to `POST /api/robowork/founding-rsp`.
- Loading state, success state ("Application received! We review within 48 hours."), error state.
- Uses theme CSS variables throughout.

- [ ] **Step 2: Create the Founding RSP landing page**

Create `app/(platform)/robowork/founding-rsp/page.tsx` (SSR):
- Metadata: title "Founding Robot Service Provider — Robotomated", SEO description
- Query DB for approved application count: `supabase.from("founding_rsp_applications").select("id", { count: "exact", head: true }).eq("status", "approved")`. Calculate spots remaining: `100 - (count || 0)`.
- Hero: "Founding Robot Service Provider" headline
- 7 perk cards (numbered) with value callouts
- Live counter: "X of 100 spots remaining"
- Requirements section
- `FoundingRspForm` component at bottom

- [ ] **Step 3: Commit**

```bash
git add app/(platform)/robowork/founding-rsp/ components/robowork/founding-rsp-form.tsx
git commit -m "feat: Founding RSP landing page and application form"
```

---

## Task 9: Founding RSP — API & Admin

**Files:**
- Create: `app/api/robowork/founding-rsp/route.ts`
- Create: `app/(platform)/admin/founding-rsp/page.tsx`

- [ ] **Step 1: Create the Founding RSP API route**

Create `app/api/robowork/founding-rsp/route.ts`:
- `POST`: validate required fields (company_name, email, city, why_founding with min 200 chars), insert into `founding_rsp_applications`, send confirmation email to applicant + notification to admin via `sendFoundingRspApplicationReceived()`, return `{ success: true }`.
- `GET`: admin-only (check auth), return all applications ordered by created_at desc.

- [ ] **Step 2: Create the admin review page**

Create `app/(platform)/admin/founding-rsp/page.tsx`:
- SSR page fetching all applications from DB
- Table with columns: company, email, city, fleet size, robot types, why (truncated), status, date
- Each pending row has Approve / Reject buttons
- Approve calls `POST /api/robowork/founding-rsp/review` with `{ id, action: "approve" }` → sets status, assigns next founding_rsp_number, updates RSP profile if exists, sends approval email.
- Reject calls same endpoint with `{ id, action: "reject" }` → sets status, sends rejection email.
- For the review endpoint: create `app/api/robowork/founding-rsp/review/route.ts`.

- [ ] **Step 3: Commit**

```bash
git add app/api/robowork/founding-rsp/ app/(platform)/admin/founding-rsp/
git commit -m "feat: Founding RSP API endpoints and admin review queue"
```

---

## Task 10: Email Templates

**Files:**
- Modify: `lib/email/robowork-emails.ts`

- [ ] **Step 1: Add three new email functions**

Add to `lib/email/robowork-emails.ts`:

1. `sendFoundingRspApplicationReceived({ email, company_name })` — confirmation to applicant: "Your application to be a Founding RSP has been received. We review within 48 hours."

2. `sendFoundingRspApproved({ email, company_name, founding_number })` — congratulations email listing all 7 perks with links to dashboard.

3. Update existing `sendProviderRegisteredNotification()` to include: count of open jobs in their market (pass as param), 3 immediate action links (browse jobs, verify, certify), mention Founding RSP program if applicable.

All emails follow the existing dark-themed HTML pattern with `#080808` background, `#0EA5E9` accent, Space Grotesk font.

- [ ] **Step 2: Commit**

```bash
git add lib/email/robowork-emails.ts
git commit -m "feat: founding RSP email templates and enhanced welcome email"
```

---

## Task 11: Founding RSP Badge Integration

**Files:**
- Modify: `components/robowork/provider-card.tsx`
- Modify: `app/(platform)/robowork/providers/[slug]/page.tsx`

- [ ] **Step 1: Add founding badge to ProviderCard**

In `components/robowork/provider-card.tsx`:
- Add `is_founding_rsp?: boolean` and `founding_rsp_number?: number | null` to `ProviderCardProps`
- After company name, conditionally render founding badge:

```tsx
{is_founding_rsp && founding_rsp_number && (
  <span
    className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold"
    style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#000" }}
  >
    Founding RSP #{founding_rsp_number}
  </span>
)}
```

- [ ] **Step 2: Add founding badge to provider profile page**

In `app/(platform)/robowork/providers/[slug]/page.tsx`:
- The existing query already fetches `*` from `robot_service_providers`, so `is_founding_rsp` and `founding_rsp_number` are available.
- Add the same badge element in the profile header after the company name.

- [ ] **Step 3: Commit**

```bash
git add components/robowork/provider-card.tsx app/(platform)/robowork/providers/\[slug\]/page.tsx
git commit -m "feat: founding RSP gold badge on provider cards and profiles"
```

---

## Task 12: Full Build Verification & Final Commit

**Files:** None new — verification only.

- [ ] **Step 1: Run full build**

Run: `npm run build 2>&1 | tail -20`
Expected: Clean build with all routes rendering.

- [ ] **Step 2: Verify key routes exist in build output**

Check that these appear in the route list:
- `○ /robowork/providers/register`
- `○ /robowork/founding-rsp`
- `○ /admin/founding-rsp`
- `ƒ /api/robowork/founding-rsp`

- [ ] **Step 3: Push to GitHub**

```bash
git push origin main
```
