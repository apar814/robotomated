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
    accent: "#2563EB",
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
      </svg>
    ),
  },
  {
    number: "02",
    name: "ACQUIRE",
    accent: "#22C55E",
    tagline: "Buy or lease the right robot.",
    bullets: [
      "Purchase outright from manufacturers",
      "Lease from $1,500/month",
      "Certified pre-owned at 40-60% off",
      "AI-matched to your operation",
    ],
    cta: "Find My Robot",
    href: "/find-my-robot",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    number: "03",
    name: "DEPLOY",
    accent: "#8B5CF6",
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    number: "04",
    name: "OPERATE",
    accent: "#F59E0B",
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
  {
    number: "05",
    name: "TRANSITION",
    accent: "#EC4899",
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 4v6h-6" /><path d="M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10" /><path d="M20.49 15a9 9 0 01-14.85 3.36L1 14" />
      </svg>
    ),
  },
];

function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  e.currentTarget.style.setProperty("--holo-x", `${x}%`);
  e.currentTarget.style.setProperty("--holo-y", `${y}%`);
  e.currentTarget.style.setProperty("--holo-opacity", "1");
}

function handleMouseLeave(e: React.MouseEvent<HTMLElement>) {
  e.currentTarget.style.setProperty("--holo-opacity", "0");
}

function ChannelCard({ channel }: { channel: Channel }) {
  return (
    <Link
      href={channel.href}
      className="card-2080 holo-card channel-glow morphing-border group relative flex flex-col overflow-hidden"
      style={{
        borderTop: `2px solid ${channel.accent}`,
        padding: "28px 24px",
        ["--channel-color" as string]: `${channel.accent}1F`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Channel number */}
      <span
        className="relative mb-5 font-[family-name:var(--font-brand)] text-[10px] font-medium tracking-[0.15em]"
        style={{ color: `${channel.accent}99` }}
      >
        {channel.number}
      </span>

      {/* Icon container */}
      <div
        className="breathing relative mb-4 inline-flex h-[42px] w-[42px] items-center justify-center rounded-[10px]"
        style={{
          background: `${channel.accent}1A`,
          border: `1px solid ${channel.accent}33`,
          color: channel.accent,
        }}
      >
        {channel.icon}
      </div>

      {/* Channel name */}
      <h3 className="relative mb-2 font-[family-name:var(--font-brand)] text-[13px] font-bold tracking-[0.08em] text-white">
        {channel.name}
      </h3>

      {/* Tagline */}
      <p className="relative mb-5 font-[family-name:var(--font-ui)] text-[13px] text-white/45">
        {channel.tagline}
      </p>

      {/* Bullet items */}
      <ul className="relative mb-6 flex flex-1 flex-col gap-0">
        {channel.bullets.map((bullet) => (
          <li
            key={bullet}
            className="relative pl-3.5 font-[family-name:var(--font-ui)] text-[12px] leading-[2.0] text-white/55"
          >
            <span
              className="absolute left-0 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full"
              style={{ backgroundColor: channel.accent }}
            />
            {bullet}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div
        className="relative mt-auto flex items-center gap-1.5 pt-5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <span
          className="relative font-[family-name:var(--font-brand)] text-[10px] tracking-[0.1em]"
          style={{ color: channel.accent }}
        >
          {channel.cta}
          {/* Underline that grows from left on hover */}
          <span
            className="absolute bottom-0 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
            style={{ backgroundColor: channel.accent }}
          />
        </span>
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
          style={{ color: channel.accent }}
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
    <section className="w-full py-20 md:py-28" style={{ backgroundColor: "var(--theme-bg)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 flex items-center gap-2 font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">
            <span className="inline-block h-px w-6 bg-[#2563EB]" />
            Platform Channels
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--theme-text-primary)] sm:text-4xl">
            One platform. Five ways to access robotic automation.
          </h2>
          <p className="max-w-[580px] font-[family-name:var(--font-ui)] text-base leading-[1.7] text-[var(--theme-text-secondary)]">
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
