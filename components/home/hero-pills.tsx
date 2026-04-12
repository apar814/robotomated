import Link from "next/link";

const JOB_PILLS = [
  { label: "Move It", href: "/advisor?q=I%20need%20to%20automate%20material%20movement%20and%20pallet%20transport%20in%20my%20facility", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
  { label: "Clean It", href: "/advisor?q=I%20need%20a%20robot%20to%20clean%20floors%20in%20my%20facility%20autonomously", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l3.5-3.5M18 4l-8.5 8.5M9.5 12.5l2 2M14 7l3-3 3 3-3 3z" /></svg> },
  { label: "Build It", href: "/advisor?q=I%20need%20a%20cobot%20for%20manufacturing%20assembly%20or%20welding%20tasks", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg> },
  { label: "Grow It", href: "/advisor?q=I%20need%20agricultural%20robots%20for%20harvesting%20or%20crop%20management", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10M12 20v-8" /><path d="M12 12C12 8 8 4 4 4c0 4 4 8 8 8z" /><path d="M12 12c0-4 4-8 8-8-4 0-8 4-8 8z" /></svg> },
  { label: "Guard It", href: "/advisor?q=I%20need%20autonomous%20security%20patrol%20robots%20for%20my%20facility", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
  { label: "Heal It", href: "/advisor?q=I%20need%20medical%20or%20surgical%20robots%20for%20healthcare%20applications", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14" /><path d="M12 10v4M10 12h4" /></svg> },
  { label: "Deliver It", href: "/advisor?q=I%20need%20robots%20for%20internal%20delivery%20or%20last-mile%20logistics", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /></svg> },
  { label: "Inspect It", href: "/advisor?q=I%20need%20robots%20for%20inspection%20surveying%20or%20quality%20control", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg> },
];

export function HeroPills() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {JOB_PILLS.map((pill) => (
        <Link
          key={pill.label}
          href={pill.href}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/[0.06] px-3 py-1.5 text-[11px] font-medium text-white/40 transition-all hover:border-[#2563EB]/30 hover:text-[#2563EB]"
        >
          <span className="text-white/45">{pill.icon}</span>
          {pill.label}
        </Link>
      ))}
    </div>
  );
}
