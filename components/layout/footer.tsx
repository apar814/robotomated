import Link from "next/link";

const footerSections = [
  {
    title: "Platform",
    links: [
      { href: "/explore", label: "Explore Robots" },
      { href: "/reviews", label: "Reviews" },
      { href: "/advisor", label: "AI Advisor" },
      { href: "/learn", label: "Learn" },
      { href: "/market", label: "Marketplace" },
    ],
  },
  {
    title: "Guides",
    links: [
      { href: "/best/consumer", label: "Best Consumer Robots" },
      { href: "/best/warehouse", label: "Best Warehouse Robots" },
      { href: "/best/manufacturing", label: "Best Manufacturing Robots" },
      { href: "/guides/how-roboscore-works", label: "How RoboScore Works" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/guides/how-roboscore-works", label: "Methodology" },
      { href: "/contact", label: "Contact" },
      { href: "/sitemap.xml", label: "Sitemap" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-navy">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-lg font-bold tracking-tight">
              robo<span className="text-blue">tomated</span>
            </span>
            <p className="mt-2 text-sm text-muted">
              The intelligence layer for the robotics era.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {section.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {section.links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted">
          &copy; {new Date().getFullYear()} Robotomated. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
