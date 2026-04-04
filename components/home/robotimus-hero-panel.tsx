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

    // Message 1 at 600ms
    timers.push(setTimeout(() => setVisibleMessages(1), 600));
    // Message 2 at 1200ms
    timers.push(setTimeout(() => setVisibleMessages(2), 1200));
    // Message 3 at 2000ms
    timers.push(setTimeout(() => setVisibleMessages(3), 2000));
    // Typing indicator at 2800ms
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
      className="w-full max-w-[420px] transition-all duration-500"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(20px)",
      }}
    >
      {/* Panel card */}
      <div
        className="overflow-hidden rounded-2xl border"
        style={{
          backgroundColor: "var(--theme-surface)",
          borderColor: "rgba(14,165,233,0.2)",
          boxShadow: "0 0 40px rgba(14,165,233,0.08)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: "var(--theme-border)" }}>
          <div className="relative">
            <RobotimusAvatar size={48} />
            <span
              className="absolute -bottom-0.5 -right-0.5 block h-3 w-3 rounded-full border-2 bg-emerald-500"
              style={{ borderColor: "var(--theme-surface)" }}
            />
          </div>
          <div className="flex-1">
            <p className="text-base font-bold" style={{ color: "var(--theme-text-primary)" }}>Robotimus</p>
            <p className="text-xs" style={{ color: "var(--theme-text-muted)" }}>Your robotics advisor</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] font-medium text-emerald-500">Online</span>
          </div>
        </div>

        {/* Chat messages */}
        <div className="h-[240px] overflow-hidden px-4 py-4 md:h-[240px]">
          <div className="flex flex-col gap-3">
            {conversation.slice(0, visibleMessages).map((msg, i) => (
              <div
                key={`${convoIndex}-${i}`}
                className="transition-opacity duration-300"
                style={{ opacity: 1 }}
              >
                {msg.role === "user" ? (
                  <div className="flex justify-end">
                    <div
                      className="max-w-[80%] rounded-xl rounded-br-sm px-3.5 py-2.5 text-[13px] leading-relaxed text-white"
                      style={{ backgroundColor: "#0EA5E9" }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <div className="mt-1 shrink-0">
                      <RobotimusAvatar size={24} />
                    </div>
                    <div>
                      <div
                        className="max-w-full rounded-xl rounded-bl-sm border px-3.5 py-2.5 text-[13px] leading-relaxed"
                        style={{
                          backgroundColor: "var(--theme-card)",
                          borderColor: "var(--theme-border)",
                          color: "var(--theme-text-primary)",
                        }}
                      >
                        {msg.text}
                      </div>
                      {msg.chips && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {msg.chips.map((chip) => (
                            <span
                              key={chip.label}
                              className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium"
                              style={{
                                backgroundColor: "rgba(14,165,233,0.1)",
                                border: "1px solid rgba(14,165,233,0.2)",
                                color: "#0EA5E9",
                              }}
                            >
                              {chip.label}
                              <span className="opacity-70">{chip.score}&uarr;</span>
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
                  <RobotimusAvatar size={24} />
                </div>
                <div
                  className="flex items-center gap-1.5 rounded-xl rounded-bl-sm border px-4 py-3"
                  style={{
                    backgroundColor: "var(--theme-card)",
                    borderColor: "var(--theme-border)",
                  }}
                >
                  <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[#0EA5E9]" style={{ animationDelay: "0ms" }} />
                  <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[#0EA5E9]" style={{ animationDelay: "150ms" }} />
                  <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[#0EA5E9]" style={{ animationDelay: "300ms" }} />
                  <span className="ml-2 text-xs" style={{ color: "var(--theme-text-muted)" }}>Robotimus is thinking...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input bar */}
        <div className="border-t px-3 py-3" style={{ borderColor: "var(--theme-border)" }}>
          <div
            className="flex items-center gap-2 rounded-lg border px-3.5 py-2.5 transition-colors focus-within:border-[#0EA5E9] focus-within:shadow-[0_0_0_3px_rgba(14,165,233,0.15)]"
            style={{
              backgroundColor: "var(--theme-input-bg)",
              borderColor: "var(--theme-input-border)",
            }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              placeholder={PLACEHOLDERS[placeholderIndex]}
              className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:transition-opacity"
              style={{ color: "var(--theme-text-primary)" }}
            />
            <button
              onClick={handleSubmit}
              className="shrink-0 rounded-md bg-[#0EA5E9] px-3 py-1.5 text-[13px] font-semibold text-black transition-colors hover:bg-[#0EA5E9]/90"
            >
              Ask &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Starter chips */}
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {STARTER_CHIPS.map((chip) => (
          <Link
            key={chip.label}
            href={`/advisor?q=${encodeURIComponent(chip.query)}`}
            className="rounded-full border px-2.5 py-1.5 text-[11px] transition-colors hover:border-[#0EA5E9] hover:text-[#0EA5E9]"
            style={{
              backgroundColor: "var(--theme-tag-bg)",
              borderColor: "var(--theme-tag-border)",
              color: "var(--theme-tag-text)",
            }}
          >
            {chip.label}
          </Link>
        ))}
      </div>

      {/* Footer text */}
      <p className="mt-3 text-center text-[10px]" style={{ color: "var(--theme-text-muted)" }}>
        Powered by Claude &middot; Independent &middot; No manufacturer pays for recommendations
      </p>
    </div>
  );
}
