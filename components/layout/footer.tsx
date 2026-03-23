import Link from "next/link";

export function Footer() {
  return (
    <footer className="dark-section relative border-t border-white/[0.06] bg-carbon">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <span className="font-display text-lg font-bold tracking-tight">
              <span className="text-glow">R</span>obo<span className="text-blue">tomated</span>
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Find, compare, and buy the right robot for any job.
            </p>
          </div>

          {/* Browse by Category */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">Categories</h3>
            <ul className="mt-4 space-y-2">
              {[
                { slug: "manufacturing", label: "Cobots & Industrial" },
                { slug: "warehouse", label: "Warehouse" },
                { slug: "consumer", label: "Consumer & Home" },
                { slug: "medical", label: "Medical" },
                { slug: "construction", label: "Construction" },
                { slug: "agricultural", label: "Agricultural" },
                { slug: "delivery", label: "Delivery" },
                { slug: "drone", label: "Drones" },
              ].map((c) => (
                <li key={c.slug}>
                  <Link href={`/explore/${c.slug}`} className="text-sm text-muted/60 hover:text-foreground">{c.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Brands */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">Top Brands</h3>
            <ul className="mt-4 space-y-2">
              {[
                { slug: "universal-robots", label: "Universal Robots" },
                { slug: "boston-dynamics", label: "Boston Dynamics" },
                { slug: "unitree-robotics", label: "Unitree" },
                { slug: "dji", label: "DJI" },
                { slug: "intuitive-surgical", label: "Intuitive Surgical" },
                { slug: "fanuc", label: "FANUC" },
                { slug: "roborock", label: "Roborock" },
                { slug: "abb-robotics", label: "ABB Robotics" },
              ].map((m) => (
                <li key={m.slug}>
                  <Link href={`/manufacturers/${m.slug}`} className="text-sm text-muted/60 hover:text-foreground">{m.label}</Link>
                </li>
              ))}
              <li><Link href="/manufacturers" className="text-sm text-blue hover:underline">All Brands &rarr;</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/advisor" className="text-sm text-muted/60 hover:text-foreground">Robot Advisor</Link></li>
              <li><Link href="/reviews" className="text-sm text-muted/60 hover:text-foreground">Reviews</Link></li>
              <li><Link href="/methodology" className="text-sm text-muted/60 hover:text-foreground">Scoring Methodology</Link></li>
              <li><Link href="/learn" className="text-sm text-muted/60 hover:text-foreground">Learn</Link></li>
              <li><Link href="/portal" className="text-sm text-muted/60 hover:text-foreground">List Your Robot</Link></li>
              <li><Link href="/pro" className="text-sm text-muted/60 hover:text-foreground">Pro Subscription</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 sm:flex-row">
          <p className="text-xs text-muted/50">
            &copy; {new Date().getFullYear()} Robotomated. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-muted/50 hover:text-muted">Privacy</Link>
            <Link href="/terms" className="text-xs text-muted/50 hover:text-muted">Terms</Link>
            <Link href="/sitemap.xml" className="text-xs text-muted/50 hover:text-muted">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
