"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    label: "Explore",
    href: "/explore",
    match: ["/explore", "/best", "/compare"],
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
  {
    label: "Hire",
    href: "/robowork",
    match: ["/robowork"],
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    label: "Certify",
    href: "/certify",
    match: ["/certify"],
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
  },
  {
    label: "Advisor",
    href: "/advisor",
    match: ["/advisor"],
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    label: "Profile",
    href: "/account",
    match: ["/account", "/login"],
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
      style={{
        background: "rgba(8,8,8,0.92)",
        backdropFilter: "blur(24px) saturate(180%)",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex items-center justify-around py-1.5">
        {NAV_ITEMS.map((item) => {
          const isActive = item.match.some((m) => pathname.startsWith(m));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex min-w-[56px] flex-col items-center gap-0.5 px-2 py-1.5 transition-all active:scale-[0.97] ${
                isActive ? "text-white" : "text-white/30"
              }`}
            >
              {/* Active glow indicator */}
              {isActive && (
                <span
                  className="absolute -top-1.5 h-[2px] w-8 rounded-full"
                  style={{ background: "#FFFFFF" }}
                />
              )}
              {item.icon}
              <span className="font-[family-name:var(--font-brand)] text-[9px] tracking-[0.05em]">{item.label}</span>
            </Link>
          );
        })}
      </div>
      {/* Safe area for phones with home indicators */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
