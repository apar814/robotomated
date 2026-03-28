import Link from "next/link";

const PLATFORM_LINKS = [
  { href: "/explore", label: "Explore Robots" },
  { href: "/compare", label: "Compare" },
  { href: "/reviews", label: "Reviews" },
  { href: "/advisor", label: "AI Advisor" },
  { href: "/market-intelligence", label: "Market Intelligence" },
];

const RESOURCE_LINKS = [
  { href: "/learn", label: "Learn" },
  { href: "/methodology", label: "Methodology" },
  { href: "/reports", label: "Industry Reports" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/guides", label: "Buyer's Guides" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/careers", label: "Careers" },
  { href: "/press", label: "Press" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
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
      <h3 className="font-mono text-[9px] font-bold uppercase tracking-widest text-text-ghost">
        {heading}
      </h3>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-xs text-text-tertiary transition-colors hover:text-text-secondary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-carbon">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <span className="font-mono text-base font-bold tracking-tight text-text-primary">
              ROBOTOMATED.
            </span>
            <p className="mt-2 text-xs text-text-tertiary">
              The Bloomberg Terminal for Robotics
            </p>
            <Link
              href="/advisor"
              className="mt-3 inline-block text-xs text-electric-blue transition-colors hover:text-electric-blue/80"
            >
              Start AI Advisor &rarr;
            </Link>
          </div>

          {/* Platform */}
          <FooterColumn heading="PLATFORM" links={PLATFORM_LINKS} />

          {/* Resources */}
          <FooterColumn heading="RESOURCES" links={RESOURCE_LINKS} />

          {/* Company */}
          <FooterColumn heading="COMPANY" links={COMPANY_LINKS} />
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border-subtle pt-6 sm:flex-row">
          <p className="font-mono text-[9px] tracking-wider text-text-ghost">
            &copy; 2026 ROBOTOMATED
          </p>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-lime" />
            <span className="font-mono text-[9px] tracking-wider text-lime">
              ALL SYSTEMS NOMINAL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
