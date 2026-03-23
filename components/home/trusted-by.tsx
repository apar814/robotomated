"use client";

import { CompanyLogo } from "@/components/ui/company-logo";

const FEATURED_COMPANIES = [
  { name: "Boston Dynamics" },
  { name: "Universal Robots" },
  { name: "Intuitive Surgical" },
  { name: "FANUC" },
  { name: "ABB Robotics" },
  { name: "DJI" },
  { name: "Figure AI" },
  { name: "Unitree" },
  { name: "iRobot" },
  { name: "Roborock" },
  { name: "Stryker" },
  { name: "KUKA" },
  { name: "John Deere" },
  { name: "NVIDIA" },
  { name: "Agility Robotics" },
  { name: "Skydio" },
];

export function TrustedBy() {
  return (
    <section className="border-y border-white/[0.05] bg-carbon/50 py-8">
      <p className="mb-6 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
        Featuring robots from leading manufacturers
      </p>
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll gap-12 px-4">
          {[...FEATURED_COMPANIES, ...FEATURED_COMPANIES].map((company, i) => (
            <div key={`${company.name}-${i}`} className="flex flex-shrink-0 items-center gap-3 opacity-60 transition-opacity hover:opacity-100">
              <CompanyLogo name={company.name} size={32} />
              <span className="whitespace-nowrap text-sm text-white/50">{company.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
