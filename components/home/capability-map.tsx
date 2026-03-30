"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CapabilityRadar, type CapabilityData } from "./capability-radar";

const CATEGORY_DATA: Record<string, CapabilityData> = {
  all: { speed: 62, payload: 58, intelligence: 71, precision: 68, endurance: 73, versatility: 65 },
  warehouse: { speed: 70, payload: 75, intelligence: 68, precision: 62, endurance: 82, versatility: 55 },
  medical: { speed: 35, payload: 30, intelligence: 88, precision: 95, endurance: 70, versatility: 45 },
  manufacturing: { speed: 55, payload: 80, intelligence: 65, precision: 90, endurance: 85, versatility: 60 },
  agricultural: { speed: 45, payload: 65, intelligence: 60, precision: 55, endurance: 90, versatility: 50 },
  construction: { speed: 40, payload: 90, intelligence: 55, precision: 50, endurance: 75, versatility: 45 },
  delivery: { speed: 85, payload: 40, intelligence: 75, precision: 60, endurance: 65, versatility: 40 },
};

const CATEGORY_META: Record<string, { label: string; robotCount: number }> = {
  all: { label: "All Robots", robotCount: 247 },
  warehouse: { label: "Warehouse", robotCount: 62 },
  medical: { label: "Medical", robotCount: 38 },
  manufacturing: { label: "Manufacturing", robotCount: 54 },
  agricultural: { label: "Agricultural", robotCount: 29 },
  construction: { label: "Construction", robotCount: 31 },
  delivery: { label: "Delivery", robotCount: 33 },
};

const CATEGORIES = ["all", "warehouse", "medical", "manufacturing", "agricultural", "construction", "delivery"] as const;

export function CapabilityMap() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const data = CATEGORY_DATA[activeCategory];
  const meta = CATEGORY_META[activeCategory];

  return (
    <section
      ref={sectionRef}
      className="px-6 py-20"
      style={{
        background: "#080808",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
      }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section label */}
        <div className="mb-6 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
          <span className="font-mono text-[13px] uppercase tracking-widest text-ghost">
            Robotics Capability Map
          </span>
        </div>

        {/* Category filter pills */}
        <div className="mb-10 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-[rgba(14,165,233,0.15)] text-[#0EA5E9]"
                  : "bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.45)] hover:bg-[rgba(255,255,255,0.08)] hover:text-[rgba(255,255,255,0.6)]"
              }`}
            >
              {CATEGORY_META[cat].label}
            </button>
          ))}
        </div>

        {/* Radar chart */}
        <div className="flex justify-center">
          <CapabilityRadar data={data} activeCategory={activeCategory} />
        </div>

        {/* Stats row */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="font-mono text-[13px] text-[rgba(255,255,255,0.35)]">
            Based on{" "}
            <span className="font-bold text-[#0EA5E9]">{meta.robotCount}</span>{" "}
            {activeCategory === "all" ? "robots" : `${meta.label.toLowerCase()} robots`}
          </span>
        </div>

        {/* CTA */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/explore?sort=robo_score"
            className="inline-flex items-center gap-2 rounded-lg bg-electric-blue px-6 py-3 text-[14px] font-bold text-black transition-shadow hover:shadow-[0_0_24px_rgba(14,165,233,0.35)]"
          >
            Most capable robots
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
