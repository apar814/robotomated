import type { Metadata } from "next";
import { MaintenanceEstimatorClient } from "@/components/tools/maintenance-estimator-client";

export const metadata: Metadata = {
  title: "Maintenance Cost Estimator — Plan Your Robot Budget | Robotomated",
  description:
    "Estimate annual maintenance costs, staffing needs, and compare in-house vs. service contract models for your robot fleet. Free interactive calculator.",
};

export default function MaintenanceEstimatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
          Maintenance Cost Estimator
        </h1>
        <p className="mt-3 font-mono text-sm text-text-tertiary">
          Plan your maintenance budget and staffing needs
        </p>
      </div>
      <MaintenanceEstimatorClient />
    </div>
  );
}
