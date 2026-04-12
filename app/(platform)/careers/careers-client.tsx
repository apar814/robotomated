"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const ROLES = [
  "Robot Technician",
  "Drone Pilot",
  "Robot Operator",
  "Cobot Programmer",
  "Fleet Manager",
  "Automation Safety Inspector",
] as const;

type InterestType = "worker" | "employer" | "manufacturer";

function useFormSubmit() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(email: string, type: InterestType, roleInterest?: string) {
    setStatus("loading");
    try {
      const res = await fetch("/api/careers/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type, role_interest: roleInterest }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      } else {
        setStatus("success");
        setMessage(data.message);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong");
    }
  }

  return { status, message, submit };
}

function WorkerColumn() {
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const { status, message, submit } = useFormSubmit();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit(email, "worker", selectedRole || undefined);
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-electric-blue/20 bg-electric-blue/10">
        <svg className="h-5 w-5 text-electric-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
      <h2 className="mt-4 text-xl font-bold text-white">I want to get trained</h2>
      <p className="mt-2 text-sm text-white/50">
        Launch or advance your career in robotics with industry-recognized certification programs.
      </p>

      {/* Roles */}
      <div className="mt-6">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">
          Available Tracks
        </p>
        <div className="mt-3 space-y-1.5">
          {ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setSelectedRole(selectedRole === role ? "" : role)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-all ${
                selectedRole === role
                  ? "border border-electric-blue/30 bg-electric-blue/10 text-electric-blue"
                  : "border border-transparent text-white/60 hover:bg-white/[0.03] hover:text-white/80"
              }`}
            >
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                selectedRole === role ? "bg-electric-blue" : "bg-white/20"
              }`} />
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      {status === "success" ? (
        <div className="mt-6 rounded-xl border border-blue-600/20 bg-blue-600/5 p-6">
          <p className="text-sm font-semibold text-blue-400">You&apos;re on the list.</p>
          <p className="mt-1 text-xs text-white/50">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/45 focus:border-electric-blue focus:outline-none"
          />
          <Button type="submit" disabled={status === "loading"} className="mt-3 w-full">
            {status === "loading" ? "Submitting..." : "Join the Waitlist"}
          </Button>
          <p className="mt-2 text-[11px] text-white/50">
            Training programs launching 2026. No commitment required.
          </p>
          {status === "error" && <p className="mt-2 text-xs text-orange">{message}</p>}
        </form>
      )}
    </div>
  );
}

function EmployerColumn() {
  const [email, setEmail] = useState("");
  const { status, message, submit } = useFormSubmit();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit(email, "employer");
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-violet/20 bg-violet/10">
        <svg className="h-5 w-5 text-violet" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          <path d="M12 12h.01" />
        </svg>
      </div>
      <h2 className="mt-4 text-xl font-bold text-white">I need certified talent</h2>
      <p className="mt-2 text-sm leading-relaxed text-white/50">
        Finding qualified robot operators and technicians is one of the biggest
        challenges in automation deployment. We&apos;re building a vetted talent
        network matched to your operational requirements.
      </p>

      {/* Value props */}
      <div className="mt-6 space-y-3">
        {[
          "Pre-screened candidates with verified certifications",
          "Role-specific matching across 9 industry verticals",
          "Ongoing training and upskilling partnerships",
        ].map((item) => (
          <div key={item} className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" />
            <p className="text-sm text-white/50">{item}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      {status === "success" ? (
        <div className="mt-6 rounded-xl border border-blue-600/20 bg-blue-600/5 p-6">
          <p className="text-sm font-semibold text-blue-400">Request received.</p>
          <p className="mt-1 text-xs text-white/50">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hiring@company.com"
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/45 focus:border-violet focus:outline-none"
          />
          <Button type="submit" variant="secondary" disabled={status === "loading"} className="mt-3 w-full">
            {status === "loading" ? "Submitting..." : "Get Early Access"}
          </Button>
          <p className="mt-2 text-[11px] text-white/50">
            Talent network opens Q3 2026. Priority access for early signups.
          </p>
          {status === "error" && <p className="mt-2 text-xs text-orange">{message}</p>}
        </form>
      )}
    </div>
  );
}

function ManufacturerCTA() {
  const [email, setEmail] = useState("");
  const { status, message, submit } = useFormSubmit();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit(email, "manufacturer");
  }

  return (
    <section className="bg-[#0A0F1E] px-4 pb-20 pt-4">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-electric-blue/[0.04] to-violet/[0.04] p-8 sm:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-electric-blue">
              Manufacturer Partners
            </p>
            <h2 className="mt-3 text-2xl font-bold text-white">
              Build Authorized Certification Programs
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Are you a manufacturer? Partner with us to create authorized
              certification programs for your robots. Ensure your customers have
              access to trained, certified operators and technicians.
            </p>

            {status === "success" ? (
              <div className="mx-auto mt-6 max-w-md rounded-xl border border-blue-600/20 bg-blue-600/5 p-6">
                <p className="text-sm font-semibold text-blue-400">Partnership request submitted.</p>
                <p className="mt-1 text-xs text-white/50">{message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-md">
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partnerships@manufacturer.com"
                    className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/45 focus:border-electric-blue focus:outline-none sm:rounded-r-none"
                  />
                  <Button type="submit" disabled={status === "loading"} className="px-6 py-3 sm:rounded-l-none">
                    {status === "loading" ? "Sending..." : "Partner With Us"}
                  </Button>
                </div>
                {status === "error" && <p className="mt-2 text-xs text-orange">{message}</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CareersClient() {
  return (
    <>
      {/* Two-column layout */}
      <section className="bg-[#0A0F1E] px-4 py-16">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
          <WorkerColumn />
          <EmployerColumn />
        </div>
      </section>

      {/* Manufacturer CTA */}
      <ManufacturerCTA />
    </>
  );
}
