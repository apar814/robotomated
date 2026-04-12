"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

const SPECIALIZATIONS = [
  "warehouse",
  "medical",
  "hospitality",
  "agriculture",
  "construction",
  "manufacturing",
  "retail",
  "security",
  "eldercare",
];

const FULFILLMENT_TYPES = [
  { value: "with_operator", label: "With Operator" },
  { value: "drop_off", label: "Drop Off" },
  { value: "remote_operated", label: "Remote Operated" },
];

const STEPS = [
  "Company Info",
  "Specializations",
  "Robot Fleet",
  "Verification",
  "Contact & Submit",
];

interface RobotEntry {
  id: string;
  custom_name: string;
  custom_manufacturer: string;
  custom_category: string;
  description: string;
  daily_rate: string;
  weekly_rate: string;
  monthly_rate: string;
  minimum_days: string;
  operator_included: boolean;
  remote_capable: boolean;
}

function emptyRobot(): RobotEntry {
  return {
    id: crypto.randomUUID(),
    custom_name: "",
    custom_manufacturer: "",
    custom_category: "",
    description: "",
    daily_rate: "",
    weekly_rate: "",
    monthly_rate: "",
    minimum_days: "1",
    operator_included: false,
    remote_capable: false,
  };
}

const inputClasses =
  "w-full rounded-lg border border-border bg-obsidian-surface px-3 py-2.5 font-sans text-sm text-text-primary placeholder:text-text-ghost focus:border-[#2563EB]/50 focus:outline-none transition-colors";
const labelClasses = "font-mono text-[9px] tracking-widest uppercase text-text-ghost";

