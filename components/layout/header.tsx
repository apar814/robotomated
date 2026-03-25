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
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.06] bg-[rgba(10,15,30,0.92)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-lg font-bold tracking-tight">
              ROBOT<span className="opacity-65">O</span><span className="opacity-45">MATED</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            <div ref={catRef} className="relative">
              <button onClick={() => setCatOpen(!catOpen)} className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white/50 transition-colors hover:text-white">
                Browse Robots
                <svg className={`h-3 w-3 transition-transform ${catOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {catOpen && (
                <div className="absolute left-1/2 top-12 z-50 w-[480px] -translate-x-1/2 rounded-2xl border border-white/[0.06] bg-[#0A0F1E] p-4 shadow-2xl backdrop-blur-xl">
                  <div className="grid grid-cols-3 gap-1">
                    {categories.map((cat) => (
                      <Link key={cat.slug} href={`/explore/${cat.slug}`} onClick={() => setCatOpen(false)} className="group rounded-xl p-2.5 transition-all hover:bg-white/[0.04]">
                        <p className="text-xs font-medium text-white/80 group-hover:text-blue">{cat.name}</p>
                        <p className="text-[10px] text-white/30">{cat.count} robots</p>
                      </Link>
                    ))}
                  </div>
                  <Link href="/explore" onClick={() => setCatOpen(false)} className="mt-3 block border-t border-white/[0.06] pt-3 text-center text-xs font-medium text-blue hover:underline">
                    View All 95+ Robots &rarr;
                  </Link>
                </div>
              )}
            </div>
            <Link href="/manufacturers" className="rounded-lg px-3 py-2 text-sm font-medium text-white/50 hover:text-white">Brands</Link>
            <Link href="/reviews" className="rounded-lg px-3 py-2 text-sm font-medium text-white/50 hover:text-white">Reviews</Link>
            <Link href="/learn" className="rounded-lg px-3 py-2 text-sm font-medium text-white/50 hover:text-white">Learn</Link>
            <Link href="/advisor" className="ml-1 rounded-lg bg-blue/10 px-3.5 py-1.5 text-sm font-semibold text-blue hover:bg-blue/20 hover:shadow-[0_0_20px_rgba(0,194,255,0.1)]">
              Robot Advisor
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={openSearch} className="flex items-center gap-2 rounded-lg border border-white/[0.06] px-3 py-1.5 text-xs text-white/30 hover:border-white/[0.12] hover:text-white/50">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] sm:inline">&#8984;K</kbd>
            </button>
            <UserMenu />
            <button type="button" className="rounded-lg p-2 text-white/40 hover:text-white lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t border-white/[0.06] bg-[#0A0F1E] px-4 pb-4 pt-2 lg:hidden">
            <div className="mb-2 grid grid-cols-3 gap-1">
              {categories.slice(0, 6).map((cat) => (
                <Link key={cat.slug} href={`/explore/${cat.slug}`} onClick={() => setMobileOpen(false)} className="rounded-lg px-2 py-2 text-center text-[11px] text-white/50 hover:bg-white/[0.04] hover:text-white">{cat.name.split(" ")[0]}</Link>
              ))}
            </div>
            <div className="border-t border-white/[0.06] pt-2">
              <Link href="/explore" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-white/50 hover:text-white">Browse All</Link>
              <Link href="/manufacturers" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-white/50 hover:text-white">Brands</Link>
              <Link href="/advisor" onClick={() => setMobileOpen(false)} className="mt-1 block rounded-lg bg-blue/10 px-3 py-2.5 text-sm font-semibold text-blue">Robot Advisor</Link>
            </div>
          </nav>
        )}
      </header>
      <div className="h-14" />
    </>
  );
}
