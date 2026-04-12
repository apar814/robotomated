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
      <p className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.1em]" style={{ color: "rgba(240,244,255,0.35)" }}>
        Or pick a job type:
      </p>
      <div className="flex flex-wrap gap-2">
        {JOB_PILLS.map((pill) => (
          <Link
            key={pill.label}
            href={pill.href}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-sm px-[1.1rem] py-[0.5rem] text-[0.72rem] font-bold uppercase tracking-[0.04em] transition-all duration-150 hover:scale-[1.02] active:scale-[0.97]"
            style={{
              background: "rgba(37,99,235,0.08)",
              border: "1px solid rgba(37,99,235,0.25)",
              color: "#60A5FA",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(37,99,235,0.18)";
              e.currentTarget.style.borderColor = "rgba(37,99,235,0.5)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(37,99,235,0.08)";
              e.currentTarget.style.borderColor = "rgba(37,99,235,0.25)";
            }}
          >
            {pill.label} &rarr;
          </Link>
        ))}
      </div>
    </div>
  );
}
