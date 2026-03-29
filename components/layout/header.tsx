"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { UserMenu } from "@/components/auth/user-menu";

const categories = [
  { slug: "manufacturing", name: "Cobots & Industrial", count: "24" },
  { slug: "warehouse", name: "Warehouse", count: "15" },
  { slug: "consumer", name: "Consumer & Home", count: "19" },
  { slug: "medical", name: "Medical", count: "12" },
  { slug: "construction", name: "Construction", count: "8" },
  { slug: "agricultural", name: "Agricultural", count: "4" },
  { slug: "delivery", name: "Delivery", count: "7" },
  { slug: "drone", name: "Drones", count: "4" },
  { slug: "software", name: "Software", count: "2" },
];

const navLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/compare", label: "Compare" },
  { href: "/reviews", label: "Reviews" },
  { href: "/industries", label: "Industries" },
  { href: "/learn", label: "Learn" },
  { href: "/market-intel", label: "Market Intel" },
];

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

  // Trigger CommandPalette via custom event
  function openSearch() {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  }

  return (
    <>
      <header className="sticky left-0 right-0 top-0 z-50 border-b border-border bg-[rgba(8,8,8,0.92)] backdrop-blur-[20px]">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-mono text-[13px] font-bold tracking-widest">
              <span className="text-text-primary">ROBOTO</span>
              <span className="text-text-ghost">MATED</span>
              <span className="text-electric-blue">.</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {/* Explore with dropdown */}
            <div ref={catRef} className="relative">
              <button
                onClick={() => setCatOpen(!catOpen)}
                className={`flex items-center gap-1 rounded-[4px] px-3 py-1.5 font-sans text-xs font-medium transition-colors ${
                  catOpen
                    ? "bg-white/[0.04] text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                Explore
                <svg
                  className={`h-2.5 w-2.5 transition-transform ${catOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {catOpen && (
                <div className="absolute left-1/2 top-10 z-50 w-[420px] -translate-x-1/2 rounded-lg border border-border bg-obsidian p-4 shadow-2xl">
                  <div className="grid grid-cols-3 gap-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/explore/${cat.slug}`}
                        onClick={() => setCatOpen(false)}
                        className="group rounded-[4px] p-2.5 transition-all hover:bg-white/[0.03]"
                      >
                        <p className="text-xs font-medium text-text-secondary group-hover:text-electric-blue">
                          {cat.name}
                        </p>
                        <p className="text-[10px] text-text-tertiary">{cat.count} robots</p>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/explore"
                    onClick={() => setCatOpen(false)}
                    className="mt-3 block border-t border-border pt-3 text-center text-xs font-medium text-electric-blue hover:underline"
                  >
                    View All 305 Robots &rarr;
                  </Link>
                </div>
              )}
            </div>

            {/* Other nav links */}
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-[4px] px-3 py-1.5 font-sans text-xs font-medium text-text-tertiary transition-colors hover:text-text-secondary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search trigger */}
            <button
              onClick={openSearch}
              className="flex items-center gap-2 rounded-[4px] border border-border px-3 py-1.5 text-text-tertiary transition-colors hover:border-text-ghost hover:text-text-secondary"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span className="hidden font-sans text-xs sm:inline">Search 305 robots...</span>
              <kbd className="hidden rounded-[2px] border border-border-subtle bg-white/[0.03] px-1.5 py-0.5 font-mono text-[9px] sm:inline">
                &#8984;K
              </kbd>
            </button>

            {/* AI Advisor button */}
            <Link
              href="/advisor"
              className="hidden rounded-[4px] bg-electric-blue px-3.5 py-1.5 font-mono text-[10px] font-semibold tracking-wider text-black transition-shadow hover:shadow-[0_0_16px_rgba(14,165,233,0.3)] sm:inline-block"
            >
              AI ADVISOR
            </Link>

            <UserMenu />

            {/* Mobile hamburger */}
            <button
              type="button"
              className="rounded-[4px] p-2 text-text-tertiary hover:text-text-secondary lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav panel */}
        {mobileOpen && (
          <nav className="border-t border-border bg-obsidian px-4 pb-4 pt-2 lg:hidden">
            <div className="mb-2 grid grid-cols-3 gap-1">
              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/explore/${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-[4px] px-2 py-2 text-center text-[11px] text-text-tertiary hover:bg-white/[0.03] hover:text-text-secondary"
                >
                  {cat.name.split(" ")[0]}
                </Link>
              ))}
            </div>
            <div className="border-t border-border pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm text-text-tertiary hover:text-text-secondary"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/advisor"
                onClick={() => setMobileOpen(false)}
                className="mt-1 block rounded-[4px] bg-electric-blue px-3 py-2.5 text-center font-mono text-[10px] font-semibold tracking-wider text-black"
              >
                AI ADVISOR
              </Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
