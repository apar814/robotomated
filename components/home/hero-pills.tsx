"use client";

import Link from "next/link";

const JOB_PILLS = [
  { label: "Move Materials", href: "/advisor?q=I%20need%20to%20automate%20material%20movement%20and%20pallet%20transport%20in%20my%20facility" },
  { label: "Clean Facilities", href: "/advisor?q=I%20need%20a%20robot%20to%20clean%20floors%20in%20my%20facility%20autonomously" },
  { label: "Assemble & Weld", href: "/advisor?q=I%20need%20a%20cobot%20for%20manufacturing%20assembly%20or%20welding%20tasks" },
  { label: "Harvest Crops", href: "/advisor?q=I%20need%20agricultural%20robots%20for%20harvesting%20or%20crop%20management" },
  { label: "Security Patrol", href: "/advisor?q=I%20need%20autonomous%20security%20patrol%20robots%20for%20my%20facility" },
  { label: "Medical & Surgical", href: "/advisor?q=I%20need%20medical%20or%20surgical%20robots%20for%20healthcare%20applications" },
  { label: "Internal Delivery", href: "/advisor?q=I%20need%20robots%20for%20internal%20delivery%20or%20last-mile%20logistics" },
  { label: "Inspect & Survey", href: "/advisor?q=I%20need%20robots%20for%20inspection%20surveying%20or%20quality%20control" },
];

export function HeroPills() {
  return (
    <div>
      <p
        style={{
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase" as const,
          color: "var(--theme-text-muted)",
          marginBottom: "0.75rem",
        }}
      >
        Or choose a job type
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
        {JOB_PILLS.map((pill) => (
          <Link
            key={pill.label}
            href={pill.href}
            className="group"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.65rem 1.4rem",
              minHeight: "42px",
              minWidth: "140px",
              background: "var(--theme-tag-bg, rgba(255,255,255,0.05))",
              border: "1px solid var(--theme-border)",
              borderRadius: "4px",
              color: "var(--theme-text-primary)",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase" as const,
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseOver={(e) => {
              const t = e.currentTarget;
              t.style.background = "rgba(255,255,255,0.2)";
              t.style.borderColor = "rgba(255,255,255,0.2)";
              t.style.color = "#FFFFFF";
              t.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              const t = e.currentTarget;
              t.style.background = "rgba(255,255,255,0.05)";
              t.style.borderColor = "rgba(255,255,255,0.2)";
              t.style.color = "#F0F4FF";
              t.style.transform = "translateY(0)";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.97)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
          >
            {pill.label}
            <span
              style={{
                display: "inline-block",
                transition: "transform 0.15s ease",
              }}
              className="group-hover:translate-x-[3px]"
            >
              &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
