"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface RobotSearchResult {
  id: string;
  name: string;
  manufacturer_name: string;
  model_number: string | null;
  price_msrp: number | null;
}

interface FormData {
  robot_id: string | null;
  robot_name: string;
  custom_name: string;
  serial_number: string;
  purchase_date: string;
  purchase_price: string;
  site_location: string;
  department: string;
  notes: string;
}

const DEMO_SEARCH_RESULTS: RobotSearchResult[] = [
  { id: "r1", name: "Locus Robotics Origin", manufacturer_name: "Locus Robotics", model_number: "Origin-3", price_msrp: 35000 },
  { id: "r2", name: "Universal Robots UR10e", manufacturer_name: "Universal Robots", model_number: "UR10e", price_msrp: 52000 },
  { id: "r3", name: "Boston Dynamics Stretch", manufacturer_name: "Boston Dynamics", model_number: "Stretch", price_msrp: 85000 },
  { id: "r4", name: "Avidbots Neo 2", manufacturer_name: "Avidbots", model_number: "Neo 2", price_msrp: 42000 },
  { id: "r5", name: "Knightscope K5", manufacturer_name: "Knightscope", model_number: "K5", price_msrp: 28000 },
  { id: "r6", name: "Fetch Robotics CartConnect", manufacturer_name: "Fetch Robotics", model_number: "CartConnect-100", price_msrp: 30000 },
];

const RECOMMENDED_SCHEDULES = [
  { name: "Sensor Calibration", interval: "quarterly", hours: 2, cost: 450, pro: false },
  { name: "Drive System Inspection", interval: "monthly", hours: 1, cost: 200, pro: false },
  { name: "Safety System Audit", interval: "annual", hours: 8, cost: 2000, pro: true },
  { name: "Software Update Check", interval: "monthly", hours: 0.5, cost: 0, pro: false },
];

