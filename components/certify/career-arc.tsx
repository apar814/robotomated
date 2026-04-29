"use client";

import { useState } from "react";

const CAREER_STAGES = [
  {
    id: "foundation",
    title: "Foundation",
    salary: "$48-58K",
    timeline: "0-6 months",
    description: "Robot operator fundamentals. Safe startup, shutdown, basic fault diagnosis.",
    jobTitles: ["Robot Operator", "AMR Technician", "Warehouse Automation Specialist"],
    companiesHiring: ["Amazon Robotics", "FedEx", "DHL", "Target", "Walmart"],
    timeToAchieve: "3-5 weeks of study",
  },
  {
    id: "specialist",
    title: "Specialist",
    salary: "$65-85K",
    timeline: "6-18 months",
    description: "Deep domain expertise. Program, integrate, and resolve faults independently.",
    jobTitles: ["Robot Technician", "Integration Specialist", "Automation Engineer"],
    companiesHiring: ["Tesla", "Boston Dynamics", "Locus Robotics", "Universal Robots", "ABB"],
    timeToAchieve: "2-4 months of study",
  },
  {
    id: "master",
    title: "Master",
    salary: "$95-130K",
    timeline: "2-4 years",
    description: "Reprogram live, architect multi-robot systems, survive The Gauntlet.",
    jobTitles: ["Senior Robot Engineer", "Fleet Architect", "Technical Director"],
    companiesHiring: ["NVIDIA", "Google DeepMind", "Agility Robotics", "Figure AI", "Apptronik"],
    timeToAchieve: "4-8 months of study",
  },
  {
    id: "fleet-commander",
    title: "Fleet Commander",
    salary: "$140-180K",
    timeline: "5-8 years",
    description: "Lead large-scale automation operations across multiple facilities.",
    jobTitles: ["Head of Automation", "VP Operations", "Director of Robotics"],
    companiesHiring: ["Amazon", "Tesla", "Ocado", "Symbotic", "GXO Logistics"],
    timeToAchieve: "6-12 months of study + capstone",
  },
  {
    id: "cro",
    title: "Chief Robotics Officer",
    salary: "$200-350K",
    timeline: "8+ years",
    description: "Executive leadership. Shape the future of robotics at organizational scale.",
    jobTitles: ["Chief Robotics Officer", "Robotics Board Member", "Industry Advisor"],
    companiesHiring: ["Fortune 500", "Series B+ startups", "Government agencies", "Consulting firms"],
    timeToAchieve: "Portfolio defense + panel review",
  },
];

