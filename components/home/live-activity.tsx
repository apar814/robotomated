"use client";

import { useState, useEffect } from "react";

const ACTIVITIES = [
  "A logistics manager in Phoenix just compared 3 AMRs",
  "Someone in Chicago just posted a RoboWork pallet moving job",
  "A warehouse operator just earned RCO Foundation certification",
  "47 people browsing warehouse robots right now",
  "A manufacturer just requested Spot pricing",
  "Someone just asked Robotimus about humanoid robots",
  "A hospital in Boston is evaluating delivery robots",
  "12 new robots added to the database this week",
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
          className="inline-block shrink-0 rounded-full animate-pulse-live"
          style={{ width: 6, height: 6, background: "var(--status-success, #22C55E)" }}
        />
        <p
          className="transition-opacity duration-300"
          style={{
            fontFamily: "var(--font-ui, 'Space Grotesk'), sans-serif",
            fontWeight: 600,
            fontSize: "0.78rem",
            color: "var(--theme-text-muted)",
            opacity: visible ? 1 : 0,
          }}
        >
          {ACTIVITIES[index]}
        </p>
      </div>
    </div>
  );
}
