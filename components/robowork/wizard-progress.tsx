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
}

export function WizardProgress({ currentStep }: WizardProgressProps) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "var(--theme-text-secondary)",
          }}
        >
          Step {currentStep} of 7
        </span>
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--theme-text)",
          }}
        >
          {STEP_LABELS[currentStep - 1]}
        </span>
      </div>
      <div style={{ display: "flex", gap: "0.375rem" }}>
        {STEP_LABELS.map((label, i) => (
          <div
            key={label}
            style={{
              flex: 1,
              height: "6px",
              borderRadius: "3px",
              backgroundColor:
                i < currentStep ? "#0EA5E9" : "var(--theme-border)",
              transition: "background-color 0.3s ease",
            }}
            title={label}
          />
        ))}
      </div>
    </div>
  );
}
