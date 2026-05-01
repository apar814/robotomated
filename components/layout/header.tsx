"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { UserMenu } from "@/components/auth/user-menu";
import { useSiteStats } from "@/lib/context/site-stats";

import { RobotimusAvatar } from "@/components/robotimus-avatar";

// ── Dropdown data ──

const exploreCategories = [
  { slug: "warehouse", name: "Warehouse & Logistics" },
  { slug: "medical", name: "Medical & Healthcare" },
  { slug: "manufacturing", name: "Manufacturing" },
  { slug: "agricultural", name: "Agricultural" },
  { slug: "security", name: "Security & Patrol" },
  { slug: "hospitality", name: "Hospitality & Service" },
  { slug: "construction", name: "Construction" },
  { slug: "consumer", name: "Consumer & Home" },
];

const exploreNeeds = [
  { label: "I need to move materials", href: "/explore/warehouse" },
  { label: "I need to pick & pack", href: "/explore/warehouse" },
  { label: "I need to clean surfaces", href: "/explore/consumer" },
  { label: "I need to inspect equipment", href: "/explore/drone" },
  { label: "I need to secure a facility", href: "/explore/security" },
  { label: "I need to serve customers", href: "/explore/hospitality" },
];

const acquireItems = [
  { href: "/explore", title: "Buy a Robot", desc: "Research and purchase outright", color: "#D4D4D4" },
  { href: "/lease", title: "Lease a Robot", desc: "Preserve capital, from $1,500/mo", color: "#D4D4D4" },
  { href: "/cpo", title: "Certified Pre-Owned", desc: "Verified robots at 40-60% off new", color: "#D4D4D4" },
  { href: "/find-my-robot", title: "Find My Robot", desc: "Answer 5 questions, get matched", color: "#D4D4D4" },
  { href: "/lease/quote", title: "Lease Calculator", desc: "Estimate your monthly payment", color: "#D4D4D4", divider: true },
];

const deployItems = [
  { href: "/robowork", title: "RoboWork", desc: "Post a job, hire a robot service provider", color: "#D4D4D4" },
  { href: "/robowork/providers", title: "Find an RSP", desc: "Browse Robot Service Providers near you", color: "#D4D4D4" },
  { href: "/robowork/post", title: "Post a Job", desc: "Describe your task, get bids", color: "#D4D4D4" },
  { href: "/robowork/providers/register", title: "Become a Provider", desc: "List your robots and get hired", color: "#D4D4D4", divider: true },
];

const operateItems = [
  { href: "/service", title: "Service & Maintenance", desc: "Find certified technicians near you", color: "#D4D4D4" },
  { href: "/parts", title: "Parts Marketplace", desc: "OEM and aftermarket parts", color: "#D4D4D4" },
  { href: "/insure", title: "Robot Insurance", desc: "Protect your automation investment", color: "#D4D4D4" },
  { href: "/trade-in", title: "Trade In Your Robot", desc: "AI-powered instant valuation", color: "#D4D4D4" },
  { href: "/certify", title: "Get Certified (RCO)", desc: "Industry standard certification", color: "#D4D4D4" },
  { href: "/certification/operator-level-1", title: "Operator Certification", desc: "$399 — 4-week hybrid program", color: "#D4D4D4" },
  { href: "/employers/hire-certified-operators", title: "For Employers", desc: "Hire certified robot operators", color: "#D4D4D4", divider: true },
];

const learnItems = [
  { href: "/learn", title: "Intelligence Library", desc: "50+ buyer guides and industry reports", color: "#D4D4D4" },
  { href: "/market", title: "Market Intelligence", desc: "Funding, launches, price trends", color: "#D4D4D4" },
  { href: "/case-studies", title: "Case Studies", desc: "Real deployments, real results", color: "#D4D4D4" },
  { href: "/tools/tco-calculator", title: "TCO Calculator", desc: "5-year total cost of ownership", color: "#D4D4D4" },
  { href: "/newsletter", title: "Newsletter", desc: "Weekly automation intelligence", color: "#D4D4D4", divider: true },
];

