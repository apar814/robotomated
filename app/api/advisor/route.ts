import { NextRequest } from "next/server";
import { anthropic, ADVISOR_MODEL, ADVISOR_SYSTEM_PROMPT } from "@/lib/ai/claude";
import { createServerClient } from "@/lib/supabase/server";
import { createServerClient as createSSRClient } from "@supabase/ssr";
import { isPro, getMonthlyConversationCount, PRO_LIMITS } from "@/lib/stripe/pro";
import { buildRobotimusContext } from "@/lib/ai/context-builder";
import { classifyIntent } from "@/lib/ai/intent-classifier";

const MAX_REQUESTS_PER_SESSION = 10;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  const { messages, session_id } = (await request.json()) as {
    messages: ChatMessage[];
    session_id: string;
  };

  if (!messages?.length || !session_id) {
    return new Response(JSON.stringify({ error: "Missing messages or session_id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ── Auth check ──
  const authSupabase = createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll() {},
      },
    }
  );
  const { data: { user } } = await authSupabase.auth.getUser();

  if (user) {
    const userIsPro = await isPro(user.id);
    if (!userIsPro) {
      const monthlyCount = await getMonthlyConversationCount(user.id);
      if (monthlyCount >= PRO_LIMITS.free.advisorConversationsPerMonth) {
        return new Response(
          JSON.stringify({ error: "Monthly conversation limit reached. Upgrade to Pro for unlimited conversations.", upgrade: true }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  }

  // ── Session limit check ──
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServerClient() as any;
  const { data: existing } = await supabase
    .from("advisor_conversations")
    .select("id, messages")
    .eq("session_id", session_id)
    .single();

  const existingMsgCount = existing?.messages
    ? (existing.messages as ChatMessage[]).filter((m: ChatMessage) => m.role === "user").length
    : 0;
  const currentUserMsgs = messages.filter((m) => m.role === "user").length;

  if (existingMsgCount + currentUserMsgs > MAX_REQUESTS_PER_SESSION) {
    return new Response(
      JSON.stringify({ error: "Session limit reached (10 messages). Please start a new conversation." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  // ── UPGRADE 1: Build rich database context ──
  const latestUserMessage = messages.filter((m) => m.role === "user").pop()?.content || "";
  const databaseContext = await buildRobotimusContext(latestUserMessage);

  // ── UPGRADE 2: Classify intent and get specialized prompt ──
  const { intent, promptAddition } = classifyIntent(latestUserMessage);

  // ── UPGRADE 3: Load conversation memory ──
  let memoryContext = "";
  if (user) {
    const { data: prevConversations } = await supabase
      .from("advisor_conversations")
      .select("session_summary, use_case_detected, budget_mentioned, robots_discussed")
      .eq("user_id", user.id)
      .not("session_summary", "is", null)
      .order("created_at", { ascending: false })
      .limit(3);

    if (prevConversations && prevConversations.length > 0) {
      memoryContext = "\n\n[USER HISTORY — PREVIOUS CONVERSATIONS]\n";
      for (const conv of prevConversations as { session_summary: string; use_case_detected: string | null; budget_mentioned: number | null; robots_discussed: string[] }[]) {
        memoryContext += `- ${conv.session_summary}`;
        if (conv.budget_mentioned) memoryContext += ` Budget: $${conv.budget_mentioned.toLocaleString()}.`;
        if (conv.robots_discussed?.length) memoryContext += ` Robots discussed: ${conv.robots_discussed.join(", ")}.`;
        memoryContext += "\n";
      }
    }
  }

  // ── Assemble system prompt ──
  const systemPrompt = [
    ADVISOR_SYSTEM_PROMPT,
    promptAddition,
    databaseContext,
    memoryContext,
  ].filter(Boolean).join("\n");

  // ── Stream response ──
  const stream = await anthropic.messages.stream({
    model: ADVISOR_MODEL,
    max_tokens: 1500,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const encoder = new TextEncoder();
  let fullResponse = "";

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            const text = event.delta.text;
            fullResponse += text;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
        controller.close();

        // ── Save conversation with memory extraction ──
        const allMessages = [...messages, { role: "assistant" as const, content: fullResponse }];

        // Extract memory signals from conversation
        const budgetMatch = latestUserMessage.match(/\$[\d,]+[kKmM]?|\d+[kK]\b/);
        const budgetMentioned = budgetMatch
          ? parseInt(budgetMatch[0].replace(/[$,kK]/g, "")) * (budgetMatch[0].includes("k") || budgetMatch[0].includes("K") ? 1000 : 1)
          : null;

        // Extract robot names mentioned in the response
        const robotMatches = fullResponse.match(/:::robot\{[^}]*"name":"([^"]+)"[^}]*\}/g);
        const robotsDiscussed = robotMatches
          ? robotMatches.map((m) => {
              const nameMatch = m.match(/"name":"([^"]+)"/);
              return nameMatch ? nameMatch[1] : "";
            }).filter(Boolean)
          : [];

        // Build session summary
        const summaryParts: string[] = [];
        if (intent !== "DISCOVERY") summaryParts.push(`Intent: ${intent.toLowerCase()}.`);
        if (latestUserMessage.length > 20) summaryParts.push(`Query: "${latestUserMessage.slice(0, 100)}"`);
        if (robotsDiscussed.length > 0) summaryParts.push(`Recommended: ${robotsDiscussed.join(", ")}.`);
        const sessionSummary = summaryParts.join(" ") || null;

        const conversationData = {
          session_id,
          messages: allMessages as unknown as string,
          user_id: user?.id || null,
          use_case_detected: intent,
          budget_mentioned: budgetMentioned,
          robots_discussed: robotsDiscussed.length > 0 ? robotsDiscussed : null,
          session_summary: sessionSummary,
          intent_detected: intent,
        };

        if (existing) {
          await supabase
            .from("advisor_conversations")
            .update(conversationData)
            .eq("id", existing.id);
        } else {
          await supabase
            .from("advisor_conversations")
            .insert(conversationData);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Stream error";
        console.error("[advisor] Stream error:", message);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
