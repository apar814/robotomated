"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { RobotCardInline, parseRobotCards } from "@/components/advisor/robot-card-inline";
import { UpgradeModal } from "@/components/pro/upgrade-prompt";
import { cn } from "@/lib/utils/cn";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  "I want to automate my warehouse",
  "Best home robot for a family",
  "Robots for a small restaurant",
  "What robot vacuum should I buy?",
];

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initialSent = useRef(false);

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
        const data = await res.json();
        if (data.upgrade) {
          setShowUpgrade(true);
        }
        setError(data.error || "Something went wrong");
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
                setError(data.error);
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
    } catch (err) {
      setError("Failed to connect. Please try again.");
      setMessages(newMessages);
    }

    setStreaming(false);
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
    initialSent.current = false;
    inputRef.current?.focus();
  }

  const showStarters = messages.length === 0 && !initialMessage;

  return (
    <div className="flex h-full flex-col">
      {showUpgrade && (
        <UpgradeModal
          feature="You've reached your monthly limit"
          description="Free users get 5 AI Advisor conversations per month. Upgrade to Pro for unlimited conversations, price alerts, and more."
          onClose={() => setShowUpgrade(false)}
        />
      )}
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-[700px]">
          {/* Welcome state */}
          {showStarters && (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue to-violet">
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <rect x="4" y="4" width="16" height="12" rx="2" />
                  <circle cx="9" cy="10" r="1.5" />
                  <circle cx="15" cy="10" r="1.5" />
                  <path d="M8 20h8 M10 16v4 M14 16v4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">Robotomated AI Advisor</h2>
              <p className="mt-2 max-w-md text-sm text-muted">
                Tell me what you need and I&apos;ll recommend the perfect robot. I know every robot in our database.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="rounded-full border border-border bg-navy-light px-4 py-2.5 text-sm text-muted transition-all hover:border-blue/30 hover:text-foreground"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message list */}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn("mb-4 flex", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                  msg.role === "user"
                    ? "bg-blue text-navy"
                    : "bg-navy-light text-foreground"
                )}
              >
                {msg.role === "assistant" ? (
                  <MessageContent content={msg.content} />
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
                {msg.role === "assistant" && streaming && i === messages.length - 1 && (
                  <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-blue" />
                )}
              </div>
            </div>
          ))}

          {error && (
            <div className="mb-4 rounded-lg border border-orange/20 bg-orange/5 p-3 text-center text-sm text-orange">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-navy px-4 py-4">
        <div className="mx-auto max-w-[700px]">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about robots..."
              rows={1}
              disabled={streaming}
              className="flex-1 resize-none rounded-xl border border-border bg-navy-light px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-blue focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || streaming}
              className="shrink-0 rounded-xl bg-blue px-4 py-3 text-navy transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
              </svg>
            </button>
          </form>
          {messages.length > 0 && (
            <div className="mt-2 text-center">
              <button onClick={startOver} className="text-xs text-muted hover:text-foreground">
                Start Over
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Render message content with inline robot cards */
function MessageContent({ content }: { content: string }) {
  const { segments } = parseRobotCards(content);

  return (
    <div>
      {segments.map((seg, i) => {
        if (seg.type === "robot" && seg.robot) {
          return <RobotCardInline key={i} robot={seg.robot} />;
        }
        return (
          <span key={i} className="whitespace-pre-wrap">
            {seg.content}
          </span>
        );
      })}
    </div>
  );
}
