"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

const PLACEHOLDER_JOBS = [
  "We need to move 400 pallets a night across 3 warehouse zones...",
  "Our surgical team needs sub-millimeter precision at scale...",
  "We're harvesting 2,000 acres and losing $40K to weather windows...",
  "Our facility needs nightly floor cleaning across 80,000 sq ft...",
  "We need perimeter security without adding headcount...",
  "Our assembly line has a bottleneck at the welding station...",
  "We're a hospital and need autonomous delivery between floors...",
  "Our inventory counts take 3 days and shut down operations...",
];

const JOB_CATEGORIES = [
  { id: "warehouse-pallet-movement", label: "Move It", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
  { id: "facility-floor-cleaning", label: "Clean It", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l3.5-3.5M18 4l-8.5 8.5M9.5 12.5l2 2M14 7l3-3 3 3-3 3z" /></svg> },
  { id: "manufacturing-assembly", label: "Build It", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg> },
  { id: "agricultural-harvest", label: "Grow It", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10M12 20v-8" /><path d="M12 12C12 8 8 4 4 4c0 4 4 8 8 8z" /><path d="M12 12c0-4 4-8 8-8-4 0-8 4-8 8z" /></svg> },
  { id: "security-perimeter-patrol", label: "Guard It", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
  { id: "surgical-assistance", label: "Heal It", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14" /><path d="M12 10v4M10 12h4" /></svg> },
  { id: "hospital-internal-delivery", label: "Deliver It", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /></svg> },
  { id: "construction-inspection", label: "Inspect It", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg> },
];

export function JobInput() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Typewriter effect for placeholder
  useEffect(() => {
    if (value) return; // Don't animate if user has typed

    const currentPlaceholder = PLACEHOLDER_JOBS[placeholderIdx];
    if (isTyping) {
      if (typedChars < currentPlaceholder.length) {
        const timer = setTimeout(() => setTypedChars((c) => c + 1), 35);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timer);
      }
    } else {
      // Pause then move to next
      const timer = setTimeout(() => {
        setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_JOBS.length);
        setTypedChars(0);
        setIsTyping(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [typedChars, isTyping, placeholderIdx, value]);

  const currentPlaceholder = value ? "" : PLACEHOLDER_JOBS[placeholderIdx].slice(0, typedChars);

  const handleSubmit = useCallback(() => {
    if (!value.trim()) return;
    const q = encodeURIComponent(value.trim());
    router.push(`/advisor?q=${q}`);
  }, [value, router]);

  const handleCategory = useCallback((id: string) => {
    const cat = JOB_CATEGORIES.find((c) => c.id === id);
    if (cat) {
      const q = encodeURIComponent(`I need help with: ${cat.label.replace(" It", "")} — ${id.replace(/-/g, " ")}`);
      router.push(`/advisor?q=${q}`);
    }
  }, [router]);

  return (
    <div>
      {/* Job input */}
      <div className="relative">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          rows={2}
          className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 pr-14 font-[family-name:var(--font-ui)] text-[15px] text-white placeholder:text-transparent focus:border-[#0EA5E9]/30 focus:outline-none focus:ring-0"
          style={{ minHeight: "56px", borderLeftWidth: "3px", borderLeftColor: value ? "#0EA5E9" : "transparent" }}
          aria-label="Describe your job"
        />
        {/* Animated placeholder overlay */}
        {!value && (
          <div className="pointer-events-none absolute left-5 top-4 font-[family-name:var(--font-ui)] text-[15px] text-white/25">
            {currentPlaceholder}
            <span className="animate-pulse">|</span>
          </div>
        )}
        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#0EA5E9] text-black transition-opacity disabled:opacity-20"
          aria-label="Analyze job"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>

      {/* Job category quick-selects */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {JOB_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategory(cat.id)}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/[0.06] px-3 py-1.5 text-[11px] font-medium text-white/40 transition-all hover:border-[#0EA5E9]/30 hover:text-[#0EA5E9]"
          >
            <span className="text-white/20 transition-colors group-hover:text-[#0EA5E9]">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
