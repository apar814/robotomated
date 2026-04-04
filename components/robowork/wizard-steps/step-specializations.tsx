"use client";

import type { WizardData } from "@/components/robowork/wizard-types";

interface StepProps {
  data: WizardData;
  updateData: (partial: Partial<WizardData>) => void;
}

const INDUSTRY_SPECIALIZATIONS = [
  { value: "warehouse", label: "Warehouse", icon: "\uD83C\uDFED" },
  { value: "manufacturing", label: "Manufacturing", icon: "\u2699\uFE0F" },
  { value: "healthcare", label: "Healthcare", icon: "\uD83C\uDFE5" },
  { value: "agricultural", label: "Agricultural", icon: "\uD83C\uDF3E" },
  { value: "security", label: "Security", icon: "\uD83D\uDD12" },
  { value: "hospitality", label: "Hospitality", icon: "\uD83D\uDECE\uFE0F" },
  { value: "construction", label: "Construction", icon: "\uD83C\uDFD7\uFE0F" },
  { value: "eldercare", label: "Eldercare", icon: "\uD83D\uDC75" },
  { value: "retail", label: "Retail", icon: "\uD83D\uDED2" },
  { value: "education", label: "Education", icon: "\uD83D\uDCDA" },
] as const;

const TASK_SPECIALIZATIONS = [
  { value: "material_handling", label: "Material Handling", icon: "\uD83D\uDCE6" },
  { value: "pick_and_pack", label: "Pick & Pack", icon: "\uD83D\uDCCB" },
  { value: "floor_cleaning", label: "Floor Cleaning", icon: "\uD83E\uDDF9" },
  { value: "security_patrol", label: "Security Patrol", icon: "\uD83D\uDC6E" },
  { value: "inspection", label: "Inspection", icon: "\uD83D\uDD0D" },
  { value: "welding_assembly", label: "Welding & Assembly", icon: "\uD83D\uDD27" },
  { value: "customer_service", label: "Customer Service", icon: "\uD83D\uDCAC" },
  { value: "agricultural_harvest", label: "Agricultural Harvest", icon: "\uD83C\uDF3F" },
  { value: "medical_delivery", label: "Medical Delivery", icon: "\uD83D\uDC8A" },
  { value: "humanoid_operation", label: "Humanoid Operation", icon: "\uD83E\uDD16" },
] as const;

const LEVELS = ["beginner", "experienced", "expert"] as const;

function SpecCard({
  item,
  active,
  onToggle,
}: {
  item: { value: string; label: string; icon: string };
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
      <div className="text-2xl">{item.icon}</div>
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
                    {item.icon} {item.label}
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
