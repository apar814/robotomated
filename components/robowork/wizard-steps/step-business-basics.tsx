"use client";

import { useRef, useState } from "react";
import type { WizardData } from "@/components/robowork/wizard-types";

interface StepProps {
  data: WizardData;
  updateData: (partial: Partial<WizardData>) => void;
}

const BUSINESS_TYPES = [
  { value: "solo", label: "Solo Operator", subtitle: "Just me and my robot" },
  { value: "small_fleet", label: "Small Fleet (2-5)", subtitle: "Growing operation" },
  { value: "mid_fleet", label: "Mid Fleet (6-20)", subtitle: "Established business" },
  { value: "large_fleet", label: "Large Fleet (20+)", subtitle: "Enterprise scale" },
  { value: "rental_company", label: "Rental Company", subtitle: "Robot rental business" },
  { value: "integrator", label: "Integrator", subtitle: "Systems integration" },
] as const;

export default function StepBusinessBasics({ data, updateData }: StepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(data.profileImageUrl || "");

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    updateData({ profileImage: file, profileImageUrl: url });
  }

  return (
    <div className="space-y-6">
      {/* Company Name */}
      <div>
        <label
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--theme-text-muted)" }}
        >
          Company Name *
        </label>
        <input
          type="text"
          required
          value={data.companyName}
          onChange={(e) => updateData({ companyName: e.target.value })}
          placeholder="Your company or operator name"
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors"
          style={{
            background: "var(--theme-input-bg)",
            borderColor: "var(--theme-input-border)",
            color: "var(--theme-text-primary)",
          }}
        />
      </div>

      {/* Business Type */}
      <div>
        <label
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--theme-text-muted)" }}
        >
          Business Type
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {BUSINESS_TYPES.map((bt) => {
            const selected = data.businessType === bt.value;
            return (
              <button
                key={bt.value}
                type="button"
                onClick={() => updateData({ businessType: bt.value })}
                className="rounded-lg border p-4 text-left transition-colors"
                style={{
                  borderColor: selected ? "#2563EB" : "var(--theme-border)",
                  background: selected
                    ? "rgba(37,99,235,0.05)"
                    : "var(--theme-card)",
                }}
              >
                <div className="flex h-6 w-6 items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="8" width="14" height="12" rx="2" /><path d="M9 13h0M15 13h0" strokeWidth={2.5} /><path d="M9 17h6M12 2v4" /></svg>
                </div>
                <div
                  className="mt-1 text-sm font-semibold"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {bt.label}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--theme-text-muted)" }}
                >
                  {bt.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Years in Robotics */}
      <div>
        <label
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--theme-text-muted)" }}
        >
          Years in Robotics
        </label>
        <input
          type="range"
          min={0}
          max={20}
          step={1}
          value={data.yearsInRobotics}
          onChange={(e) =>
            updateData({ yearsInRobotics: Number(e.target.value) })
          }
          className="w-full"
        />
        <div
          className="mt-1 text-sm font-medium"
          style={{ color: "var(--theme-text-primary)" }}
        >
          {data.yearsInRobotics} years
        </div>
      </div>

      {/* Website */}
      <div>
        <label
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--theme-text-muted)" }}
        >
          Website
        </label>
        <input
          type="text"
          value={data.website}
          onChange={(e) => updateData({ website: e.target.value })}
          placeholder="https://..."
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors"
          style={{
            background: "var(--theme-input-bg)",
            borderColor: "var(--theme-input-border)",
            color: "var(--theme-text-primary)",
          }}
        />
      </div>

      {/* LinkedIn */}
      <div>
        <label
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--theme-text-muted)" }}
        >
          LinkedIn
        </label>
        <input
          type="text"
          value={data.linkedin}
          onChange={(e) => updateData({ linkedin: e.target.value })}
          placeholder="https://linkedin.com/in/..."
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors"
          style={{
            background: "var(--theme-input-bg)",
            borderColor: "var(--theme-input-border)",
            color: "var(--theme-text-primary)",
          }}
        />
      </div>

      {/* Bio */}
      <div>
        <label
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--theme-text-muted)" }}
        >
          Bio
        </label>
        <textarea
          rows={3}
          maxLength={500}
          value={data.bio}
          onChange={(e) => updateData({ bio: e.target.value })}
          placeholder="Tell potential clients about your experience..."
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors"
          style={{
            background: "var(--theme-input-bg)",
            borderColor: "var(--theme-input-border)",
            color: "var(--theme-text-primary)",
          }}
        />
        <div
          className="mt-1 text-right text-xs"
          style={{ color: "var(--theme-text-muted)" }}
        >
          {data.bio.length}/500
        </div>
      </div>

      {/* Photo Upload */}
      <div>
        <label
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--theme-text-muted)" }}
        >
          Profile Photo
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors"
          style={{
            borderColor: "var(--theme-border)",
            background: "var(--theme-card)",
          }}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile preview"
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="text-center">
              <div className="text-3xl">📷</div>
              <div
                className="mt-2 text-sm"
                style={{ color: "var(--theme-text-muted)" }}
              >
                Click to upload a photo
              </div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