export function RegisterProviderForm() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("US");
  const [serviceRadius, setServiceRadius] = useState("50");
  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");

  // Step 2
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [fulfillmentTypes, setFulfillmentTypes] = useState<string[]>([]);
  const [serviceDescription, setServiceDescription] = useState("");

  // Step 3
  const [robots, setRobots] = useState<RobotEntry[]>([]);
  const [showRobotForm, setShowRobotForm] = useState(false);
  const [currentRobot, setCurrentRobot] = useState<RobotEntry>(emptyRobot());

  // Step 4
  const [insuranceInfo, setInsuranceInfo] = useState("");
  const [businessRegNumber, setBusinessRegNumber] = useState("");
  const [bgCheckConsent, setBgCheckConsent] = useState(false);

  // Step 5
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  function toggleSpecialization(s: string) {
    setSpecializations((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function toggleFulfillment(f: string) {
    setFulfillmentTypes((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  }

  function addRobot() {
    if (!currentRobot.custom_name.trim()) return;
    setRobots((prev) => [...prev, { ...currentRobot, id: crypto.randomUUID() }]);
    setCurrentRobot(emptyRobot());
    setShowRobotForm(false);
  }

  function removeRobot(id: string) {
    setRobots((prev) => prev.filter((r) => r.id !== id));
  }

  async function handleSubmit() {
    if (!termsAccepted) {
      setError("You must accept the terms to register.");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        company_name: companyName,
        description,
        city,
        state,
        country,
        service_radius: parseInt(serviceRadius, 10) || 50,
        website: website || null,
        linkedin: linkedin || null,
        specializations,
        fulfillment_types: fulfillmentTypes,
        service_description: serviceDescription,
        robots: robots.map((r) => ({
          custom_name: r.custom_name,
          custom_manufacturer: r.custom_manufacturer || null,
          custom_category: r.custom_category || null,
          description: r.description || null,
          daily_rate: r.daily_rate ? parseFloat(r.daily_rate) : null,
          weekly_rate: r.weekly_rate ? parseFloat(r.weekly_rate) : null,
          monthly_rate: r.monthly_rate ? parseFloat(r.monthly_rate) : null,
          minimum_days: parseInt(r.minimum_days, 10) || 1,
          operator_included: r.operator_included,
          remote_capable: r.remote_capable,
        })),
        insurance_info: insuranceInfo || null,
        business_registration_number: businessRegNumber || null,
        background_check_consent: bgCheckConsent,
        email,
        phone: phone || null,
      };

      const res = await fetch("/api/robowork/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-[#00E5A0]/30 bg-[#00E5A0]/5 p-12 text-center">
        <svg className="mx-auto h-12 w-12 text-[#00E5A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="mt-4 font-sans text-2xl font-bold text-text-primary">Registration Submitted</h2>
        <p className="mt-3 font-sans text-sm text-text-secondary">
          Thank you for registering as a provider on RoboWork. We will review your application
          and get back to you within 48 hours.
        </p>
        <a
          href="/robowork/providers"
          className="mt-6 inline-block rounded-lg bg-[#2563EB] px-6 py-2.5 font-mono text-[10px] font-semibold tracking-wider text-black"
        >
          BROWSE PROVIDERS
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* Progress indicator */}
      <div className="mb-10 flex items-center justify-center gap-2">
        {STEPS.map((label, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === step;
          const isComplete = stepNum < step;
          return (
            <div key={label} className="flex items-center gap-2">
              {i > 0 && (
                <div className={cn("h-px w-6 sm:w-10", isComplete ? "bg-[#2563EB]" : "bg-border")} />
              )}
              <button
                type="button"
                onClick={() => stepNum < step && setStep(stepNum)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[9px] tracking-wider transition-colors",
                  isActive && "bg-[#2563EB]/10 text-[#2563EB]",
                  isComplete && "bg-[#00E5A0]/10 text-[#00E5A0] cursor-pointer",
                  !isActive && !isComplete && "bg-white/[0.02] text-text-ghost"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold",
                    isActive && "bg-[#2563EB] text-black",
                    isComplete && "bg-[#00E5A0] text-black",
                    !isActive && !isComplete && "bg-white/[0.06] text-text-ghost"
                  )}
                >
                  {isComplete ? (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 font-sans text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Step 1: Company Info */}
      {step === 1 && (
        <div className="space-y-5">
          <h2 className="font-sans text-lg font-semibold text-text-primary">Company Information</h2>
          <div>
            <label className={labelClasses}>Company Name *</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Robotics Services"
              className={cn(inputClasses, "mt-1")}
              required
            />
          </div>
          <div>
            <label className={labelClasses}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell potential clients about your company, experience, and capabilities..."
              rows={4}
              className={cn(inputClasses, "mt-1 resize-none")}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClasses}>City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="San Francisco"
                className={cn(inputClasses, "mt-1")}
              />
            </div>
            <div>
              <label className={labelClasses}>State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="CA"
                className={cn(inputClasses, "mt-1")}
              />
            </div>
            <div>
              <label className={labelClasses}>Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="US"
                className={cn(inputClasses, "mt-1")}
              />
            </div>
          </div>
          <div>
            <label className={labelClasses}>Service Radius (miles)</label>
            <input
              type="number"
              value={serviceRadius}
              onChange={(e) => setServiceRadius(e.target.value)}
              className={cn(inputClasses, "mt-1 w-32")}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClasses}>Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
                className={cn(inputClasses, "mt-1")}
              />
            </div>
            <div>
              <label className={labelClasses}>LinkedIn</label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/company/..."
                className={cn(inputClasses, "mt-1")}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (!companyName.trim()) { setError("Company name is required"); return; }
                setError(null);
                setStep(2);
              }}
              className="rounded-lg bg-[#2563EB] px-6 py-2.5 font-mono text-[10px] font-semibold tracking-wider text-black transition-shadow hover:shadow-[0_0_16px_rgba(37,99,235,0.3)]"
            >
              NEXT: SPECIALIZATIONS
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Specializations */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="font-sans text-lg font-semibold text-text-primary">Specializations & Services</h2>
          <div>
            <label className={labelClasses}>Specializations</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {SPECIALIZATIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSpecialization(s)}
                  className={cn(
                    "rounded-full px-4 py-2 font-sans text-xs font-medium transition-colors",
                    specializations.includes(s)
                      ? "bg-[#2563EB]/20 text-[#2563EB] border border-[#2563EB]/30"
                      : "bg-white/[0.04] text-text-secondary border border-border hover:border-[#2563EB]/20"
                  )}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClasses}>Fulfillment Types</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {FULFILLMENT_TYPES.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => toggleFulfillment(f.value)}
                  className={cn(
                    "rounded-full px-4 py-2 font-sans text-xs font-medium transition-colors",
                    fulfillmentTypes.includes(f.value)
                      ? "bg-[#60A5FA]/20 text-[#60A5FA] border border-[#60A5FA]/30"
                      : "bg-white/[0.04] text-text-secondary border border-border hover:border-[#60A5FA]/20"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClasses}>Service Description</label>
            <textarea
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              placeholder="Describe the services you offer in more detail..."
              rows={3}
              className={cn(inputClasses, "mt-1 resize-none")}
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-lg border border-border px-6 py-2.5 font-mono text-[10px] font-semibold tracking-wider text-text-secondary transition-colors hover:border-text-ghost"
            >
              BACK
            </button>
            <button
              type="button"
              onClick={() => { setError(null); setStep(3); }}
              className="rounded-lg bg-[#2563EB] px-6 py-2.5 font-mono text-[10px] font-semibold tracking-wider text-black transition-shadow hover:shadow-[0_0_16px_rgba(37,99,235,0.3)]"
            >
              NEXT: ROBOT FLEET
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Robot Fleet */}
      {step === 3 && (
        <div className="space-y-5">
          <h2 className="font-sans text-lg font-semibold text-text-primary">Robot Fleet</h2>
          <p className="font-sans text-xs text-text-secondary">
            Add the robots you can deploy for clients. You can always add more later.
          </p>

          {/* Listed robots */}
          {robots.length > 0 && (
            <div className="space-y-3">
              {robots.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-obsidian-surface p-4"
                >
                  <div>
                    <p className="font-sans text-sm font-medium text-text-primary">{r.custom_name}</p>
                    <p className="mt-0.5 font-sans text-[11px] text-text-ghost">
                      {[
                        r.custom_manufacturer,
                        r.daily_rate && `$${r.daily_rate}/day`,
                        r.operator_included && "Operator included",
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRobot(r.id)}
                    className="rounded-lg border border-red-500/20 px-3 py-1.5 font-mono text-[9px] tracking-wider text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    REMOVE
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add robot sub-form */}
          {showRobotForm ? (
            <div className="rounded-xl border border-[#2563EB]/20 bg-[#2563EB]/[0.02] p-5 space-y-4">
              <h3 className="font-sans text-sm font-semibold text-text-primary">Add Robot</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelClasses}>Robot Name *</label>
                  <input
                    type="text"
                    value={currentRobot.custom_name}
                    onChange={(e) => setCurrentRobot({ ...currentRobot, custom_name: e.target.value })}
                    placeholder="Spot Explorer"
                    className={cn(inputClasses, "mt-1")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Manufacturer</label>
                  <input
                    type="text"
                    value={currentRobot.custom_manufacturer}
                    onChange={(e) => setCurrentRobot({ ...currentRobot, custom_manufacturer: e.target.value })}
                    placeholder="Boston Dynamics"
                    className={cn(inputClasses, "mt-1")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Category</label>
                  <input
                    type="text"
                    value={currentRobot.custom_category}
                    onChange={(e) => setCurrentRobot({ ...currentRobot, custom_category: e.target.value })}
                    placeholder="Inspection"
                    className={cn(inputClasses, "mt-1")}
                  />
                </div>
              </div>
              <div>
                <label className={labelClasses}>Description</label>
                <textarea
                  value={currentRobot.description}
                  onChange={(e) => setCurrentRobot({ ...currentRobot, description: e.target.value })}
                  placeholder="Describe the robot and its capabilities..."
                  rows={2}
                  className={cn(inputClasses, "mt-1 resize-none")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <label className={labelClasses}>Daily Rate ($)</label>
                  <input
                    type="number"
                    value={currentRobot.daily_rate}
                    onChange={(e) => setCurrentRobot({ ...currentRobot, daily_rate: e.target.value })}
                    placeholder="500"
                    className={cn(inputClasses, "mt-1")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Weekly Rate ($)</label>
                  <input
                    type="number"
                    value={currentRobot.weekly_rate}
                    onChange={(e) => setCurrentRobot({ ...currentRobot, weekly_rate: e.target.value })}
                    placeholder="2500"
                    className={cn(inputClasses, "mt-1")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Monthly Rate ($)</label>
                  <input
                    type="number"
                    value={currentRobot.monthly_rate}
                    onChange={(e) => setCurrentRobot({ ...currentRobot, monthly_rate: e.target.value })}
                    placeholder="8000"
                    className={cn(inputClasses, "mt-1")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Min Days</label>
                  <input
                    type="number"
                    value={currentRobot.minimum_days}
                    onChange={(e) => setCurrentRobot({ ...currentRobot, minimum_days: e.target.value })}
                    className={cn(inputClasses, "mt-1")}
                  />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={currentRobot.operator_included}
                    onChange={(e) => setCurrentRobot({ ...currentRobot, operator_included: e.target.checked })}
                    className="h-4 w-4 rounded border-border bg-obsidian-surface accent-[#2563EB]"
                  />
                  <span className="font-sans text-xs text-text-secondary">Operator Included</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={currentRobot.remote_capable}
                    onChange={(e) => setCurrentRobot({ ...currentRobot, remote_capable: e.target.checked })}
                    className="h-4 w-4 rounded border-border bg-obsidian-surface accent-[#2563EB]"
                  />
                  <span className="font-sans text-xs text-text-secondary">Remote Capable</span>
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={addRobot}
                  disabled={!currentRobot.custom_name.trim()}
                  className="rounded-lg bg-[#60A5FA] px-5 py-2 font-mono text-[10px] font-semibold tracking-wider text-black transition-opacity disabled:opacity-40"
                >
                  ADD ROBOT
                </button>
                <button
                  type="button"
                  onClick={() => { setShowRobotForm(false); setCurrentRobot(emptyRobot()); }}
                  className="rounded-lg border border-border px-5 py-2 font-mono text-[10px] font-semibold tracking-wider text-text-secondary transition-colors hover:border-text-ghost"
                >
                  CANCEL
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowRobotForm(true)}
              className="flex items-center gap-2 rounded-lg border border-dashed border-border px-5 py-3 font-sans text-xs font-medium text-text-secondary transition-colors hover:border-[#2563EB]/30 hover:text-[#2563EB]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Robot
            </button>
          )}

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-lg border border-border px-6 py-2.5 font-mono text-[10px] font-semibold tracking-wider text-text-secondary transition-colors hover:border-text-ghost"
            >
              BACK
            </button>
            <button
              type="button"
              onClick={() => { setError(null); setStep(4); }}
              className="rounded-lg bg-[#2563EB] px-6 py-2.5 font-mono text-[10px] font-semibold tracking-wider text-black transition-shadow hover:shadow-[0_0_16px_rgba(37,99,235,0.3)]"
            >
              NEXT: VERIFICATION
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Verification */}
      {step === 4 && (
        <div className="space-y-5">
          <h2 className="font-sans text-lg font-semibold text-text-primary">Verification Details</h2>
          <p className="font-sans text-xs text-text-secondary">
            Verified providers get better visibility and earn more trust from clients.
          </p>
          <div>
            <label className={labelClasses}>Insurance Certificate Info</label>
            <textarea
              value={insuranceInfo}
              onChange={(e) => setInsuranceInfo(e.target.value)}
              placeholder="Describe your insurance coverage, provider, and policy number..."
              rows={3}
              className={cn(inputClasses, "mt-1 resize-none")}
            />
            <p className="mt-1 font-sans text-[10px] text-text-ghost">
              Document upload will be available in Phase 2.
            </p>
          </div>
          <div>
            <label className={labelClasses}>Business Registration Number</label>
            <input
              type="text"
              value={businessRegNumber}
              onChange={(e) => setBusinessRegNumber(e.target.value)}
              placeholder="EIN, state registration, etc."
              className={cn(inputClasses, "mt-1")}
            />
          </div>
          <label className="flex items-start gap-3 rounded-lg border border-border bg-obsidian-surface p-4">
            <input
              type="checkbox"
              checked={bgCheckConsent}
              onChange={(e) => setBgCheckConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border bg-obsidian-surface accent-[#2563EB]"
            />
            <div>
              <span className="font-sans text-sm text-text-primary">I consent to a background check</span>
              <p className="mt-0.5 font-sans text-[11px] text-text-ghost">
                A background check helps verify your identity and builds trust with clients.
                Results are confidential and used only for verification purposes.
              </p>
            </div>
          </label>
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="rounded-lg border border-border px-6 py-2.5 font-mono text-[10px] font-semibold tracking-wider text-text-secondary transition-colors hover:border-text-ghost"
            >
              BACK
            </button>
            <button
              type="button"
              onClick={() => { setError(null); setStep(5); }}
              className="rounded-lg bg-[#2563EB] px-6 py-2.5 font-mono text-[10px] font-semibold tracking-wider text-black transition-shadow hover:shadow-[0_0_16px_rgba(37,99,235,0.3)]"
            >
              NEXT: SUBMIT
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Contact & Submit */}
      {step === 5 && (
        <div className="space-y-5">
          <h2 className="font-sans text-lg font-semibold text-text-primary">Contact & Submit</h2>
          <div>
            <label className={labelClasses}>Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className={cn(inputClasses, "mt-1")}
              required
            />
          </div>
          <div>
            <label className={labelClasses}>Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className={cn(inputClasses, "mt-1")}
            />
          </div>
          <label className="flex items-start gap-3 rounded-lg border border-border bg-obsidian-surface p-4">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border bg-obsidian-surface accent-[#2563EB]"
            />
            <div>
              <span className="font-sans text-sm text-text-primary">
                I accept the terms of service and provider agreement
              </span>
              <p className="mt-0.5 font-sans text-[11px] text-text-ghost">
                By registering, you agree to the RoboWork Provider Terms of Service,
                including our commission structure and service standards.
              </p>
            </div>
          </label>

          {/* Summary */}
          <div className="rounded-xl border border-border bg-obsidian-surface p-5">
            <h3 className="font-mono text-[9px] tracking-widest uppercase text-text-ghost">Registration Summary</h3>
            <div className="mt-3 space-y-2 font-sans text-xs text-text-secondary">
              <p><span className="text-text-ghost">Company:</span> {companyName}</p>
              <p><span className="text-text-ghost">Location:</span> {[city, state, country].filter(Boolean).join(", ") || "Not specified"}</p>
              <p><span className="text-text-ghost">Specializations:</span> {specializations.length > 0 ? specializations.join(", ") : "None selected"}</p>
              <p><span className="text-text-ghost">Robots:</span> {robots.length} listed</p>
              <p><span className="text-text-ghost">Background Check:</span> {bgCheckConsent ? "Consented" : "Not consented"}</p>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="rounded-lg border border-border px-6 py-2.5 font-mono text-[10px] font-semibold tracking-wider text-text-secondary transition-colors hover:border-text-ghost"
            >
              BACK
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !termsAccepted || !email.trim()}
              className="rounded-lg bg-[#60A5FA] px-8 py-2.5 font-mono text-[10px] font-semibold tracking-wider text-black transition-opacity disabled:opacity-40"
            >
              {submitting ? "SUBMITTING..." : "REGISTER AS PROVIDER"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
