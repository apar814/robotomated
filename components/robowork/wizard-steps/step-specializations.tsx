"use client";

import type { WizardData } from "@/components/robowork/wizard-types";

interface StepProps {
  data: WizardData;
  updateData: (partial: Partial<WizardData>) => void;
}

const INDUSTRY_SPECIALIZATIONS = [
  { value: "warehouse", label: "Warehouse" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "healthcare", label: "Healthcare" },
  { value: "agricultural", label: "Agricultural" },
  { value: "security", label: "Security" },
  { value: "hospitality", label: "Hospitality" },
  { value: "construction", label: "Construction" },
  { value: "eldercare", label: "Eldercare" },
  { value: "retail", label: "Retail" },
  { value: "education", label: "Education" },
] as const;

const TASK_SPECIALIZATIONS = [
  { value: "material_handling", label: "Material Handling" },
  { value: "pick_and_pack", label: "Pick & Pack" },
  { value: "floor_cleaning", label: "Floor Cleaning" },
  { value: "security_patrol", label: "Security Patrol" },
  { value: "inspection", label: "Inspection" },
  { value: "welding_assembly", label: "Welding & Assembly" },
  { value: "customer_service", label: "Customer Service" },
  { value: "agricultural_harvest", label: "Agricultural Harvest" },
  { value: "medical_delivery", label: "Medical Delivery" },
  { value: "humanoid_operation", label: "Humanoid Operation" },
] as const;

const LEVELS = ["beginner", "experienced", "expert"] as const;

function SpecCard({
  item,
  active,
  onToggle,
}: {
  item: { value: string; label: string };
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-lg border p-3 text-center transition-colors"
      style={{
        borderColor: active ? "#0EA5E9" : "var(--theme-border)",
        background: active ? "rgba(14,165,233,0.05)" : "var(--theme-card)",
      }}
    >
      <div className="flex h-6 w-6 items-center justify-center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="8" width="14" height="12" rx="2" /><path d="M9 13h0M15 13h0" strokeWidth={2.5} /><path d="M9 17h6M12 2v4" /></svg></div>
      <div
        className="mt-1 text-xs font-semibold"
        style={{ color: "var(--theme-text-primary)" }}
      >
        {item.label}
      </div>
    </button>
  );
}

function LevelToggle({
  slug,
  level,
  onChange,
}: {
  slug: string;
  level: "beginner" | "experienced" | "expert";
  onChange: (slug: string, level: "beginner" | "experienced" | "expert") => void;
}) {
  return (
    <div className="mt-1 inline-flex rounded-md border" style={{ borderColor: "var(--theme-border)" }}>
      {LEVELS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(slug, l)}
          className="px-2.5 py-1 text-xs font-medium capitalize transition-colors"
          style={{
            background: level === l ? "#0EA5E9" : "transparent",
            color: level === l ? "#fff" : "var(--theme-text-muted)",
          }}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export default function StepSpecializations({ data, updateData }: StepProps) {
  function toggleIndustry(value: string) {
    const current = data.specializations;
    const levels = { ...data.specializationLevels };
    let next: string[];
    if (current.includes(value)) {
      next = current.filter((s) => s !== value);
      delete levels[value];
    } else {
      next = [...current, value];
      levels[value] = "experienced";
    }
    updateData({ specializations: next, specializationLevels: levels });
  }

  function toggleTask(value: string) {
    const current = data.taskSpecializations;
    const levels = { ...data.specializationLevels };
    let next: string[];
    if (current.includes(value)) {
      next = current.filter((s) => s !== value);
      delete levels[value];
    } else {
      next = [...current, value];
      levels[value] = "experienced";
    }
    updateData({ taskSpecializations: next, specializationLevels: levels });
  }

  function updateLevel(
    slug: string,
    level: "beginner" | "experienced" | "expert",
  ) {
    updateData({
      specializationLevels: { ...data.specializationLevels, [slug]: level },
    });
  }

  const allSelected = [...data.specializations, ...data.taskSpecializations];

  return (
    <div className="space-y-8">
      {/* Industry Specializations */}
      <div>
        <label
          className="mb-3 block text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--theme-text-muted)" }}
        >
          Industry Specializations
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {INDUSTRY_SPECIALIZATIONS.map((item) => (
            <SpecCard
              key={item.value}
              item={item}
              active={data.specializations.includes(item.value)}
              onToggle={() => toggleIndustry(item.value)}
            />
          ))}
        </div>
      </div>

      {/* Task Specializations */}
      <div>
        <label
          className="mb-3 block text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--theme-text-muted)" }}
        >
          Task Specializations
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TASK_SPECIALIZATIONS.map((item) => (
            <SpecCard
              key={item.value}
              item={item}
              active={data.taskSpecializations.includes(item.value)}
              onToggle={() => toggleTask(item.value)}
            />
          ))}
        </div>
      </div>

      {/* Level selectors for all selected */}
      {allSelected.length > 0 && (
        <div>
          <label
            className="mb-3 block text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--theme-text-muted)" }}
          >
            Experience Levels
          </label>
          <div className="space-y-3">
            {allSelected.map((slug) => {
              const item =
                INDUSTRY_SPECIALIZATIONS.find((s) => s.value === slug) ||
                TASK_SPECIALIZATIONS.find((s) => s.value === slug);
              if (!item) return null;
              return (
                <div key={slug} className="flex items-center justify-between">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {item.label}
                  </span>
                  <LevelToggle
                    slug={slug}
                    level={data.specializationLevels[slug] || "experienced"}
                    onChange={updateLevel}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Note */}
      <div
        className="rounded-lg px-4 py-3 text-sm"
        style={{
          background: "rgba(14,165,233,0.08)",
          color: "var(--theme-text-muted)",
        }}
      >
        Specialized RSPs earn 40% more per job.
      </div>
    </div>
  );
}