export function CareerArc() {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const activeStage = "foundation";

  return (
    <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-[#2563EB]">
          [ YOUR CAREER ARC ]
        </p>
        <h2 className="mb-3 text-center font-display text-2xl font-bold text-white sm:text-3xl">
          From Operator to Executive
        </h2>
        <p className="mx-auto mb-12 max-w-lg text-center text-sm text-muted">
          Each certification level maps to a concrete salary band and career outcome.
          Most students reach Master in 14 weeks.
        </p>

        {/* Desktop: Horizontal timeline */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-0 right-0 top-[39px] h-[2px] bg-border" />
            <div
              className="absolute left-0 top-[39px] h-[2px] bg-[#2563EB]/60"
              style={{ width: "10%" }}
            />

            {/* Nodes */}
            <div className="relative grid grid-cols-5 gap-2">
              {CAREER_STAGES.map((stage, i) => {
                const isActive = stage.id === activeStage;
                const isHovered = stage.id === hoveredStage;

                return (
                  <div
                    key={stage.id}
                    className="flex flex-col items-center"
                    onMouseEnter={() => setHoveredStage(stage.id)}
                    onMouseLeave={() => setHoveredStage(null)}
                  >
                    {/* Arrow connector (except first) */}
                    {i > 0 && (
                      <div className="absolute" style={{ left: `${(i * 20) - 2}%`, top: "35px" }}>
                        <svg className="h-3 w-3 text-border" viewBox="0 0 12 12" fill="currentColor">
                          <path d="M2 1l8 5-8 5z" />
                        </svg>
                      </div>
                    )}

                    {/* Node circle */}
                    <div
                      className={`relative z-10 flex h-[78px] w-[78px] cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-200 ${
                        isActive
                          ? "border-[#2563EB] bg-[#2563EB]/20 shadow-lg shadow-[#2563EB]/20"
                          : isHovered
                            ? "border-[#2563EB]/60 bg-[#2563EB]/10"
                            : "border-border bg-[#0A0A0A]"
                      }`}
                    >
                      <div className="text-center">
                        <p className={`font-[family-name:var(--font-mono)] text-xs font-bold ${
                          isActive ? "text-[#2563EB]" : isHovered ? "text-[#2563EB]/80" : "text-muted"
                        }`}>
                          L{i + 1}
                        </p>
                      </div>
                      {isActive && (
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#0A0F1E] bg-[#00E5A0]" />
                      )}
                    </div>

                    {/* Title */}
                    <p className={`mt-3 text-center text-sm font-bold transition-colors ${
                      isActive || isHovered ? "text-white" : "text-white/70"
                    }`}>
                      {stage.title}
                    </p>

                    {/* Salary */}
                    <p className={`mt-1 text-center font-[family-name:var(--font-mono)] text-xs font-semibold ${
                      isActive ? "text-[#00E5A0]" : "text-[#00E5A0]/60"
                    }`}>
                      {stage.salary}
                    </p>

                    {/* Timeline */}
                    <p className="mt-0.5 text-center text-[11px] text-muted">
                      {stage.timeline}
                    </p>

                    {/* Hover tooltip */}
                    {isHovered && (
                      <div className="absolute top-full z-20 mt-16 w-64 rounded-lg border border-border bg-[#0A0A0A] p-4 shadow-xl">
                        <p className="mb-2 text-xs text-muted">{stage.description}</p>

                        <div className="mb-2">
                          <p className="font-[family-name:var(--font-ui)] text-[10px] font-bold uppercase tracking-[0.1em] text-[#2563EB]">
                            Job Titles
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {stage.jobTitles.map((t) => (
                              <span key={t} className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mb-2">
                          <p className="font-[family-name:var(--font-ui)] text-[10px] font-bold uppercase tracking-[0.1em] text-[#2563EB]">
                            Companies Hiring
                          </p>
                          <p className="mt-0.5 text-[10px] text-muted">
                            {stage.companiesHiring.join(", ")}
                          </p>
                        </div>

                        <div>
                          <p className="font-[family-name:var(--font-ui)] text-[10px] font-bold uppercase tracking-[0.1em] text-[#2563EB]">
                            Time to Achieve
                          </p>
                          <p className="mt-0.5 text-[10px] text-muted">
                            {stage.timeToAchieve}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical timeline */}
        <div className="md:hidden">
          <div className="relative ml-4">
            {/* Vertical line */}
            <div className="absolute bottom-0 left-[15px] top-0 w-[2px] bg-border" />
            <div
              className="absolute left-[15px] top-0 w-[2px] bg-[#2563EB]/60"
              style={{ height: "12%" }}
            />

            <div className="space-y-6">
              {CAREER_STAGES.map((stage, i) => {
                const isActive = stage.id === activeStage;
                const isExpanded = stage.id === hoveredStage;

                return (
                  <div
                    key={stage.id}
                    className="relative flex gap-4"
                    onClick={() => setHoveredStage(isExpanded ? null : stage.id)}
                  >
                    {/* Node */}
                    <div
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                        isActive
                          ? "border-[#2563EB] bg-[#2563EB]/20"
                          : isExpanded
                            ? "border-[#2563EB]/60 bg-[#2563EB]/10"
                            : "border-border bg-[#0A0A0A]"
                      }`}
                    >
                      <span className={`font-[family-name:var(--font-mono)] text-[10px] font-bold ${
                        isActive || isExpanded ? "text-[#2563EB]" : "text-muted"
                      }`}>
                        L{i + 1}
                      </span>
                      {isActive && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0A0F1E] bg-[#00E5A0]" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <div className="flex items-baseline gap-3">
                        <p className={`text-sm font-bold ${isActive || isExpanded ? "text-white" : "text-white/70"}`}>
                          {stage.title}
                        </p>
                        <span className={`font-[family-name:var(--font-mono)] text-xs font-semibold ${
                          isActive ? "text-[#00E5A0]" : "text-[#00E5A0]/60"
                        }`}>
                          {stage.salary}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted">{stage.timeline}</p>

                      {isExpanded && (
                        <div className="mt-3 rounded-lg border border-border bg-[#0A0A0A] p-3">
                          <p className="mb-2 text-xs text-muted">{stage.description}</p>

                          <p className="font-[family-name:var(--font-ui)] text-[10px] font-bold uppercase tracking-[0.1em] text-[#2563EB]">
                            Job Titles
                          </p>
                          <div className="mt-1 mb-2 flex flex-wrap gap-1">
                            {stage.jobTitles.map((t) => (
                              <span key={t} className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted">
                                {t}
                              </span>
                            ))}
                          </div>

                          <p className="font-[family-name:var(--font-ui)] text-[10px] font-bold uppercase tracking-[0.1em] text-[#2563EB]">
                            Companies Hiring
                          </p>
                          <p className="mt-0.5 mb-2 text-[10px] text-muted">
                            {stage.companiesHiring.join(", ")}
                          </p>

                          <p className="font-[family-name:var(--font-ui)] text-[10px] font-bold uppercase tracking-[0.1em] text-[#2563EB]">
                            Time to Achieve
                          </p>
                          <p className="mt-0.5 text-[10px] text-muted">
                            {stage.timeToAchieve}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