// ── Chevron ──
function Chevron({ open }: { open: boolean }) {
  return (
    <svg className={`h-3 w-3 transition-transform duration-150 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// ── Simple dropdown ──
function SimpleDropdown({ items, onClose }: { items: typeof acquireItems; onClose: () => void }) {
  return (
    <div className="absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 border p-2"
      style={{ borderColor: "#1F1F1F", background: "rgba(0,0,0,0.95)", animation: "dropIn 150ms ease-out" }}
    >
      {items.map((item, i) => (
        <div key={item.href}>
          {item.divider && i > 0 && <div className="my-1.5 border-t border-[var(--theme-border)]" />}
          <Link
            href={item.href}
            onClick={onClose}
            className="group block px-3 py-2.5 transition-colors hover:bg-white/[0.04]"
          >
            <p className="text-[13px] font-medium text-white/90">{item.title}</p>
            <p className="text-[11px] text-white/40">{item.desc}</p>
          </Link>
        </div>
      ))}
    </div>
  );
}

// ── Mobile accordion ──
function MobileAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--theme-border)]">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-4 py-3 text-left text-[15px] font-semibold text-[var(--theme-text-secondary)]">
        {title}
        <Chevron open={open} />
      </button>
      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
}

function MobileLink({ href, title, desc, onClose }: { href: string; title: string; desc: string; onClose: () => void }) {
  return (
    <Link href={href} onClick={onClose} className="block rounded-lg px-3 py-2 transition-colors hover:bg-[var(--theme-tag-bg)]">
      <p className="text-sm font-medium text-[var(--theme-text-primary)]">{title}</p>
      <p className="text-xs text-[var(--theme-text-muted)]">{desc}</p>
    </Link>
  );
}

// ── Main header ──
export function Header() {
  const { robotCount } = useSiteStats();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeAll = useCallback(() => {
    setActiveMenu(null);
    setMobileOpen(false);
  }, []);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setActiveMenu(null);
    }
    if (activeMenu) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [activeMenu]);

  // Close on escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeAll();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [closeAll]);

  function handleEnter(menu: string) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  }

  function handleLeave() {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 200);
  }

  function openSearch() {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  }

  function NavButton({ id, label }: { id: string; label: string }) {
    const isActive = activeMenu === id;
    return (
      <div className="relative" onMouseEnter={() => handleEnter(id)} onMouseLeave={handleLeave}>
        <button
          onClick={() => setActiveMenu(isActive ? null : id)}
          className="relative flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium uppercase tracking-[0.12em] transition-colors"
          style={{ color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.6)", fontFamily: "Inter, sans-serif" }}
        >
          {/* Active indicator */}
          {isActive && <span className="absolute bottom-0 left-1/2 h-px w-full -translate-x-1/2 bg-white" style={{ marginBottom: "-2px" }} />}
          {label}
          <Chevron open={isActive} />
        </button>

        {/* Dropdowns */}
        {isActive && id === "explore" && (
          <div
            className="absolute left-1/2 top-full z-50 mt-2 w-[720px] -translate-x-1/2 border p-6"
            style={{ borderColor: "#1F1F1F", background: "rgba(0,0,0,0.95)", animation: "dropIn 150ms ease-out" }}
            onMouseEnter={() => handleEnter(id)}
            onMouseLeave={handleLeave}
          >
            <div className="grid grid-cols-3 gap-6">
              {/* Column 1: By Category */}
              <div>
                <p className="mb-3 border-b border-white/[0.04] pb-1.5 font-[family-name:var(--font-brand)] text-[8px] uppercase tracking-[0.2em] text-white/20">By Category</p>
                <div className="space-y-0.5">
                  {exploreCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/explore/${cat.slug}`}
                      onClick={closeAll}
                      className="block px-2.5 py-2 text-sm text-white/80 transition-colors hover:bg-white/[0.04] hover:text-white"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <Link href="/explore" onClick={closeAll} className="mt-2 block px-2.5 text-xs font-medium text-white/50 hover:text-white hover:underline">
                    View all categories &rarr;
                  </Link>
                </div>
              </div>

              {/* Column 2: By Need */}
              <div>
                <p className="mb-3 border-b border-white/[0.04] pb-1.5 font-[family-name:var(--font-brand)] text-[8px] uppercase tracking-[0.2em] text-white/20">By Need</p>
                <div className="space-y-0.5">
                  {exploreNeeds.map((need) => (
                    <Link
                      key={need.label}
                      href={need.href}
                      onClick={closeAll}
                      className="block px-2.5 py-2 text-sm text-white/60 transition-colors hover:bg-white/[0.04] hover:text-white"
                    >
                      {need.label}
                    </Link>
                  ))}
                  <Link href="/find-my-robot" onClick={closeAll} className="mt-2 block px-2.5 text-xs font-medium text-white/50 hover:text-white hover:underline">
                    Find my robot &rarr;
                  </Link>
                </div>
              </div>

              {/* Column 3: Featured */}
              <div>
                <p className="mb-3 border-b border-white/[0.04] pb-1.5 font-[family-name:var(--font-brand)] text-[8px] uppercase tracking-[0.2em] text-white/20">Featured</p>
                <div className="border border-[#1F1F1F] p-4">
                  <p className="text-[11px] font-medium uppercase tracking-widest text-white/40">Robot of the Week</p>
                  <p className="mt-2 text-base font-bold text-white">Top RoboScore</p>
                  <p className="mt-1 text-xs text-white/40">Highest-rated robot in our database this week.</p>
                  <Link href="/explore" onClick={closeAll} className="mt-3 inline-block text-xs font-medium text-white/50 hover:text-white hover:underline">
                    View robot &rarr;
                  </Link>
                </div>
                <div className="mt-4 border border-[#1F1F1F] p-4">
                  <p className="text-sm font-semibold text-white">{robotCount}+ robots tracked</p>
                  <p className="mt-1 text-xs text-white/40">Independent RoboScores. No manufacturer bias.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isActive && id === "acquire" && (
          <div onMouseEnter={() => handleEnter(id)} onMouseLeave={handleLeave}>
            <SimpleDropdown items={acquireItems} onClose={closeAll} />
          </div>
        )}
        {isActive && id === "deploy" && (
          <div onMouseEnter={() => handleEnter(id)} onMouseLeave={handleLeave}>
            <SimpleDropdown items={deployItems} onClose={closeAll} />
          </div>
        )}
        {isActive && id === "operate" && (
          <div onMouseEnter={() => handleEnter(id)} onMouseLeave={handleLeave}>
            <SimpleDropdown items={operateItems} onClose={closeAll} />
          </div>
        )}
        {isActive && id === "learn" && (
          <div onMouseEnter={() => handleEnter(id)} onMouseLeave={handleLeave}>
            <SimpleDropdown items={learnItems} onClose={closeAll} />
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Dropdown animation */}
      <style jsx global>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      <header className="sticky left-0 right-0 top-0 z-50 border-b" style={{ borderColor: "#1F1F1F", background: "rgba(0,0,0,0.95)" }}>
        <div ref={navRef} className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo — ROBOTO + MATED + . */}
          <Link href="/" className="mr-8 flex items-center">
            <span className="font-[family-name:var(--font-brand)] text-[16px] font-medium uppercase tracking-[0.2em] text-white">
              ROBOTOMATED
            </span>
          </Link>

          {/* Divider */}
          <div className="mr-4 hidden h-5 w-px lg:block" style={{ background: "#1F1F1F" }} />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            <NavButton id="explore" label="Explore" />
            <NavButton id="acquire" label="Acquire" />
            <NavButton id="deploy" label="Deploy" />
            <NavButton id="operate" label="Operate" />
            <NavButton id="learn" label="Learn" />
            <Link
              href="/intelligence"
              className="px-3 py-2 text-[12px] font-medium uppercase tracking-[0.12em] transition-colors"
              style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Inter, sans-serif" }}
            >
              Intelligence
            </Link>
            <Link
              href="/manufacturers"
              className="px-3 py-2 text-[12px] font-medium uppercase tracking-[0.12em] transition-colors"
              style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Inter, sans-serif" }}
            >
              Manufacturers
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Search trigger */}
            <button
              onClick={openSearch}
              className="hidden items-center gap-2 border px-3.5 py-2 transition-colors hover:border-white/20 md:flex"
              style={{
                width: "clamp(180px, 20vw, 280px)",
                borderColor: "#1F1F1F",
                background: "transparent",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <span className="flex-1 truncate text-[13px]">Search robots...</span>
              <kbd className="shrink-0 px-1.5 py-0.5 font-mono text-[13px]" style={{ background: "transparent", color: "rgba(255,255,255,0.3)", border: "1px solid #1F1F1F" }}>
                &#8984;K
              </kbd>
            </button>

            {/* Robotimus button */}
            <Link
              href="/advisor"
              className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap border border-white/20 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-white/[0.04]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <RobotimusAvatar size={18} />
              Robotimus
            </Link>

            <UserMenu />

            {/* Mobile hamburger */}
            <button
              type="button"
              className="p-2 text-white/40 hover:text-white lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
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

        {/* ── Mobile nav ── */}
        {mobileOpen && (
          <nav className="fixed inset-0 top-16 z-50 overflow-y-auto bg-[var(--theme-bg)] lg:hidden">
            <MobileAccordion title="Explore">
              {exploreCategories.map((cat) => (
                <MobileLink key={cat.slug} href={`/explore/${cat.slug}`} title={cat.name} desc="" onClose={closeAll} />
              ))}
            </MobileAccordion>
            <MobileAccordion title="Acquire">
              {acquireItems.map((item) => (
                <MobileLink key={item.href} href={item.href} title={item.title} desc={item.desc} onClose={closeAll} />
              ))}
            </MobileAccordion>
            <MobileAccordion title="Deploy">
              {deployItems.map((item) => (
                <MobileLink key={item.href} href={item.href} title={item.title} desc={item.desc} onClose={closeAll} />
              ))}
            </MobileAccordion>
            <MobileAccordion title="Operate">
              {operateItems.map((item) => (
                <MobileLink key={item.href} href={item.href} title={item.title} desc={item.desc} onClose={closeAll} />
              ))}
            </MobileAccordion>
            <MobileAccordion title="Learn">
              {learnItems.map((item) => (
                <MobileLink key={item.href} href={item.href} title={item.title} desc={item.desc} onClose={closeAll} />
              ))}
            </MobileAccordion>
            <Link href="/intelligence" onClick={closeAll} className="block border-b border-[var(--theme-border)] px-4 py-3 text-[15px] font-semibold text-[var(--theme-text-secondary)]">
              Intelligence
            </Link>
            <Link href="/manufacturers" onClick={closeAll} className="block border-b border-[var(--theme-border)] px-4 py-3 text-[15px] font-semibold text-[var(--theme-text-secondary)]">
              Manufacturers
            </Link>
            <div className="p-4">
              <Link
                href="/advisor"
                onClick={closeAll}
                className="flex items-center justify-center gap-2 border border-white/20 py-3 text-[12px] font-medium uppercase tracking-[0.12em] text-white"
              >
                ROBOTIMUS
              </Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