export function AddRobotForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<RobotSearchResult[]>([]);
  const [selectedRobot, setSelectedRobot] = useState<RobotSearchResult | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormData>({
    robot_id: null,
    robot_name: "",
    custom_name: "",
    serial_number: "",
    purchase_date: "",
    purchase_price: "",
    site_location: "",
    department: "",
    notes: "",
  });

  // Search handler — in demo mode uses local data, in real mode would fetch from API
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const q = searchQuery.toLowerCase();
    const results = DEMO_SEARCH_RESULTS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.manufacturer_name.toLowerCase().includes(q) ||
        (r.model_number && r.model_number.toLowerCase().includes(q))
    );

    // Also try real API search
    const controller = new AbortController();
    fetch(`/api/robots/search?q=${encodeURIComponent(searchQuery)}`, {
      signal: controller.signal,
    })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.results?.length) {
          setSearchResults(data.results);
        } else {
          setSearchResults(results);
        }
        setShowDropdown(true);
      })
      .catch(() => {
        setSearchResults(results);
        setShowDropdown(true);
      });

    return () => controller.abort();
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectRobot(robot: RobotSearchResult) {
    setSelectedRobot(robot);
    setSearchQuery(robot.name);
    setShowDropdown(false);
    setForm((prev) => ({
      ...prev,
      robot_id: robot.id,
      robot_name: robot.name,
      purchase_price: robot.price_msrp ? String(robot.price_msrp) : "",
    }));
  }

  function update(key: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function canAdvance(): boolean {
    switch (step) {
      case 1:
        return !!selectedRobot || form.robot_name.length > 2;
      case 2:
        return form.serial_number.length > 0 && form.site_location.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  }

  async function handleSubmit() {
    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/fleet/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          robot_id: form.robot_id,
          custom_name: form.custom_name || null,
          serial_number: form.serial_number,
          purchase_date: form.purchase_date || null,
          purchase_price: form.purchase_price ? Number(form.purchase_price) : null,
          site_location: form.site_location,
          department: form.department || null,
          notes: form.notes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to add robot");
      }

      setStatus("success");
      setTimeout(() => router.push("/fleet"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-[#00E5A0]/30 bg-[#00E5A0]/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#00E5A0]/20">
          <svg className="h-6 w-6 text-[#00E5A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white">Robot Added to Fleet</h3>
        <p className="mt-1 text-sm text-white/50">Redirecting to fleet dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                s === step
                  ? "bg-[#00C2FF] text-[#0A0F1E]"
                  : s < step
                  ? "bg-[#00E5A0]/20 text-[#00E5A0]"
                  : "bg-white/[0.06] text-white/50"
              }`}
            >
              {s < step ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                s
              )}
            </div>
            {s < 4 && (
              <div
                className={`h-0.5 w-8 sm:w-16 ${
                  s < step ? "bg-[#00E5A0]/40" : "bg-white/[0.08]"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Search Robot */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Find Your Robot Model</h2>
            <p className="mt-1 text-sm text-white/50">
              Search our database or enter a custom robot name
            </p>
          </div>

          <div className="relative" ref={dropdownRef}>
            <label className="mb-1.5 block text-xs font-medium text-white/60">
              Search Robot Database
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., Universal Robots UR10e, Locus Origin..."
              className="w-full rounded-lg border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-[#00C2FF]/50 focus:outline-none"
            />

            {showDropdown && searchResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-lg border border-white/[0.12] bg-[#0A0F1E] shadow-xl">
                {searchResults.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => selectRobot(r)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-white/[0.05] transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-white/90">{r.name}</p>
                      <p className="text-xs text-white/40">
                        {r.manufacturer_name}
                        {r.model_number ? ` \u00b7 ${r.model_number}` : ""}
                      </p>
                    </div>
                    {r.price_msrp && (
                      <span className="text-xs font-mono text-[#00E5A0]">
                        ${r.price_msrp.toLocaleString()}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedRobot && (
            <div className="rounded-lg border border-[#00C2FF]/20 bg-[#00C2FF]/5 p-4">
              <p className="text-sm font-medium text-[#00C2FF]">Selected</p>
              <p className="text-lg font-bold text-white">{selectedRobot.name}</p>
              <p className="text-xs text-white/40">
                {selectedRobot.manufacturer_name}
                {selectedRobot.price_msrp ? ` \u00b7 MSRP $${selectedRobot.price_msrp.toLocaleString()}` : ""}
              </p>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">
              Or enter custom name
            </label>
            <input
              type="text"
              value={form.robot_name}
              onChange={(e) => update("robot_name", e.target.value)}
              placeholder="Custom robot model name"
              className="w-full rounded-lg border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-[#00C2FF]/50 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Step 2: Asset Details */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Asset Details</h2>
            <p className="mt-1 text-sm text-white/50">
              Enter details about this specific unit
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/60">
                Custom Name (optional)
              </label>
              <input
                type="text"
                value={form.custom_name}
                onChange={(e) => update("custom_name", e.target.value)}
                placeholder='e.g., "Picker Alpha"'
                className="w-full rounded-lg border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-[#00C2FF]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/60">
                Serial Number *
              </label>
              <input
                type="text"
                value={form.serial_number}
                onChange={(e) => update("serial_number", e.target.value)}
                placeholder="e.g., LR-2024-00847"
                className="w-full rounded-lg border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-[#00C2FF]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/60">
                Purchase Date
              </label>
              <input
                type="date"
                value={form.purchase_date}
                onChange={(e) => update("purchase_date", e.target.value)}
                className="w-full rounded-lg border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm text-white focus:border-[#00C2FF]/50 focus:outline-none [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/60">
                Purchase Price ($)
              </label>
              <input
                type="number"
                value={form.purchase_price}
                onChange={(e) => update("purchase_price", e.target.value)}
                placeholder="35000"
                className="w-full rounded-lg border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-[#00C2FF]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/60">
                Site Location *
              </label>
              <input
                type="text"
                value={form.site_location}
                onChange={(e) => update("site_location", e.target.value)}
                placeholder='e.g., "Warehouse A — Dallas, TX"'
                className="w-full rounded-lg border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-[#00C2FF]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/60">
                Department
              </label>
              <input
                type="text"
                value={form.department}
                onChange={(e) => update("department", e.target.value)}
                placeholder='e.g., "Fulfillment"'
                className="w-full rounded-lg border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-[#00C2FF]/50 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={3}
              placeholder="Any additional notes about this unit..."
              className="w-full rounded-lg border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-[#00C2FF]/50 focus:outline-none resize-none"
            />
          </div>
        </div>
      )}

      {/* Step 3: Recommended Maintenance Schedule */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Recommended Maintenance</h2>
            <p className="mt-1 text-sm text-white/50">
              We recommend these maintenance schedules based on the robot model. You can customize later.
            </p>
          </div>

          <div className="space-y-3">
            {RECOMMENDED_SCHEDULES.map((sched, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00C2FF]/10">
                  <svg className="h-4 w-4 text-[#00C2FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/90">{sched.name}</p>
                  <p className="text-xs text-white/40">
                    Every {sched.interval} &middot; ~{sched.hours}h
                    {sched.cost > 0 ? ` \u00b7 ~$${sched.cost}` : ""}
                  </p>
                </div>
                {sched.pro && (
                  <span className="shrink-0 rounded bg-[#7B2FFF]/20 px-2 py-0.5 text-[10px] font-medium text-[#7B2FFF]">
                    REQUIRES PRO
                  </span>
                )}
                <svg className="h-4 w-4 shrink-0 text-[#00E5A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ))}
          </div>

          <p className="text-xs text-white/50">
            These schedules will be automatically created. You can edit or remove them from the asset detail page.
          </p>
        </div>
      )}

      {/* Step 4: Review & Confirm */}
      {step === 4 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Review &amp; Confirm</h2>
            <p className="mt-1 text-sm text-white/50">
              Make sure everything looks right before adding to your fleet.
            </p>
          </div>

          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] divide-y divide-white/[0.06]">
            <div className="px-4 py-3">
              <p className="text-xs text-white/40">Robot Model</p>
              <p className="text-sm font-medium text-white/90">
                {selectedRobot?.name || form.robot_name}
              </p>
            </div>
            {form.custom_name && (
              <div className="px-4 py-3">
                <p className="text-xs text-white/40">Custom Name</p>
                <p className="text-sm font-medium text-white/90">{form.custom_name}</p>
              </div>
            )}
            <div className="px-4 py-3">
              <p className="text-xs text-white/40">Serial Number</p>
              <p className="text-sm font-mono text-white/90">{form.serial_number}</p>
            </div>
            <div className="grid grid-cols-2 divide-x divide-white/[0.06]">
              <div className="px-4 py-3">
                <p className="text-xs text-white/40">Purchase Date</p>
                <p className="text-sm text-white/90">
                  {form.purchase_date
                    ? new Date(form.purchase_date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "--"}
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-xs text-white/40">Purchase Price</p>
                <p className="text-sm font-mono text-[#00E5A0]">
                  {form.purchase_price ? `$${Number(form.purchase_price).toLocaleString()}` : "--"}
                </p>
              </div>
            </div>
            <div className="px-4 py-3">
              <p className="text-xs text-white/40">Location</p>
              <p className="text-sm text-white/90">{form.site_location}</p>
            </div>
            {form.department && (
              <div className="px-4 py-3">
                <p className="text-xs text-white/40">Department</p>
                <p className="text-sm text-white/90">{form.department}</p>
              </div>
            )}
            <div className="px-4 py-3">
              <p className="text-xs text-white/40">Maintenance Schedules</p>
              <p className="text-sm text-white/90">{RECOMMENDED_SCHEDULES.length} schedules will be created</p>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-400/30 bg-red-400/5 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => step > 1 ? setStep(step - 1) : router.push("/fleet")}
        >
          {step === 1 ? "Cancel" : "Back"}
        </Button>

        {step < 4 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!canAdvance()}
          >
            Continue
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Adding..." : "Add to Fleet"}
          </Button>
        )}
      </div>
    </div>
  );
}
