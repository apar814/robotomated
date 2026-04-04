"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { UserMenu } from "@/components/auth/user-menu";
import { useSiteStats } from "@/lib/context/site-stats";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { RobotimusAvatar } from "@/components/robotimus-avatar";

// ── Dropdown data ──

const exploreCategories = [
  { slug: "warehouse", name: "Warehouse & Logistics", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { slug: "medical", name: "Medical & Healthcare", icon: "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" },
  { slug: "manufacturing", name: "Manufacturing", icon: "M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" },
  { slug: "agricultural", name: "Agricultural", icon: "M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" },
  { slug: "security", name: "Security & Patrol", icon: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" },
  { slug: "hospitality", name: "Hospitality & Service", icon: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" },
  { slug: "construction", name: "Construction", icon: "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21" },
  { slug: "consumer", name: "Consumer & Home", icon: "m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" },
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
  { href: "/explore", title: "Buy a Robot", desc: "Research and purchase outright", color: "#0EA5E9" },
  { href: "/lease", title: "Lease a Robot", desc: "Preserve capital, from $X,XXX/mo", color: "#0EA5E9" },
  { href: "/cpo", title: "Certified Pre-Owned", desc: "Verified robots at 40-60% off new", color: "#0EA5E9" },
  { href: "/find-my-robot", title: "Find My Robot", desc: "Answer 5 questions, get matched", color: "#0EA5E9" },
  { href: "/lease/quote", title: "Lease Calculator", desc: "Estimate your monthly payment", color: "#0EA5E9", divider: true },
];

const deployItems = [
  { href: "/robowork", title: "RoboWork", desc: "Post a job, hire a robot service provider", color: "#0EA5E9" },
  { href: "/robowork/providers", title: "Find an RSP", desc: "Browse Robot Service Providers near you", color: "#0EA5E9" },
  { href: "/robowork/post", title: "Post a Job", desc: "Describe your task, get bids", color: "#0EA5E9" },
  { href: "/robowork/providers/register", title: "Become a Provider", desc: "List your robots and get hired", color: "#0EA5E9", divider: true },
];

const operateItems = [
  { href: "/service", title: "Service & Maintenance", desc: "Find certified technicians near you", color: "#0EA5E9" },
  { href: "/parts", title: "Parts Marketplace", desc: "OEM and aftermarket parts", color: "#0EA5E9" },
  { href: "/insure", title: "Robot Insurance", desc: "Protect your automation investment", color: "#0EA5E9" },
  { href: "/trade-in", title: "Trade In Your Robot", desc: "AI-powered instant valuation", color: "#0EA5E9" },
  { href: "/certify", title: "Get Certified (RCO)", desc: "Industry standard certification", color: "#0EA5E9", divider: true },
];

const learnItems = [
  { href: "/learn", title: "Intelligence Library", desc: "50+ buyer guides and industry reports", color: "#0EA5E9" },
  { href: "/market", title: "Market Intelligence", desc: "Funding, launches, price trends", color: "#0EA5E9" },
  { href: "/case-studies", title: "Case Studies", desc: "Real deployments, real results", color: "#0EA5E9" },
  { href: "/tools/tco-calculator", title: "TCO Calculator", desc: "5-year total cost of ownership", color: "#0EA5E9" },
  { href: "/newsletter", title: "Newsletter", desc: "Weekly automation intelligence", color: "#0EA5E9", divider: true },
];

// ── SVG icon helper ──
function NavIcon({ d }: { d: string }) {
  return (
    <svg className="h-4 w-4 shrink-0 text-[#0EA5E9]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

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
    <div className="absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 shadow-2xl"
      style={{ animation: "dropIn 150ms ease-out" }}
    >
      {items.map((item, i) => (
        <div key={item.href}>
          {item.divider && i > 0 && <div className="my-1.5 border-t border-[var(--theme-border)]" />}
          <Link
            href={item.href}
            onClick={onClose}
            className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-all hover:bg-[rgba(14,165,233,0.08)] hover:border-l-2 hover:border-l-[#0EA5E9]"
          >
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ background: item.color }} />
            <div>
              <p className="text-sm font-semibold text-[var(--theme-text-primary)]">{item.title}</p>
              <p className="text-xs text-[var(--theme-text-muted)]">{item.desc}</p>
            </div>
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
          className={`flex items-center gap-1.5 rounded-md px-3 py-2 font-sans text-[14px] font-medium transition-colors ${
            isActive ? "text-[var(--theme-text-primary)]" : "text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]"
          }`}
        >
          {label}
          <Chevron open={isActive} />
        </button>

        {/* Dropdowns */}
        {isActive && id === "explore" && (
          <div
            className="absolute left-1/2 top-full z-50 mt-2 w-[720px] -translate-x-1/2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 shadow-2xl"
            style={{ animation: "dropIn 150ms ease-out" }}
            onMouseEnter={() => handleEnter(id)}
            onMouseLeave={handleLeave}
          >
            <div className="grid grid-cols-3 gap-6">
              {/* Column 1: By Category */}
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--theme-text-muted)]">By Category</p>
                <div className="space-y-0.5">
                  {exploreCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/explore/${cat.slug}`}
                      onClick={closeAll}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all hover:bg-[rgba(14,165,233,0.08)]"
                    >
                      <NavIcon d={cat.icon} />
                      <span className="text-sm font-semibold text-[var(--theme-text-primary)]">{cat.name}</span>
                    </Link>
                  ))}
                  <Link href="/explore" onClick={closeAll} className="mt-2 block px-2.5 text-xs font-medium text-[#0EA5E9] hover:underline">
                    View all categories &rarr;
                  </Link>
                </div>
              </div>

              {/* Column 2: By Need */}
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--theme-text-muted)]">By Need</p>
                <div className="space-y-0.5">
                  {exploreNeeds.map((need) => (
                    <Link
                      key={need.label}
                      href={need.href}
                      onClick={closeAll}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all hover:bg-[rgba(14,165,233,0.08)]"
                    >
                      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0EA5E9]" />
                      <span className="text-sm text-[var(--theme-text-secondary)]">{need.label}</span>
                    </Link>
                  ))}
                  <Link href="/find-my-robot" onClick={closeAll} className="mt-2 block px-2.5 text-xs font-medium text-[#0EA5E9] hover:underline">
                    Find my robot &rarr;
                  </Link>
                </div>
              </div>

              {/* Column 3: Featured */}
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--theme-text-muted)]">Featured</p>
                <div className="rounded-lg border border-[var(--theme-border)] bg-[var(--theme-tag-bg)] p-4">
                  <p className="text-[11px] font-medium uppercase tracking-widest text-[#0EA5E9]">Robot of the Week</p>
                  <p className="mt-2 text-base font-bold text-[var(--theme-text-primary)]">Top RoboScore</p>
                  <p className="mt-1 text-xs text-[var(--theme-text-muted)]">Highest-rated robot in our database this week.</p>
                  <Link href="/explore" onClick={closeAll} className="mt-3 inline-block text-xs font-medium text-[#0EA5E9] hover:underline">
                    View robot &rarr;
                  </Link>
                </div>
                <div className="mt-4 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-tag-bg)] p-4">
                  <p className="text-sm font-semibold text-[var(--theme-text-primary)]">{robotCount}+ robots tracked</p>
                  <p className="mt-1 text-xs text-[var(--theme-text-muted)]">Independent RoboScores. No manufacturer bias.</p>
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
        @keyframes pulse-icon {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>

      <header className="sticky left-0 right-0 top-0 z-50 border-b" style={{ borderColor: "var(--theme-nav-border)", background: "var(--theme-nav-bg)", backdropFilter: "blur(20px)" }}>
        <div ref={navRef} className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="mr-8 flex items-center">
            <span className="font-display text-[18px] font-extrabold tracking-[-0.02em]">
              <span style={{ color: "var(--theme-text-primary)" }}>ROBOTOMATED</span>
              <span className="text-[#0EA5E9]">.</span>
            </span>
          </Link>

          {/* Divider */}
          <div className="mr-4 hidden h-5 w-px lg:block" style={{ background: "var(--theme-border)" }} />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            <NavButton id="explore" label="Explore" />
            <NavButton id="acquire" label="Acquire" />
            <NavButton id="deploy" label="Deploy" />
            <NavButton id="operate" label="Operate" />
            <NavButton id="learn" label="Learn" />
            <Link
              href="/manufacturers"
              className="rounded-md px-3 py-2 font-sans text-[14px] font-medium text-[var(--theme-text-secondary)] transition-colors hover:text-[var(--theme-text-primary)]"
            >
              Manufacturers
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              onClick={openSearch}
              className="flex items-center gap-2 rounded-md border border-[var(--theme-border)] px-3 py-1.5 text-[var(--theme-text-muted)] transition-colors hover:border-[var(--theme-border)] hover:text-[var(--theme-text-secondary)]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <span className="hidden text-[13px] sm:inline">Search {robotCount} robots...</span>
              <kbd className="hidden rounded border border-[var(--theme-border)] bg-[var(--theme-tag-bg)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--theme-text-muted)] sm:inline">
                &#8984;K
              </kbd>
            </button>

            {/* Theme toggle */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* ROBOTIMUS button */}
            <Link
              href="/advisor"
              className="hidden items-center gap-1.5 rounded-md px-3.5 py-2 text-[13px] font-bold text-black transition-shadow hover:shadow-[0_0_30px_rgba(14,165,233,0.6)] sm:inline-flex"
              style={{ background: "var(--theme-accent-blue)", boxShadow: "0 0 20px rgba(14,165,233,0.4)" }}
            >
              <span className="animate-pulse-live">
                <RobotimusAvatar size={20} />
              </span>
              ROBOTIMUS
            </Link>

            <UserMenu />

            {/* Mobile hamburger */}
            <button
              type="button"
              className="rounded-md p-2 text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] lg:hidden"
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
            <Link href="/manufacturers" onClick={closeAll} className="block border-b border-[var(--theme-border)] px-4 py-3 text-[15px] font-semibold text-[var(--theme-text-secondary)]">
              Manufacturers
            </Link>
            <div className="p-4">
              <Link
                href="/advisor"
                onClick={closeAll}
                className="flex items-center justify-center gap-2 rounded-lg py-3 text-[14px] font-bold text-black"
                style={{ background: "#0EA5E9" }}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                </svg>
                ROBOTIMUS
              </Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
