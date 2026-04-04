"use client";

import Link from "next/link";

interface Channel {
  number: string;
  name: string;
  accent: string;
  tagline: string;
  bullets: string[];
  cta: string;
  href: string;
  icon: React.ReactNode;
}

const CHANNELS: Channel[] = [
  {
    number: "01",
    name: "INTELLIGENCE",
    accent: "#0EA5E9",
    tagline: "Know before you buy.",
    bullets: [
      "Compare 305 robots side by side",
      "AI-powered RoboScore on every robot",
      "5-year TCO calculator",
      "Ask Robotimus anything",
    ],
    cta: "Explore Robots",
    href: "/explore",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 20V10" />
        <path d="M12 20V4" />
        <path d="M6 20v-6" />
      </svg>
    ),
  },
  {
    number: "02",
    name: "ACQUIRE",
    accent: "#C8FF00",
    tagline: "Buy or lease the right robot.",
    bullets: [
      "Purchase outright from manufacturers",
      "Lease from $X,XXX/month",
      "Certified pre-owned at 40-60% off",
      "AI-matched to your operation",
    ],
    cta: "Find My Robot",
    href: "/find-my-robot",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    number: "03",
    name: "DEPLOY",
    accent: "#A78BFA",
    tagline: "Get it working from day one.",
    bullets: [
      "Post a job, get bids in 24 hours",
      "Verified Robot Service Providers",
      "With operator, drop-off, or remote",
      "Pay for outcomes, not equipment",
    ],
    cta: "Post a Job",
    href: "/robowork/post",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    number: "04",
    name: "OPERATE",
    accent: "#34D399",
    tagline: "Keep it running. Keep it productive.",
    bullets: [
      "Certified maintenance network",
      "Parts marketplace (OEM + aftermarket)",
      "Robot fleet management dashboard",
      "RCO operator certification program",
    ],
    cta: "Find Service",
    href: "/service",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
  {
    number: "05",
    name: "TRANSITION",
    accent: "#FF006E",
    tagline: "Every robot has a next chapter.",
    bullets: [
      "AI-powered instant trade-in valuation",
      "Certified pre-owned marketplace",
      "Lease transfer marketplace",
      "Robot time-sharing",
    ],
    cta: "Value My Robot",
    href: "/trade-in",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M23 4v6h-6" />
        <path d="M1 20v-6h6" />
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10" />
        <path d="M20.49 15a9 9 0 01-14.85 3.36L1 14" />
      </svg>
    ),
  },
];

function ChannelCard({ channel }: { channel: Channel }) {
  return (
    <Link
      href={channel.href}
      className="group relative flex flex-col rounded-xl border border-[var(--theme-border)] p-7 transition-all duration-200 ease-out hover:scale-[1.02]"
      style={{
        backgroundColor: "var(--theme-card, #111111)",
        borderLeft: `3px solid ${channel.accent}`,
        // Box shadow applied via inline style for accent color
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = channel.accent;
        el.style.boxShadow = `0 0 24px ${channel.accent}20, 0 4px 16px ${channel.accent}10`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "var(--theme-border)";
        el.style.borderLeft = `3px solid ${channel.accent}`;
        el.style.boxShadow = "none";
      }}
    >
      {/* Number */}
      <span
        className="mb-4 font-mono text-xs tracking-wider"
        style={{ color: `${channel.accent}80` }}
      >
        {channel.number}
      </span>

      {/* Icon */}
      <div className="mb-4" style={{ color: channel.accent }}>
        {channel.icon}
      </div>

      {/* Name */}
      <h3
        className="mb-1 text-lg font-bold tracking-wide"
        style={{ color: "var(--theme-text-primary, #FFFFFF)" }}
      >
        {channel.name}
      </h3>

      {/* Tagline */}
      <p
        className="mb-5 text-sm"
        style={{ color: "var(--theme-text-secondary, #A0A0A0)" }}
      >
        {channel.tagline}
      </p>

      {/* Bullets */}
      <ul className="mb-6 flex flex-1 flex-col gap-2.5">
        {channel.bullets.map((bullet) => (
          <li
            key={bullet}
            className="flex items-start gap-2 text-[13px] leading-snug"
            style={{ color: "var(--theme-text-secondary, #A0A0A0)" }}
          >
            <span
              className="mt-1.5 block h-1 w-1 shrink-0 rounded-full"
              style={{ backgroundColor: channel.accent }}
            />
            {bullet}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div
        className="flex items-center gap-1.5 text-[13px] font-semibold"
        style={{ color: channel.accent }}
      >
        {channel.cta}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-200 group-hover:translate-x-1"
        >
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

export default function ChannelShowcase() {
  return (
    <section
      className="w-full py-20 md:py-28"
      style={{ backgroundColor: "var(--theme-bg, #080808)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <h2
            className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: "var(--theme-text-primary, #FFFFFF)" }}
          >
            One platform. Five ways to access robotic automation.
          </h2>
          <p
            className="text-base leading-relaxed sm:text-lg"
            style={{ color: "var(--theme-text-secondary, #A0A0A0)" }}
          >
            Whether you want to own, lease, hire, operate, or transition --
            Robotomated serves every stage of the robot lifecycle.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {CHANNELS.map((channel) => (
            <ChannelCard key={channel.number} channel={channel} />
          ))}
        </div>
      </div>
    </section>
  );
}
