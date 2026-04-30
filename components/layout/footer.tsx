import Link from "next/link";

const PRODUCT_LINKS = [
  { href: "/explore", label: "Explore Robots" },
  { href: "/compare", label: "Compare" },
  { href: "/reviews", label: "Reviews" },
  { href: "/methodology", label: "RoboScore" },
  { href: "/tools/tco-calculator", label: "TCO Calculator" },
];

const PLATFORM_LINKS = [
  { href: "/robowork", label: "RoboWork" },
  { href: "/certify", label: "Certification" },
  { href: "/fleet", label: "Fleet Management" },
  { href: "/parts", label: "Parts Marketplace" },
  { href: "/market", label: "Market Intel" },
];

const RESOURCES_LINKS = [
  { href: "/service", label: "Service & Maintenance" },
  { href: "/developers", label: "Developers" },
  { href: "/manufacturers", label: "Manufacturers" },
  { href: "/status", label: "System Status" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/manufacturers/partner", label: "Partner with Us" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/independence", label: "Independence" },
  { href: "/sitemap", label: "Sitemap" },
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
      <h3 className="mb-4 font-[family-name:var(--font-body)] text-[12px] font-medium uppercase tracking-[0.12em] text-white">
        {heading}
      </h3>
      <ul className="space-y-0">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="block py-1.5 font-[family-name:var(--font-body)] text-[14px] font-normal text-[rgba(255,255,255,0.45)] transition-colors hover:text-white"
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
    <footer style={{ background: "#000000", borderTop: "1px solid #1F1F1F" }}>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
          <FooterColumn heading="Product" links={PRODUCT_LINKS} />
          <FooterColumn heading="Platform" links={PLATFORM_LINKS} />
          <FooterColumn heading="Resources" links={RESOURCES_LINKS} />
          <FooterColumn heading="Company" links={COMPANY_LINKS} />
          <FooterColumn heading="Legal" links={LEGAL_LINKS} />
        </div>

        {/* Bottom bar */}
        <div className="mt-16 border-t border-[#1F1F1F] pt-8">
          <p className="font-[family-name:var(--font-body)] text-[12px] text-[rgba(255,255,255,0.45)]">
            &copy; 2026 Robotomated. Independent. No manufacturer pays for scores or placement.
          </p>
        </div>
      </div>
    </footer>
  );
}
