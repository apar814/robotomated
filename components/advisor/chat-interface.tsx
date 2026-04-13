"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { RobotCardInline, parseRobotCards, type RobotRecommendation } from "@/components/advisor/robot-card-inline";
import { UpgradeModal } from "@/components/pro/upgrade-prompt";
import { RobotimusAvatar } from "@/components/advisor/robotimus-avatar";
import { cn } from "@/lib/utils/cn";
import ReactMarkdown from "react-markdown";

interface RobotLookupResult {
  slug: string;
  name: string;
  score: number | null;
  price: number | null;
  category: string;
  image_url: string | null;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "robotomated-advisor-history";
const MAX_STORED_MESSAGES = 20;

const STARTER_PROMPTS = [
  { text: "I have $150K and need to automate my warehouse. Where do I start?", subtitle: "Get a ranked shortlist with TCO analysis" },
  { text: "Is Boston Dynamics Spot actually worth $74,500?", subtitle: "Independent verdict on Boston Dynamics\u2019 flagship" },
  { text: "What\u2019s the cheapest robot that can replace a security guard?", subtitle: "Find the cheapest capable option" },
  { text: "I\u2019m a forklift operator. Will robots take my job?", subtitle: "Honest answer + what skills to build" },
  { text: "Build me a CFO-ready business case for AMR deployment", subtitle: "ROI model you can present to leadership" },
  { text: "What\u2019s actually happening in humanoid robotics right now?", subtitle: "What\u2019s real vs what\u2019s hype in 2026" },
];

/** Generate contextual follow-up chips based on response content */
function generateFollowUps(content: string): string[] {
  const chips: string[] = [];
  const lower = content.toLowerCase();

  if (lower.includes("price") || lower.includes("cost") || lower.includes("$"))
    chips.push("What\u2019s the 5-year total cost of ownership?");
  if (lower.includes("deploy") || lower.includes("install") || lower.includes("setup"))
    chips.push("What certification do operators need?");
  if (/warehouse|amr|agv|mobile robot/i.test(lower))
    chips.push("Show me the top 5 warehouse robots");
  if (/cobot|collaborative|universal robots|fanuc/i.test(lower))
    chips.push("How does it compare to alternatives?");
  if (lower.includes("humanoid") || lower.includes("figure") || lower.includes("unitree"))
    chips.push("Which humanoid robots can I actually buy today?");
  if (lower.includes("security") || lower.includes("patrol"))
    chips.push("What\u2019s the ROI vs hiring a guard?");
  if (lower.includes("cleaning") || lower.includes("scrub"))
    chips.push("Show me the top 5 cleaning robots");

  // Fill to 3 with defaults
  const defaults = [
    "What does this cost to deploy?",
    "Which alternative should I consider?",
    "How long does deployment take?",
  ];
  for (const d of defaults) {
    if (chips.length >= 3) break;
    if (!chips.includes(d)) chips.push(d);
  }

  return chips.slice(0, 3);
}

/** Extract follow-up question suggestions from Robotimus responses */
function extractFollowUps(content: string): string[] {
  const lines = content.split("\n");
  const followUps: string[] = [];
  let inFollowUpSection = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/follow.?up|you might|want to ask|could also ask/i.test(trimmed) && !trimmed.startsWith(":::")) {
      inFollowUpSection = true;
      continue;
    }
    if (inFollowUpSection) {
      // Match numbered or bulleted items
      const match = trimmed.match(/^(?:\d+[.)]\s*|[-*]\s*|>\s*)(.+)/);
      if (match && match[1].length > 10 && match[1].length < 120) {
        // Strip surrounding quotes and question marks cleanup
        const clean = match[1].replace(/^["']|["']$/g, "").trim();
        if (clean.length > 10) followUps.push(clean);
      }
    }
  }

  return followUps.slice(0, 3);
}

function loadSavedMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved) as ChatMessage[];
    return Array.isArray(parsed) ? parsed.slice(-MAX_STORED_MESSAGES) : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: ChatMessage[]) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(messages.slice(-MAX_STORED_MESSAGES))
    );
  } catch {
    // localStorage full or unavailable
  }
}

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function ChatInterface({ initialMessage }: { initialMessage?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sessionId, setSessionId] = useState(() => generateSessionId());
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [restored, setRestored] = useState(false);
  const [enrichedRobots, setEnrichedRobots] = useState<Record<string, RobotLookupResult>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initialSent = useRef(false);

  // Restore conversation from localStorage on mount
  useEffect(() => {
    if (!initialMessage) {
      const saved = loadSavedMessages();
      if (saved.length > 0) {
        setMessages(saved);
        setRestored(true);
        // Enrich any robot cards from restored messages
        const assistantMsgs = saved.filter((m) => m.role === "assistant");
        for (const msg of assistantMsgs) {
          enrichRobotCards(msg.content);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage]);

  // Persist messages to localStorage on change
  useEffect(() => {
    if (messages.length > 0 && !streaming) {
      saveMessages(messages);
    }
  }, [messages, streaming]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle initial message from URL
  useEffect(() => {
    if (initialMessage && !initialSent.current && messages.length === 0) {
      initialSent.current = true;
      sendMessage(initialMessage);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage]);

  async function sendMessage(text: string) {
    if (!text.trim() || streaming) return;

    const userMessage: ChatMessage = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setError("");
    setStreaming(true);

    // Add empty assistant message for streaming
    const assistantMessage: ChatMessage = { role: "assistant", content: "" };
    setMessages([...newMessages, assistantMessage]);

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          session_id: sessionId,
        }),
      });

      if (!res.ok) {
        try {
          const data = await res.json();
          if (data.upgrade) {
            setShowUpgrade(true);
          }
          // Clean up raw API errors for the user
          const errMsg = typeof data.error === "string" && data.error.length < 200
            ? data.error
            : "Robotimus is temporarily unavailable. Please try again in a moment.";
          setError(errMsg);
        } catch {
          setError("Robotimus is temporarily unavailable. Please try again in a moment.");
        }
        setMessages(newMessages);
        setStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.done) break;
              if (data.error) {
                setError(typeof data.error === "string" && data.error.length < 200
                  ? data.error
                  : "Robotimus encountered an issue. Please try again.");
                break;
              }
              if (data.text) {
                accumulated += data.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content: accumulated };
                  return updated;
                });
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }
      // Enrich robot cards with images from DB
      enrichRobotCards(accumulated);
    } catch {
      setError("Failed to connect. Please try again.");
      setMessages(newMessages);
    }

    setStreaming(false);
  }

  async function enrichRobotCards(text: string) {
    const { segments } = parseRobotCards(text);
    const slugs = segments
      .filter((s) => s.type === "robot" && s.robot?.slug)
      .map((s) => s.robot!.slug)
      .slice(0, 3);

    if (slugs.length === 0) return;

    // Skip slugs we already have
    const needed = slugs.filter((s) => !enrichedRobots[s]);
    if (needed.length === 0) return;

    try {
      const res = await fetch(`/api/robots/lookup?slugs=${needed.join(",")}`);
      if (!res.ok) return;
      const { robots } = await res.json() as { robots: RobotLookupResult[] };
      if (!robots?.length) return;

      setEnrichedRobots((prev) => {
        const next = { ...prev };
        for (const r of robots) {
          next[r.slug] = r;
        }
        return next;
      });
    } catch {
      // Non-critical — cards still render with AI-provided data
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function startOver() {
    setMessages([]);
    setSessionId(generateSessionId());
    setError("");
    setRestored(false);
    initialSent.current = false;
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    inputRef.current?.focus();
  }

  const showStarters = messages.length === 0 && !initialMessage;
  const lastMessage = messages[messages.length - 1];
  const extracted = lastMessage?.role === "assistant" && !streaming
    ? extractFollowUps(lastMessage.content)
    : [];
  const followUps = lastMessage?.role === "assistant" && !streaming
    ? (extracted.length > 0 ? extracted : generateFollowUps(lastMessage.content))
    : [];

  return (
    <div className="flex h-full flex-col bg-[#0A0F1E]">
      {showUpgrade && (
        <UpgradeModal
          feature="You've reached your monthly limit"
          description="Free users get 5 Robotimus conversations per month. Upgrade to Pro for unlimited conversations, price alerts, and more."
          onClose={() => setShowUpgrade(false)}
        />
      )}

      {/* Chat header */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
        <RobotimusAvatar size="md" />
        <div>
          <h2 className="text-sm font-semibold text-white">Robotimus</h2>
          <p className="text-[11px] text-white/40">Your independent robotics advisor</p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-[700px]">
          {/* Welcome state */}
          {showStarters && (
            <div className="flex flex-col items-center py-12 text-center">
              <RobotimusAvatar size="lg" />
              <h2 className="mt-4 text-xl font-bold text-white">Robotimus</h2>
              <p className="text-xs text-white/40">Your independent robotics advisor</p>
              <p className="mt-3 max-w-md text-sm text-white/50">
                Tell me what you need and I&apos;ll recommend the perfect robot. I know every robot in our database and I&apos;ll tell you straight whether to buy, lease, or hire.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.text}
                    onClick={() => sendMessage(prompt.text)}
                    className="w-full rounded-[10px] text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(37,99,235,0.3)] hover:bg-[rgba(14,18,38,0.95)]"
                    style={{
                      background: "rgba(10,12,28,0.9)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      padding: "1rem 1.25rem",
                    }}
                  >
                    <span style={{
                      fontFamily: "var(--font-ui, 'Space Grotesk'), sans-serif",
                      fontWeight: 700,
                      fontSize: "0.88rem",
                      color: "#F0F4FF",
                      lineHeight: 1.4,
                      display: "block",
                    }}>
                      {prompt.text}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-ui, 'Space Grotesk'), sans-serif",
                      fontWeight: 500,
                      fontSize: "0.75rem",
                      color: "rgba(240,244,255,0.4)",
                      marginTop: "0.3rem",
                      display: "block",
                    }}>
                      {prompt.subtitle}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Restored conversation notice */}
          {restored && messages.length > 0 && (
            <div className="mb-4 text-center">
              <span className="inline-block rounded-full bg-white/[0.04] px-3 py-1 text-xs text-white/40">
                Restored previous conversation
              </span>
            </div>
          )}

          {/* Message list */}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn("mb-4 flex", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              {/* Robotimus avatar for assistant messages */}
              {msg.role === "assistant" && (
                <div className="mr-2 mt-1">
                  <RobotimusAvatar size="sm" />
                </div>
              )}
              <div
                style={msg.role === "user"
                  ? {
                      background: "#2563EB",
                      borderRadius: "12px 12px 4px 12px",
                      padding: "0.85rem 1.25rem",
                      color: "#FFFFFF",
                      maxWidth: "75%",
                      fontSize: "0.92rem",
                    }
                  : {
                      background: "linear-gradient(160deg, rgba(10,12,28,0.95) 0%, rgba(6,8,20,0.98) 100%)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "12px 12px 12px 4px",
                      padding: "1.25rem 1.5rem",
                      color: "rgba(240,244,255,0.88)",
                      maxWidth: "85%",
                      fontSize: "0.92rem",
                    }
                }
              >
                {msg.role === "user" ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : streaming && i === messages.length - 1 ? (
                  /* During streaming: render raw text only — no markdown parsing on partial content */
                  <div style={{ fontFamily: "var(--font-ui, 'Space Grotesk'), sans-serif", fontSize: "0.92rem", fontWeight: 500, lineHeight: 1.7, color: "rgba(240,244,255,0.9)", whiteSpace: "pre-wrap" }}>
                    {msg.content}
                    <span style={{ display: "inline-block", width: 2, height: "1em", background: "#2563EB", marginLeft: 2, verticalAlign: "text-bottom", animation: "blink 1s step-end infinite" }} />
                  </div>
                ) : (
                  /* After streaming complete: render with markdown + robot cards */
                  <MessageContent content={msg.content} enriched={enrichedRobots} />
                )}
              </div>
            </div>
          ))}

          {/* Follow-up suggestion chips */}
          {followUps.length > 0 && (
            <div className="mb-4 ml-8 flex flex-wrap gap-2">
              {followUps.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="transition-all hover:bg-[rgba(37,99,235,0.15)]"
                  style={{
                    background: "rgba(37,99,235,0.08)",
                    border: "1px solid rgba(37,99,235,0.25)",
                    color: "#60A5FA",
                    fontFamily: "var(--font-ui, 'Space Grotesk'), sans-serif",
                    fontWeight: 600,
                    fontSize: "0.78rem",
                    padding: "0.4rem 0.85rem",
                    borderRadius: 20,
                    cursor: "pointer",
                    minHeight: "auto",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Action CTAs after conversation with recommendations */}
          {!streaming && messages.length >= 4 && lastMessage?.role === "assistant" && hasRobotCards(lastMessage.content) && (
            <div className="mb-4 ml-8 flex flex-wrap gap-2">
              <Link
                href="/explore"
                className="rounded-lg border border-[#2563EB]/20 bg-[#2563EB]/10 px-3 py-1.5 text-xs font-medium text-[#2563EB] transition-colors hover:bg-[#2563EB]/20"
              >
                Browse all robots
              </Link>
              <Link
                href="/robowork"
                className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:text-white/80"
              >
                Hire on RoboWork
              </Link>
              <Link
                href="/lease"
                className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:text-white/80"
              >
                Explore leasing
              </Link>
            </div>
          )}

          {error && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "1rem 1.25rem", marginBottom: "1rem" }}>
              <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "#F87171" }}>
                Robotimus is thinking hard about that one.
              </p>
              <p style={{ fontSize: "0.82rem", color: "rgba(240,244,255,0.5)", marginTop: "0.25rem" }}>
                Try again in a moment.
              </p>
              <button
                onClick={() => { setError(""); if (messages.length > 0) { const lastUser = [...messages].reverse().find(m => m.role === "user"); if (lastUser) sendMessage(lastUser.content); } }}
                style={{ marginTop: "0.5rem", fontSize: "0.78rem", fontWeight: 700, color: "#60A5FA", background: "none", border: "none", cursor: "pointer", padding: 0, textTransform: "uppercase", letterSpacing: "0.08em", minHeight: "auto", minWidth: "auto" }}
              >
                Try Again
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-white/[0.06] bg-[#080C18] px-4 py-4">
        <div className="mx-auto max-w-[700px]">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Robotimus about robots..."
              rows={1}
              disabled={streaming}
              className="flex-1 resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-[#2563EB]/40 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || streaming}
              className="shrink-0 rounded-xl bg-[#2563EB] px-4 py-3 text-[#0A0F1E] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
              </svg>
            </button>
          </form>
          {messages.length > 0 && (
            <div className="mt-2 text-center">
              <button onClick={startOver} className="text-xs text-white/50 hover:text-white/60">
                Start over
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Check if message contains robot recommendation cards */
function hasRobotCards(content: string): boolean {
  return content.includes(":::robot{");
}

/* TypingIndicator removed — streaming now shows blinking cursor inline */

/* eslint-disable @typescript-eslint/no-explicit-any */
const mdComponents = {
  p: ({ children }: any) => <p style={{ marginBottom: "0.7rem", lineHeight: 1.7, color: "rgba(240,244,255,0.88)", fontSize: "0.92rem", fontWeight: 500 }}>{children}</p>,
  strong: ({ children }: any) => <strong style={{ fontWeight: 700, color: "#F0F4FF" }}>{children}</strong>,
  em: ({ children }: any) => <em style={{ color: "rgba(240,244,255,0.8)", fontStyle: "italic" }}>{children}</em>,
  h1: ({ children }: any) => <p style={{ fontWeight: 700, fontSize: "1.1rem", color: "#F0F4FF", marginBottom: "0.5rem", marginTop: "1rem" }}>{children}</p>,
  h2: ({ children }: any) => <p style={{ fontWeight: 700, fontSize: "1rem", color: "#F0F4FF", marginBottom: "0.4rem", marginTop: "0.9rem" }}>{children}</p>,
  h3: ({ children }: any) => <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "#F0F4FF", marginBottom: "0.35rem", marginTop: "0.75rem" }}>{children}</p>,
  ul: ({ children }: any) => <ul style={{ marginLeft: "1.25rem", marginBottom: "0.7rem", listStyleType: "disc" }}>{children}</ul>,
  ol: ({ children }: any) => <ol style={{ marginLeft: "1.25rem", marginBottom: "0.7rem", listStyleType: "decimal" }}>{children}</ol>,
  li: ({ children }: any) => <li style={{ marginBottom: "0.3rem", lineHeight: 1.65, color: "rgba(240,244,255,0.85)", fontSize: "0.92rem" }}>{children}</li>,
  hr: () => <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)", margin: "0.85rem 0" }} />,
  code: ({ children, className }: any) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <pre style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "0.75rem 1rem", overflowX: "auto", margin: "0.75rem 0" }}>
          <code style={{ fontSize: "0.82rem", color: "#60A5FA", fontFamily: "monospace" }}>{children}</code>
        </pre>
      );
    }
    return <code style={{ background: "rgba(255,255,255,0.08)", padding: "0.1rem 0.35rem", borderRadius: 3, fontSize: "0.85rem", color: "#60A5FA", fontFamily: "monospace" }}>{children}</code>;
  },
  blockquote: ({ children }: any) => <blockquote style={{ borderLeft: "2px solid #2563EB", paddingLeft: "1rem", margin: "0.5rem 0", color: "rgba(240,244,255,0.65)" }}>{children}</blockquote>,
  a: ({ children, href }: any) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#60A5FA", textDecoration: "underline" }}>{children}</a>,
  table: ({ children }: any) => <div style={{ overflowX: "auto", margin: "0.75rem 0" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>{children}</table></div>,
  th: ({ children }: any) => <th style={{ padding: "0.5rem 0.75rem", background: "rgba(37,99,235,0.15)", color: "#F0F4FF", fontWeight: 700, textAlign: "left", borderBottom: "1px solid rgba(37,99,235,0.3)" }}>{children}</th>,
  td: ({ children }: any) => <td style={{ padding: "0.5rem 0.75rem", color: "rgba(240,244,255,0.75)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{children}</td>,
};
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Render message content with inline robot cards, enriched with DB data */
function MessageContent({ content, enriched }: { content: string; enriched: Record<string, RobotLookupResult> }) {
  const { segments } = parseRobotCards(content);

  return (
    <div>
      {segments.map((seg, i) => {
        if (seg.type === "robot" && seg.robot) {
          const dbData = enriched[seg.robot.slug];
          const merged: RobotRecommendation = {
            ...seg.robot,
            image_url: dbData?.image_url || seg.robot.image_url,
            category: dbData?.category || seg.robot.category,
            score: dbData?.score ?? seg.robot.score,
            price: dbData?.price ?? seg.robot.price,
          };
          return <RobotCardInline key={i} robot={merged} />;
        }
        return (
          <div key={i}>
            <ReactMarkdown components={mdComponents}>{seg.content}</ReactMarkdown>
          </div>
        );
      })}
    </div>
  );
}

/* PromptIcon removed — starters now use text-only cards */
