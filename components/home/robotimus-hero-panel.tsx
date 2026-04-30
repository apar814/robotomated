"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RobotimusAvatar } from "@/components/robotimus-avatar";
import Link from "next/link";

// ── Conversation data ──

interface Message {
  role: "user" | "robotimus";
  text: string;
  chips?: { label: string; score: number }[];
}

const CONVERSATIONS: Message[][] = [
  [
    { role: "user", text: "I have a $150K budget and a 40,000 sq ft warehouse. What robot do I need?" },
    {
      role: "robotimus",
      text: "Great fit for AMRs. I\u2019d recommend the Locus Origin (RoboScore 87) or 6 River Chuck. Want to buy, lease, or hire? Changes my recommendation.",
      chips: [
        { label: "Locus Origin", score: 87 },
        { label: "6R Chuck", score: 84 },
        { label: "Fetch HMIShelf", score: 82 },
      ],
    },
    { role: "user", text: "What would leasing cost me?" },
  ],
  [
    { role: "user", text: "Can I hire a robot for just 2 weeks?" },
    {
      role: "robotimus",
      text: "Yes \u2014 RoboWork is perfect for that. Post a job and get bids from verified Robot Service Providers within 24 hours.",
    },
    { role: "user", text: "How much would that cost?" },
  ],
  [
    { role: "user", text: "What\u2019s my da Vinci robot worth?" },
    {
      role: "robotimus",
      text: "Based on current market demand, a da Vinci Xi (2019-2022) is valued at $800K-$1.2M. Want a full valuation report?",
    },
    { role: "user", text: "Yes, run the valuation" },
  ],
];

const PLACEHOLDERS = [
  "Should I buy, lease, or hire?",
  "What robot fits my operation?",
  "Help me build a CFO business case",
  "What\u2019s my robot worth today?",
  "Compare AMR vs AGV for me",
];

const STARTER_CHIPS = [
  { label: "Buy vs lease?", query: "Should I buy, lease, or hire a robot?" },
  { label: "Best warehouse robot", query: "What's the best warehouse robot for my operation?" },
  { label: "Post a job", query: "How do I post a job on RoboWork?" },
];

// ── Component ──

