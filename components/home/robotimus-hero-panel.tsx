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

const TICKER_TEXT =
  "FLEET STATUS: 975 ROBOTS INDEXED \u00B7\u00B7\u00B7 MARKET: $24T PROJECTED \u00B7\u00B7\u00B7 LAST ANALYSIS: 0:03 AGO \u00B7\u00B7\u00B7 SAFETY STANDARDS: 2027 RATIFICATION \u00B7\u00B7\u00B7 HUMANOID COST: -40% YoY \u00B7\u00B7\u00B7";

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
    <>
      {/* Keyframe animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes panelGlow {
          0%, 100% { box-shadow: 0 0 40px rgba(37,99,235,0.15), 0 0 80px rgba(37,99,235,0.05); }
          50% { box-shadow: 0 0 40px rgba(37,99,235,0.25), 0 0 80px rgba(37,99,235,0.1); }
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes greenPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      ` }} />

      <div
        className="w-full max-w-[420px] transition-all duration-500"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
        }}
      >
        {/* Panel card */}
        <div
          className="relative overflow-hidden"
          style={{
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(37,99,235,0.3)",
            borderRadius: "16px",
            animation: "panelGlow 4s ease-in-out infinite",
          }}
        >
          {/* Corner brackets — top-left */}
          <span
            className="pointer-events-none absolute left-0 top-0"
            style={{
              width: "12px",
              height: "12px",
              borderLeft: "2px solid rgba(37,99,235,0.4)",
              borderTop: "2px solid rgba(37,99,235,0.4)",
            }}
          />
          {/* Corner brackets — top-right */}
          <span
            className="pointer-events-none absolute right-0 top-0"
            style={{
              width: "12px",
              height: "12px",
              borderRight: "2px solid rgba(37,99,235,0.4)",
              borderTop: "2px solid rgba(37,99,235,0.4)",
            }}
          />

          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{
              background: "rgba(37,99,235,0.08)",
              borderBottom: "1px solid rgba(37,99,235,0.15)",
            }}
          >
            <div className="relative">
              {/* Avatar with gradient background */}
              <div
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full"
                style={{
                  background: "linear-gradient(135deg, #2563EB, #7B2FFF)",
                }}
              >
                <RobotimusAvatar size={32} />
              </div>
              {/* Pulse ring */}
              <span
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  border: "2px solid rgba(37,99,235,0.5)",
                  animation: "pulseRing 2s ease-out infinite",
                }}
              />
            </div>
            <div className="flex-1">
              <p
                className="font-[family-name:var(--font-brand)] text-[13px] font-semibold text-white"
              >
                ROBOTIMUS
              </p>
              <p
                className="font-[family-name:var(--font-ui)] text-[13px] tracking-[0.12em]"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                AI ROBOTICS ADVISOR
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="block h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: "#10B981",
                  animation: "greenPulse 2s ease-in-out infinite",
                }}
              />
              <span
                className="font-[family-name:var(--font-ui)] text-[13px] tracking-[0.08em]"
                style={{ color: "#10B981" }}
              >
                ONLINE
              </span>
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
                        style={{
                          background: "linear-gradient(135deg, #2563EB, #0284C7)",
                          boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
                        }}
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
                          className="max-w-full rounded-xl rounded-bl-sm px-3.5 py-2.5 text-[13px] leading-relaxed"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderLeft: "2px solid #2563EB",
                            color: "rgba(255,255,255,0.85)",
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
                                  backgroundColor: "rgba(37,99,235,0.08)",
                                  border: "1px solid rgba(37,99,235,0.2)",
                                  color: "#2563EB",
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
                    className="flex items-center gap-2 rounded-xl rounded-bl-sm px-4 py-3"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderLeft: "2px solid #2563EB",
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full bg-[#2563EB]"
                        style={{ animation: "dotPulse 1.4s ease-in-out infinite", animationDelay: "0ms" }}
                      />
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full bg-[#2563EB]"
                        style={{ animation: "dotPulse 1.4s ease-in-out infinite", animationDelay: "200ms" }}
                      />
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full bg-[#2563EB]"
                        style={{ animation: "dotPulse 1.4s ease-in-out infinite", animationDelay: "400ms" }}
                      />
                    </div>
                    <span
                      className="font-[family-name:var(--font-brand)] text-[13px] tracking-[0.15em]"
                      style={{ color: "rgba(37,99,235,0.6)" }}
                    >
                      PROCESSING...
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Data ticker */}
          <div
            className="relative overflow-hidden"
            style={{
              height: "24px",
              background: "rgba(0,0,0,0.3)",
              borderTop: "1px solid rgba(37,99,235,0.1)",
            }}
          >
            <div
              className="absolute top-0 flex h-full items-center whitespace-nowrap font-[family-name:var(--font-mono)] text-[13px]"
              style={{
                color: "rgba(37,99,235,0.5)",
                animation: "ticker 30s linear infinite",
              }}
            >
              <span className="px-4">{TICKER_TEXT}</span>
              <span className="px-4">{TICKER_TEXT}</span>
            </div>
          </div>

          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-1.5 px-4 py-2.5">
            {STARTER_CHIPS.map((chip) => (
              <Link
                key={chip.label}
                href={`/advisor?q=${encodeURIComponent(chip.query)}`}
                className="rounded-full px-2.5 py-1 text-[11px] transition-all duration-200"
                style={{
                  backgroundColor: "rgba(37,99,235,0.08)",
                  border: "1px solid rgba(37,99,235,0.2)",
                  color: "#2563EB",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.backgroundColor = "rgba(37,99,235,0.15)";
                  el.style.borderColor = "rgba(37,99,235,0.4)";
                  el.style.transform = "translateY(-1px)";
                  el.style.boxShadow = "0 4px 12px rgba(37,99,235,0.2)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.backgroundColor = "rgba(37,99,235,0.08)";
                  el.style.borderColor = "rgba(37,99,235,0.2)";
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                {chip.label}
              </Link>
            ))}
          </div>

          {/* Input area */}
          <div
            className="px-3 py-3"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderTop: "1px solid rgba(37,99,235,0.15)",
            }}
          >
            <div
              className="flex items-center gap-2 rounded-lg px-3.5 py-2.5 transition-all duration-200"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onFocusCapture={(e) => {
                e.currentTarget.style.borderColor = "rgba(37,99,235,0.4)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)";
              }}
              onBlurCapture={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                placeholder={PLACEHOLDERS[placeholderIndex]}
                className="min-w-0 flex-1 bg-transparent text-[13px] outline-none"
                style={{
                  color: "rgba(255,255,255,0.9)",
                }}
              />
              <button
                onClick={handleSubmit}
                className="shrink-0 rounded-md px-3 py-1.5 text-[13px] font-semibold text-black transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #2563EB, #0284C7)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 16px rgba(37,99,235,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Ask &rarr;
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 pb-3 pt-1 text-center">
            <p
              className="font-[family-name:var(--font-brand)] text-[8px] tracking-[0.12em]"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              POWERED BY CLAUDE &middot; INDEPENDENT &middot; NO MANUFACTURER PAYS
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
