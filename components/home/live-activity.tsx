"use client";

import { useState, useEffect } from "react";

const ACTIVITIES = [
  "A logistics manager in Chicago just compared 3 AMRs",
  "A warehouse in Dallas just posted a RoboWork job",
  "An operations director is evaluating surgical robots",
  "A manufacturer in Detroit just ran a TCO analysis",
  "Someone started RCO Level 1 certification",
  "A hospital in Boston is comparing delivery robots",
  "An RSP in Atlanta just submitted a bid on a cleaning job",
  "47 people are browsing warehouse robots right now",
];

export function LiveActivity() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % ACTIVITIES.length);
        setVisible(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-b px-6 py-2.5" style={{ borderColor: "var(--theme-border)", background: "var(--theme-section-alt)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"
          style={{ animation: "pulse 2s infinite" }}
        />
        <p
          className="text-[0.75rem] font-medium tracking-wide transition-opacity duration-300"
          style={{ color: "var(--theme-text-muted)", opacity: visible ? 1 : 0 }}
        >
          {ACTIVITIES[index]}
        </p>
      </div>
    </div>
  );
}
