"use client";

import { useState, useCallback } from "react";
import { WizardProgress } from "./wizard-progress";
import { createEmptyWizardData, type WizardData } from "./wizard-types";

import StepBusinessBasics from "./wizard-steps/step-business-basics";
import StepServiceAreas from "./wizard-steps/step-service-areas";
import StepRobotFleet from "./wizard-steps/step-robot-fleet";
import StepSpecializations from "./wizard-steps/step-specializations";
import StepVerification from "./wizard-steps/step-verification";
import StepPayment from "./wizard-steps/step-payment";
import StepPreview from "./wizard-steps/step-preview";
import WizardCelebration from "./wizard-celebration";

const ENCOURAGEMENTS = [
  "Great start! You're 15% of the way to your first job on Robotomated.",
  "Nice — that's a lot of potential jobs in your area.",
  "Your fleet is looking strong. Businesses love detailed listings.",
  "Almost there — verification is next, then you're live.",
  "Trust built. You're standing out from other RSPs already.",
  "Payment is ready for when we go live. One more step!",
];

function canProceed(step: number, data: WizardData): boolean {
  switch (step) {
    case 1:
      return data.companyName.trim() !== "" && data.businessType.trim() !== "";
    case 2:
      return data.city.trim() !== "" && data.state.trim() !== "";
    case 3:
      return data.robots.length > 0 && data.robots.some((r) => r.name.trim() !== "");
    case 4:
      return data.specializations.length > 0 && data.taskSpecializations.length > 0;
    case 5:
      return data.emailVerified && data.phoneVerified;
    case 6:
      return true;
    case 7:
      return true;
    default:
      return false;
  }
}

export function RegisterWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(createEmptyWizardData);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [published, setPublished] = useState(false);
  const [encouragement, setEncouragement] = useState<string | null>(null);

  const updateData = useCallback((partial: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const goNext = useCallback(() => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(step);
      return next;
    });

    // Show encouragement toast
    if (step <= ENCOURAGEMENTS.length) {
      setEncouragement(ENCOURAGEMENTS[step - 1]);
      setTimeout(() => setEncouragement(null), 3000);
    }

    setStep((s) => Math.min(s + 1, 7));
  }, [step]);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  const handlePublish = useCallback(async () => {
    setSubmitting(true);
    setError(null);

    try {
      // Derive fulfillment_types from robots
      const allFulfillmentTypes = new Set<string>();
      for (const robot of data.robots) {
        for (const ft of robot.fulfillmentTypes) {
          allFulfillmentTypes.add(ft);
        }
      }

      // Derive verification tier
      let verificationTier = "basic";
      if (data.emailVerified && data.phoneVerified && data.identityMethod) {
        verificationTier = "verified";
      }
      if (verificationTier === "verified" && data.backgroundCheckConsent) {
        verificationTier = "premium";
      }

      // Build operating regions
      const operatingRegions = [
        { city: data.city, state: data.state },
        ...data.additionalCities,
      ];

      // Build robots array
      const robots = data.robots
        .filter((r) => r.name.trim() !== "")
        .map((r) => ({
          robot_id: r.robotId,
          custom_name: r.name,
          custom_manufacturer: r.manufacturer,
          custom_category: r.category,
          description: r.description,
          daily_rate: r.dailyRate ? parseFloat(r.dailyRate) : null,
          weekly_rate: r.weeklyRate ? parseFloat(r.weeklyRate) : null,
          monthly_rate: r.monthlyRate ? parseFloat(r.monthlyRate) : null,
          minimum_days: parseInt(r.minimumDays, 10) || 1,
          fulfillment_types: r.fulfillmentTypes,
          operator_included: r.operatorIncluded,
          remote_capable: r.remoteCapable,
          available: r.available,
          available_from: r.availableFrom || null,
          images: r.images,
        }));

      const payload = {
        company_name: data.companyName,
        description: data.bio,
        bio: data.bio,
        city: data.city,
        state: data.state,
        country: data.country,
        service_radius: data.serviceRadius,
        operating_regions: operatingRegions,
        specializations: data.specializations,
        fulfillment_types: Array.from(allFulfillmentTypes),
        website: data.website || null,
        linkedin: data.linkedin || null,
        profile_image: data.profileImageUrl || null,
        business_type: data.businessType,
        years_in_robotics: data.yearsInRobotics,
        phone: data.phoneNumber,
        phone_verified: data.phoneVerified,
        email_verified: data.emailVerified,
        verification_tier: verificationTier,
        specialization_levels: data.specializationLevels,
        task_specializations: data.taskSpecializations,
        robots,
      };

      const res = await fetch("/api/robowork/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.error || `Submission failed (${res.status})`
        );
      }

      setPublished(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }, [data]);

  if (published) {
    return <WizardCelebration companyName={data.companyName} />;
  }

  const stepProps = { data, updateData };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepBusinessBasics {...stepProps} />;
      case 2:
        return <StepServiceAreas {...stepProps} />;
      case 3:
        return <StepRobotFleet {...stepProps} />;
      case 4:
        return <StepSpecializations {...stepProps} />;
      case 5:
        return <StepVerification {...stepProps} />;
      case 6:
        return <StepPayment {...stepProps} />;
      case 7:
        return <StepPreview {...stepProps} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "2rem 1rem" }}>
      <WizardProgress currentStep={step} />

      {/* Encouragement toast */}
      {encouragement && (
        <div
          style={{
            padding: "0.75rem 1rem",
            marginBottom: "1.5rem",
            borderRadius: "0.5rem",
            backgroundColor: "rgba(14, 165, 233, 0.1)",
            border: "1px solid rgba(14, 165, 233, 0.3)",
            color: "#0EA5E9",
            fontSize: "0.875rem",
            fontWeight: 500,
            textAlign: "center",
            transition: "opacity 0.3s ease",
          }}
        >
          {encouragement}
        </div>
      )}

      {/* Active step */}
      <div style={{ minHeight: "400px" }}>{renderStep()}</div>

      {/* Error message */}
      {error && (
        <div
          style={{
            padding: "0.75rem 1rem",
            marginTop: "1rem",
            borderRadius: "0.5rem",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#EF4444",
            fontSize: "0.875rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Navigation buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "2rem",
          gap: "1rem",
        }}
      >
        <button
          onClick={goBack}
          disabled={step === 1}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            border: "1px solid var(--theme-border)",
            backgroundColor: "var(--theme-bg-secondary)",
            color: "var(--theme-text)",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: step === 1 ? "not-allowed" : "pointer",
            opacity: step === 1 ? 0.4 : 1,
            transition: "opacity 0.2s ease",
          }}
        >
          Back
        </button>

        {step < 7 ? (
          <button
            onClick={goNext}
            disabled={!canProceed(step, data)}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              border: "none",
              backgroundColor: canProceed(step, data)
                ? "#0EA5E9"
                : "var(--theme-border)",
              color: canProceed(step, data) ? "#fff" : "var(--theme-text-secondary)",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: canProceed(step, data) ? "pointer" : "not-allowed",
              transition: "background-color 0.2s ease",
            }}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handlePublish}
            disabled={submitting}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              border: "none",
              backgroundColor: submitting ? "var(--theme-border)" : "#0EA5E9",
              color: submitting ? "var(--theme-text-secondary)" : "#fff",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: submitting ? "not-allowed" : "pointer",
              transition: "background-color 0.2s ease",
            }}
          >
            {submitting ? "Publishing..." : "Publish My Profile"}
          </button>
        )}
      </div>
    </div>
  );
}
