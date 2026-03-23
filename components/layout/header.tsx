"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { UserMenu } from "@/components/auth/user-menu";

const categories = [
  { slug: "manufacturing", name: "Manufacturing & Cobots" },
  { slug: "warehouse", name: "Warehouse & Logistics" },
  { slug: "consumer", name: "Consumer & Home" },
  { slug: "medical", name: "Medical & Healthcare" },
  { slug: "construction", name: "Construction" },
  { slug: "agricultural", name: "Agricultural" },
  { slug: "delivery", name: "Delivery & Last-Mile" },
  { slug: "drone", name: "Drones & Aerial" },
  { slug: "software", name: "Software & Infrastructure" },
];

const navLinks = [
  { href: "/explore", label: "Browse Robots" },
  { href: "/manufacturers", label: "Brands" },
  { href: "/reviews", label: "Reviews" },
  { href: "/learn", label: "Learn" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    }
    if (catOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [catOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-navy/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            <span className="text-glow">R</span>obo<span className="text-blue">tomated</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {/* Categories dropdown */}
          <div ref={catRef} className="relative">
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="group flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              Categories
              <svg className={`h-3 w-3 transition-transform ${catOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {catOpen && (
              <div className="absolute left-0 top-10 z-50 w-64 rounded-xl border border-white/[0.08] bg-navy-light/95 py-2 shadow-xl backdrop-blur-xl">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/explore/${cat.slug}`}
                    onClick={() => setCatOpen(false)}
                    className="block px-4 py-2 text-sm text-muted transition-colors hover:bg-white/[0.04] hover:text-foreground"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="group relative rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {label}
              <span className="absolute inset-x-3 -bottom-px h-px origin-left scale-x-0 bg-blue transition-transform group-hover:scale-x-100" />
            </Link>
          ))}
          <Link
            href="/advisor"
            className="ml-1 rounded-lg bg-blue/10 px-3.5 py-1.5 text-sm font-semibold text-blue transition-all hover:bg-blue/20"
          >
            Robot Advisor
          </Link>
        </nav>

        {/* Auth + Mobile toggle */}
        <div className="flex items-center gap-3">
          <UserMenu />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-muted hover:text-foreground lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="glass border-t border-white/[0.06] px-4 pb-4 pt-2 lg:hidden">
          <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-muted/50">Categories</p>
          <div className="mb-2 grid grid-cols-2 gap-1">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/explore/${cat.slug}`} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-foreground">
                {cat.name.split(" ")[0]}
              </Link>
            ))}
          </div>
          <div className="border-t border-white/[0.06] pt-2">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-white/[0.04] hover:text-foreground">
                {label}
              </Link>
            ))}
            <Link href="/advisor" onClick={() => setMobileOpen(false)} className="mt-1 block rounded-lg bg-blue/10 px-3 py-2.5 text-sm font-semibold text-blue">
              Robot Advisor
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
