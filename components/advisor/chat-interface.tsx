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
  { label: "I have $150K and need to automate my warehouse. Where do I start?", icon: "warehouse" },
  { label: "Is Boston Dynamics Spot actually worth $74,500?", icon: "consumer" },
  { label: "What\u2019s the cheapest robot that can replace a security guard?", icon: "cobot" },
  { label: "I\u2019m a forklift operator. Will robots take my job?", icon: "warehouse" },
  { label: "Help me build a CFO-ready business case for AMR deployment", icon: "manufacturing" },
  { label: "What\u2019s actually happening in humanoid robotics right now?", icon: "medical" },
];

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
  const followUps = lastMessage?.role === "assistant" && !streaming
    ? extractFollowUps(lastMessage.content)
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
              <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.label}
                    onClick={() => sendMessage(prompt.label)}
                    className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-left text-sm text-white/50 transition-all hover:border-[#2563EB]/30 hover:bg-white/[0.04] hover:text-white/80"
                  >
                    <PromptIcon type={prompt.icon} />
                    <span>{prompt.label}</span>
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
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                  msg.role === "user"
                    ? "bg-[#2563EB] text-white"
                    : "bg-white/[0.04] text-white/90"
                )}
              >
                {msg.role === "user" ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : streaming && i === messages.length - 1 ? (
                  /* During streaming: render raw text only — no markdown parsing on partial content */
                  <>
                    <p style={{ whiteSpace: "pre-wrap", color: "rgba(240,244,255,0.9)", lineHeight: 1.65, fontSize: "0.9rem" }}>{msg.content}</p>
                    <TypingIndicator />
                  </>
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
                  className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs text-white/50 transition-all hover:border-[#2563EB]/30 hover:text-white/80"
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
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-center text-sm text-red-400">
              {error}
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

/** Animated typing indicator */
function TypingIndicator() {
  return (
    <span className="ml-1 inline-flex items-center gap-0.5">
      <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[#2563EB]" style={{ animationDelay: "0ms" }} />
      <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[#2563EB]" style={{ animationDelay: "150ms" }} />
      <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[#2563EB]" style={{ animationDelay: "300ms" }} />
    </span>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const mdComponents = {
  p: ({ children }: any) => <p style={{ marginBottom: "0.65rem", lineHeight: 1.65, color: "rgba(240,244,255,0.9)", fontSize: "0.9rem" }}>{children}</p>,
  strong: ({ children }: any) => <strong style={{ fontWeight: 700, color: "#F0F4FF" }}>{children}</strong>,
  em: ({ children }: any) => <em style={{ color: "rgba(240,244,255,0.85)" }}>{children}</em>,
  h2: ({ children }: any) => <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "#F0F4FF", marginBottom: "0.4rem", marginTop: "0.85rem" }}>{children}</p>,
  h3: ({ children }: any) => <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "#F0F4FF", marginBottom: "0.3rem", marginTop: "0.65rem" }}>{children}</p>,
  ul: ({ children }: any) => <ul style={{ marginLeft: "1.1rem", marginBottom: "0.65rem", listStyleType: "disc" }}>{children}</ul>,
  ol: ({ children }: any) => <ol style={{ marginLeft: "1.1rem", marginBottom: "0.65rem", listStyleType: "decimal" }}>{children}</ol>,
  li: ({ children }: any) => <li style={{ marginBottom: "0.25rem", lineHeight: 1.6, color: "rgba(240,244,255,0.85)" }}>{children}</li>,
  hr: () => <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)", margin: "0.85rem 0" }} />,
  code: ({ children }: any) => <code style={{ background: "rgba(255,255,255,0.08)", padding: "0.15rem 0.35rem", borderRadius: "3px", fontSize: "0.82rem", color: "#60A5FA" }}>{children}</code>,
  blockquote: ({ children }: any) => <blockquote style={{ borderLeft: "2px solid #2563EB", paddingLeft: "1rem", margin: "0.5rem 0", color: "rgba(240,244,255,0.65)" }}>{children}</blockquote>,
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

/** Small icon for prompt chips */
function PromptIcon({ type }: { type: string }) {
  const cls = "h-5 w-5 shrink-0 text-[#60A5FA]/50 group-hover:text-[#60A5FA] transition-colors";
  switch (type) {
    case "warehouse":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path d="M3 21V8l9-5 9 5v13" /><rect x="7" y="13" width="4" height="8" /><rect x="13" y="13" width="4" height="8" />
        </svg>
      );
    case "medical":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path d="M12 2v20M2 12h20" strokeLinecap="round" />
        </svg>
      );
    case "manufacturing":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path d="M4 20h16M6 20V10l4 3V7l4 3V4l4 3v13" />
        </svg>
      );
    case "consumer":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <rect x="4" y="4" width="16" height="12" rx="2" /><circle cx="9" cy="10" r="1.5" /><circle cx="15" cy="10" r="1.5" /><path d="M8 20h8 M10 16v4 M14 16v4" />
        </svg>
      );
    case "cobot":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      );
    default:
      return null;
  }
}
