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
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/30 mb-4">
        {heading}
      </h3>
      <ul className="space-y-0">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="text-[14px] text-white/50 hover:text-white transition-colors block py-1.5"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TwitterIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768" />
      <path d="M20 4l-7.364 7.364" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="dark bg-[#080808]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div>
            <span className="font-mono text-lg font-bold tracking-tight">
              <span className="text-white">ROBOTO</span>
              <span className="text-white/40">MATED</span>
              <span className="text-[#0EA5E9]">.</span>
            </span>
            <p className="mt-3 text-[14px] text-white/40 leading-relaxed">
              The operating system for robotics.
            </p>
            <div className="mt-5 flex items-center gap-4">
              <a
                href="#"
                className="text-white/30 hover:text-white transition-colors"
                aria-label="Twitter / X"
              >
                <TwitterIcon />
              </a>
              <a
                href="#"
                className="text-white/30 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
              <a
                href="#"
                className="text-white/30 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <YouTubeIcon />
              </a>
            </div>
          </div>

          {/* Intelligence */}
          <FooterColumn heading="Intelligence" links={INTELLIGENCE_LINKS} />

          {/* Acquire & Deploy */}
          <FooterColumn heading="Acquire & Deploy" links={ACQUIRE_LINKS} />

          {/* Operate & Transition */}
          <FooterColumn heading="Operate & Transition" links={OPERATE_LINKS} />

          {/* Company */}
          <FooterColumn heading="Company" links={COMPANY_LINKS} />
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-white/10 pt-8 flex flex-col items-center gap-4 text-center">
          <p className="text-[13px] text-white/30">
            &copy; 2026 Robotomated. The operating system for robotics. Built for buyers, not sellers.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-[13px] text-white/30 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-[13px] text-white/30 hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-[13px] text-white/30 hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
