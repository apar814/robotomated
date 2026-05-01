"use client";

import { useMemo, useState } from "react";
import type { WizardData } from "@/components/robowork/wizard-types";

interface StepProps {
  data: WizardData;
  updateData: (partial: Partial<WizardData>) => void;
}

const US_STATES = [
  { value: "", label: "Select a state" },
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "DC", label: "District of Columbia" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
] as const;

const BETA_CITIES = [
  "Los Angeles",
  "Chicago",
  "Dallas",
  "Atlanta",
  "Newark",
  "Jersey City",
];

export default function StepServiceAreas({ data, updateData }: StepProps) {
  const [showMultiple, setShowMultiple] = useState(
    data.additionalCities.length > 0,
  );

  const isBetaMarket = useMemo(() => {
    if (!data.city.trim()) return null;
    return BETA_CITIES.some((bc) =>
      data.city.toLowerCase().includes(bc.toLowerCase()),
    );
  }, [data.city]);

  function addCity() {
    if (data.additionalCities.length >= 5) return;
    updateData({
      additionalCities: [...data.additionalCities, { city: "", state: "" }],
    });
  }

  function removeCity(index: number) {
    const next = data.additionalCities.filter((_, i) => i !== index);
    updateData({ additionalCities: next });
  }

  function updateCity(
    index: number,
    field: "city" | "state",
    value: string,
  ) {
    const next = data.additionalCities.map((c, i) =>
      i === index ? { ...c, [field]: value } : c,
    );
    updateData({ additionalCities: next });
  }

  const inputStyle = {
    background: "var(--theme-input-bg)",
    borderColor: "var(--theme-input-border)",
    color: "var(--theme-text-primary)",
  };

  return (
    <div className="space-y-6">
      {/* City */}
      <div>
        <label
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--theme-text-muted)" }}
        >
          City *
        </label>
        <input
          type="text"
          required
          value={data.city}
          onChange={(e) => updateData({ city: e.target.value })}
          placeholder="Your primary city"
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors"
          style={inputStyle}
        />
        {isBetaMarket !== null && (
          <div
            className="mt-2 rounded-md px-3 py-2 text-sm font-medium"
            style={{
              color: isBetaMarket ? "#16a34a" : "#d97706",
              background: isBetaMarket
                ? "rgba(22,163,74,0.08)"
                : "rgba(217,119,6,0.08)",
            }}
          >
            {isBetaMarket
              ? "\u2713 You're in a priority launch market!"
              : "You'll be on our priority waitlist."}
          </div>
        )}
      </div>

      {/* State */}
      <div>
        <label
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--theme-text-muted)" }}
        >
          State *
        </label>
        <select
          value={data.state}
          onChange={(e) => updateData({ state: e.target.value })}
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors"
          style={inputStyle}
        >
          {US_STATES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Service Radius */}
      <div>
        <label
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--theme-text-muted)" }}
        >
          Service Radius
        </label>
        <input
          type="range"
          min={25}
          max={500}
          step={25}
          value={data.serviceRadius}
          onChange={(e) =>
            updateData({ serviceRadius: Number(e.target.value) })
          }
          className="w-full"
        />
        <div
          className="mt-1 text-sm font-medium"
          style={{ color: "var(--theme-text-primary)" }}
        >
          {data.serviceRadius} miles
        </div>
      </div>

      {/* Additional Cities Toggle */}
      <div>
        <button
          type="button"
          onClick={() => {
            const next = !showMultiple;
            setShowMultiple(next);
            if (!next) updateData({ additionalCities: [] });
          }}
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: "var(--theme-text-primary)" }}
        >
          <span
            className="inline-flex h-5 w-9 items-center rounded-full px-0.5 transition-colors"
            style={{
              background: showMultiple ? "#D4D4D4" : "var(--theme-border)",
            }}
          >
            <span
              className="inline-block h-4 w-4 rounded-full bg-white transition-transform"
              style={{
                transform: showMultiple
                  ? "translateX(16px)"
                  : "translateX(0px)",
              }}
            />
          </span>
          Operate in multiple cities?
        </button>

        {showMultiple && (
          <div className="mt-4 space-y-3">
            {data.additionalCities.map((ac, i) => (
              <div key={i} className="flex items-start gap-2">
                <input
                  type="text"
                  value={ac.city}
                  onChange={(e) => updateCity(i, "city", e.target.value)}
                  placeholder="City"
                  className="flex-1 rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors"
                  style={inputStyle}
                />
                <select
                  value={ac.state}
                  onChange={(e) => updateCity(i, "state", e.target.value)}
                  className="w-32 rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors"
                  style={inputStyle}
                >
                  {US_STATES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeCity(i)}
                  className="rounded-lg border px-3 py-2.5 text-sm transition-colors hover:opacity-80"
                  style={{
                    borderColor: "var(--theme-border)",
                    color: "#ef4444",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            {data.additionalCities.length < 5 && (
              <button
                type="button"
                onClick={addCity}
                className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
                style={{
                  borderColor: "#D4D4D4",
                  color: "#D4D4D4",
                }}
              >
                + Add City
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
