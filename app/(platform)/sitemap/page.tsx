import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sitemap — Robotomated",
  description:
    "Complete directory of all pages on Robotomated — the operating system for robotics.",
  robots: { index: true, follow: true },
};

interface SitemapSection {
  title: string;
  links: { href: string; label: string }[];
}

const sections: SitemapSection[] = [
  {
    title: "Intelligence",
    links: [
      { href: "/explore", label: "Explore Robots" },
      { href: "/explore/warehouse", label: "Warehouse Robots" },
      { href: "/explore/medical", label: "Medical Robots" },
      { href: "/explore/manufacturing", label: "Manufacturing Robots" },
      { href: "/explore/agricultural", label: "Agricultural Robots" },
      { href: "/explore/security", label: "Security Robots" },
      { href: "/explore/hospitality", label: "Hospitality Robots" },
      { href: "/explore/construction", label: "Construction Robots" },
      { href: "/explore/consumer", label: "Consumer Robots" },
      { href: "/compare", label: "Compare Robots" },
      { href: "/reviews", label: "Reviews" },
      { href: "/methodology", label: "Scoring Methodology" },
      { href: "/market", label: "Market Intelligence" },
      { href: "/market/funding", label: "Funding Tracker" },
      { href: "/market/investors", label: "Investor Directory" },
      { href: "/market/reports", label: "Market Reports" },
      { href: "/humanoid", label: "Humanoid Intelligence Hub" },
      { href: "/manufacturers", label: "Manufacturers" },
    ],
  },
  {
    title: "Acquire",
    links: [
      { href: "/find-my-robot", label: "Find My Robot Wizard" },
      { href: "/lease", label: "Lease a Robot" },
      { href: "/lease/quote", label: "Lease Calculator" },
      { href: "/lease/transfer", label: "Lease Transfer" },
      { href: "/lease/timeshare", label: "Robot Timeshare" },
      { href: "/cpo", label: "Certified Pre-Owned" },
      { href: "/finance", label: "Robot Financing" },
      { href: "/insure", label: "Robot Insurance" },
    ],
  },
  {
    title: "Deploy",
    links: [
      { href: "/robowork", label: "RoboWork Marketplace" },
      { href: "/robowork/jobs", label: "Browse Jobs" },
      { href: "/robowork/providers", label: "Find an RSP" },
      { href: "/robowork/post", label: "Post a Job" },
      { href: "/robowork/providers/register", label: "Become a Provider" },
      { href: "/robowork/founding-rsp", label: "Founding RSP Program" },
      { href: "/robowork/referrals", label: "Referral Program" },
    ],
  },
  {
    title: "Operate",
    links: [
      { href: "/service", label: "Service & Maintenance" },
      { href: "/parts", label: "Parts Marketplace" },
      { href: "/trade-in", label: "Trade-In Tool" },
      { href: "/fleet", label: "Fleet Management" },
      { href: "/certify", label: "Certification Hub (RCO)" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/learn", label: "Intelligence Library" },
      { href: "/case-studies", label: "Case Studies" },
      { href: "/news", label: "Industry News" },
      { href: "/newsletter", label: "Newsletter" },
      { href: "/standards", label: "Safety Standards" },
      { href: "/eldercare", label: "Eldercare Robotics" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/tools/tco-calculator", label: "TCO Calculator" },
      { href: "/tools/robot-economics", label: "Robot Economics Calculator" },
      { href: "/tools/robot-finder", label: "Robot Finder" },
      { href: "/tools/maintenance-estimator", label: "Maintenance Estimator" },
      { href: "/tools/humanoid-comparison", label: "Humanoid Comparison" },
      { href: "/advisor", label: "Robotimus AI Advisor" },
    ],
  },
  {
    title: "Business",
    links: [
      { href: "/enterprise", label: "Enterprise" },
      { href: "/manufacturers/partner", label: "Manufacturer Partner Program" },
      { href: "/manufacturers/claim", label: "Claim Your Profile" },
      { href: "/developers", label: "Developer Portal" },
      { href: "/pro", label: "Robotomated Pro" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About & Mission" },
      { href: "/careers", label: "Careers" },
      { href: "/status", label: "System Status" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <p className="mb-3 font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">
            [ SITEMAP ]
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
            All Pages
          </h1>
          <p className="max-w-xl font-[family-name:var(--font-ui)] text-base text-[var(--color-text-secondary)]">
            Complete directory of every page on Robotomated.
          </p>
        </div>

        {/* Sections Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="mb-4 font-[family-name:var(--font-brand)] text-[11px] font-medium uppercase tracking-[0.12em] text-[#2563EB]">
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-[family-name:var(--font-ui)] text-[13px] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* XML Sitemap Link */}
        <div className="mt-16 border-t border-[var(--color-border)] pt-8">
          <p className="font-[family-name:var(--font-ui)] text-xs text-[var(--color-text-muted)]">
            For search engines:{" "}
            <a
              href="/sitemap.xml"
              className="text-[#2563EB] hover:underline"
            >
              sitemap.xml
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