export function RobotimusHeroPanel() {
  const router = useRouter();
  const [convoIndex, setConvoIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [mounted, setMounted] = useState(false);

  const conversation = CONVERSATIONS[convoIndex];

  // Mount animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Message reveal sequence
  useEffect(() => {
    setVisibleMessages(0);
    setShowTyping(false);
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setVisibleMessages(1), 600));
    timers.push(setTimeout(() => setVisibleMessages(2), 1200));
    timers.push(setTimeout(() => setVisibleMessages(3), 2000));
    timers.push(setTimeout(() => setShowTyping(true), 2800));
    return () => timers.forEach(clearTimeout);
  }, [convoIndex]);

  // Auto-cycle conversations
  useEffect(() => {
    const t = setTimeout(() => {
      setConvoIndex((i) => (i + 1) % CONVERSATIONS.length);
    }, 7000);
    return () => clearTimeout(t);
  }, [convoIndex]);

  // Rotating placeholder
  useEffect(() => {
    const t = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = useCallback(() => {
    const q = inputValue.trim();
    if (q) {
      router.push(`/advisor?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/advisor");
    }
  }, [inputValue, router]);

  return (
    <div
      className="w-full max-w-[420px] transition-opacity duration-200"
      style={{ opacity: mounted ? 1 : 0 }}
    >
      {/* Panel */}
      <div
        className="overflow-hidden"
        style={{
          background: "var(--theme-card, #0A0A0A)",
          border: "1px solid var(--theme-border, #1F1F1F)",
          borderRadius: "2px",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: "1px solid var(--theme-border, #1F1F1F)" }}
        >
          <div className="flex h-8 w-8 items-center justify-center">
            <RobotimusAvatar size={28} />
          </div>
          <div className="flex-1">
            <p className="font-[family-name:var(--font-brand)] text-[12px] font-medium uppercase tracking-[0.12em] text-white">
              ROBOTIMUS
            </p>
            <p className="font-[family-name:var(--font-ui)] text-[11px] tracking-[0.08em]" style={{ color: "var(--theme-text-muted, rgba(255,255,255,0.45))" }}>
              AI ROBOTICS ADVISOR
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="block h-1.5 w-1.5 rounded-full animate-pulse-live" style={{ backgroundColor: "var(--interactive, #D4D4D4)" }} />
            <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.08em]" style={{ color: "var(--interactive, #D4D4D4)" }}>
              ONLINE
            </span>
          </div>
        </div>

        {/* Chat messages */}
        <div className="h-[220px] overflow-hidden px-4 py-4">
          <div className="flex flex-col gap-3">
            {conversation.slice(0, visibleMessages).map((msg, i) => (
              <div key={`${convoIndex}-${i}`}>
                {msg.role === "user" ? (
                  <div className="flex justify-end">
                    <div
                      className="max-w-[80%] px-3 py-2 text-[13px] leading-relaxed"
                      style={{
                        background: "var(--theme-card-hover, #141414)",
                        border: "1px solid var(--theme-border, #1F1F1F)",
                        borderRadius: "2px",
                        color: "var(--theme-text-primary, #FFFFFF)",
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <div className="mt-1 shrink-0">
                      <RobotimusAvatar size={20} />
                    </div>
                    <div>
                      <div
                        className="px-3 py-2 text-[13px] leading-relaxed"
                        style={{
                          background: "var(--theme-bg, #000000)",
                          border: "1px solid var(--theme-border, #1F1F1F)",
                          borderLeft: "2px solid var(--interactive, #D4D4D4)",
                          borderRadius: "2px",
                          color: "var(--theme-text-secondary, rgba(255,255,255,0.7))",
                        }}
                      >
                        {msg.text}
                      </div>
                      {msg.chips && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {msg.chips.map((chip) => (
                            <span
                              key={chip.label}
                              className="inline-flex items-center gap-1 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[11px] font-medium"
                              style={{
                                background: "var(--theme-tag-bg, rgba(255,255,255,0.04))",
                                border: "1px solid var(--theme-tag-border, rgba(255,255,255,0.12))",
                                borderRadius: "2px",
                                color: "var(--interactive, #D4D4D4)",
                              }}
                            >
                              {chip.label}
                              <span style={{ color: "var(--theme-text-muted, rgba(255,255,255,0.45))" }}>{chip.score}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {showTyping && (
              <div className="flex items-start gap-2">
                <div className="mt-1 shrink-0">
                  <RobotimusAvatar size={20} />
                </div>
                <div
                  className="flex items-center gap-2 px-3 py-2"
                  style={{
                    background: "var(--theme-bg, #000000)",
                    border: "1px solid var(--theme-border, #1F1F1F)",
                    borderLeft: "2px solid var(--interactive, #D4D4D4)",
                    borderRadius: "2px",
                  }}
                >
                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="inline-block h-1 w-1 rounded-full"
                        style={{
                          backgroundColor: "var(--theme-text-muted, rgba(255,255,255,0.45))",
                          animation: `pulse-live 1.4s ease-in-out ${d * 200}ms infinite`,
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.12em]"
                    style={{ color: "var(--theme-text-muted, rgba(255,255,255,0.45))" }}
                  >
                    PROCESSING
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Suggestion chips */}
        <div
          className="flex flex-wrap gap-1.5 px-4 py-2"
          style={{ borderTop: "1px solid var(--theme-border, #1F1F1F)" }}
        >
          {STARTER_CHIPS.map((chip) => (
            <Link
              key={chip.label}
              href={`/advisor?q=${encodeURIComponent(chip.query)}`}
              className="px-2 py-1 text-[11px] font-medium uppercase tracking-[0.04em] transition-colors duration-75 hover:border-white/40 hover:text-white"
              style={{
                background: "var(--theme-tag-bg, rgba(255,255,255,0.04))",
                border: "1px solid var(--theme-tag-border, rgba(255,255,255,0.12))",
                borderRadius: "2px",
                color: "var(--theme-text-muted, rgba(255,255,255,0.45))",
              }}
            >
              {chip.label}
            </Link>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-3" style={{ borderTop: "1px solid var(--theme-border, #1F1F1F)" }}>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              placeholder={PLACEHOLDERS[placeholderIndex]}
              className="min-w-0 flex-1 border-b bg-transparent py-2 text-[13px] outline-none"
              style={{
                borderColor: "var(--theme-border, #1F1F1F)",
                color: "var(--theme-text-primary, #FFFFFF)",
              }}
            />
            <button
              onClick={handleSubmit}
              className="shrink-0 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.04em] transition-colors duration-75 hover:bg-white/90"
              style={{
                background: "var(--theme-text-primary, #FFFFFF)",
                color: "var(--theme-text-inverse, #000000)",
                borderRadius: "2px",
              }}
            >
              Ask
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-3 pt-1">
          <p
            className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.12em]"
            style={{ color: "var(--theme-text-ghost, rgba(255,255,255,0.25))" }}
          >
            POWERED BY CLAUDE · INDEPENDENT · NO MANUFACTURER PAYS
          </p>
        </div>
      </div>
    </div>
  );
}
