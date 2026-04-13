import Link from "next/link";

const INTELLIGENCE_LINKS = [
  { href: "/explore", label: "Explore Robots" },
  { href: "/compare", label: "Compare" },
  { href: "/methodology", label: "RoboScore Methodology" },
  { href: "/market", label: "Market Intel" },
  { href: "/tools/tco-calculator", label: "TCO Calculator" },
  { href: "/reviews", label: "Reviews" },
];

const ACQUIRE_LINKS = [
  { href: "/explore", label: "Buy a Robot" },
  { href: "/lease", label: "Lease a Robot" },
  { href: "/cpo", label: "Certified Pre-Owned" },
  { href: "/robowork", label: "RoboWork" },
  { href: "/robowork/providers", label: "Find an RSP" },
  { href: "/robowork/post", label: "Post a Job" },
];

const OPERATE_LINKS = [
  { href: "/service", label: "Service & Maintenance" },
  { href: "/parts", label: "Parts Marketplace" },
  { href: "/insure", label: "Robot Insurance" },
  { href: "/trade-in", label: "Trade In Your Robot" },
  { href: "/certify", label: "Get Certified (RCO)" },
  { href: "/fleet", label: "Fleet Management" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/manufacturers", label: "Manufacturers" },
  { href: "/manufacturers/partner", label: "Partner with Us" },
  { href: "/developers", label: "Developers / API" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/careers", label: "Careers" },
  { href: "/sitemap", label: "Sitemap" },
  { href: "/status", label: "System Status" },
];

function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-white/45">
        {heading}
      </h3>
      <ul className="space-y-0">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="group block py-1.5 font-[family-name:var(--font-ui)] text-[13px] text-white/50 transition-colors hover:text-white"
            >
              <span className="inline-flex items-center gap-1">
                {link.label}
                <svg
                  className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TwitterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768" />
      <path d="M20 4l-7.364 7.364" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="dark" style={{ background: "linear-gradient(180deg, rgba(4,6,14,0.98) 0%, #020209 100%)", borderTop: "1px solid rgba(255,255,255,0.06)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)" }}>
      {/* Top divider with gradient fade */}
      <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div>
            <span className="font-[family-name:var(--font-brand)] text-lg font-bold tracking-[0.04em]">
              <span className="text-white">ROBOTO</span>
              <span className="text-white/40">MATED</span>
              <span className="text-[#2563EB]">.</span>
            </span>
            <p className="mt-3 text-[13px] leading-relaxed text-white/50">
              The world is going to run on robots.<br />We make the world&apos;s robots run.
            </p>
            <div className="mt-5 flex items-center gap-4">
              <a href="https://x.com/robotomated" target="_blank" rel="noopener noreferrer" className="text-white/50 transition-colors hover:text-white" aria-label="X (Twitter)">
                <TwitterIcon />
              </a>
              <a href="https://linkedin.com/company/robotomated" target="_blank" rel="noopener noreferrer" className="text-white/50 transition-colors hover:text-white" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
              <a href="https://youtube.com/@robotomated" target="_blank" rel="noopener noreferrer" className="text-white/50 transition-colors hover:text-white" aria-label="YouTube">
                <YouTubeIcon />
              </a>
            </div>
          </div>

          <FooterColumn heading="Intelligence" links={INTELLIGENCE_LINKS} />
          <FooterColumn heading="Acquire & Deploy" links={ACQUIRE_LINKS} />
          <FooterColumn heading="Operate & Transition" links={OPERATE_LINKS} />
          <FooterColumn heading="Company" links={COMPANY_LINKS} />
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center gap-4 border-t border-white/[0.06] pt-8 text-center">
          <p className="font-[family-name:var(--font-ui)] text-[12px] text-white/45">
            &copy; 2026 Robotomated. Independent. No manufacturer pays for scores or placement. Built for buyers, not sellers.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-[12px] text-white/45 transition-colors hover:text-white">
              About
            </Link>
            <Link href="/methodology" className="text-[12px] text-white/45 transition-colors hover:text-white">
              Methodology
            </Link>
            <Link href="/pricing" className="text-[12px] text-white/45 transition-colors hover:text-white">
              Pricing
            </Link>
            <Link href="/independence" className="text-[12px] text-white/45 transition-colors hover:text-white">
              Independence
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
