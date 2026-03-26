import { NextRequest } from "next/server";
import { anthropic, ADVISOR_MODEL, ADVISOR_SYSTEM_PROMPT } from "@/lib/ai/claude";
import { createServerClient } from "@/lib/supabase/server";
import { createServerClient as createSSRClient } from "@supabase/ssr";
import { isPro, getMonthlyConversationCount, PRO_LIMITS } from "@/lib/stripe/pro";

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

  // Check monthly conversation limit for free users
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

  // Rate limit check per session
  const supabase = createServerClient();
  const { data: existing } = await supabase
    .from("advisor_conversations")
    .select("id, messages")
    .eq("session_id", session_id)
    .single()
    .returns<{ id: string; messages: ChatMessage[] }>();

  const existingMsgCount = existing?.messages
    ? (existing.messages as ChatMessage[]).filter((m) => m.role === "user").length
    : 0;
  const currentUserMsgs = messages.filter((m) => m.role === "user").length;

  if (existingMsgCount + currentUserMsgs > MAX_REQUESTS_PER_SESSION) {
    return new Response(
      JSON.stringify({ error: "Session limit reached (10 messages). Please start a new conversation." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  // Fetch robot context for the system prompt
  const { data: robots } = await supabase
    .from("robots")
    .select("slug, name, robo_score, price_current, description_short, status, manufacturers(name), robot_categories(name, slug)")
    .eq("status", "active")
    .order("robo_score", { ascending: false, nullsFirst: false })
    .returns<{
      slug: string;
      name: string;
      robo_score: number | null;
      price_current: number | null;
      description_short: string | null;
      status: string;
      manufacturers: { name: string } | null;
      robot_categories: { name: string; slug: string } | null;
    }[]>();

  const robotContext = (robots || [])
    .map((r) => {
      const mfr = (r.manufacturers as { name: string } | null)?.name || "";
      const catObj = r.robot_categories as { name: string; slug: string } | null;
      const cat = catObj?.name || "";
      const catSlug = catObj?.slug || "all";
      return `- ${r.name} by ${mfr} | Category: ${cat} | CategorySlug: ${catSlug} | RoboScore: ${r.robo_score ?? "N/A"}/100 | Price: ${r.price_current != null ? `$${r.price_current.toLocaleString()}` : "Contact"} | Slug: ${r.slug} | ${r.description_short || ""}`;
    })
    .join("\n");

  const systemPrompt = `${ADVISOR_SYSTEM_PROMPT}\n\nAvailable robots in the database:\n${robotContext}`;

  // Stream response from Claude
  const stream = await anthropic.messages.stream({
    model: ADVISOR_MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  // Create a TransformStream to pipe the response
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

        // Save conversation after stream completes
        const allMessages = [...messages, { role: "assistant" as const, content: fullResponse }];

        if (existing) {
          await supabase
            .from("advisor_conversations")
            .update({ messages: allMessages as unknown as string })
            .eq("id", existing.id);
        } else {
          await supabase
            .from("advisor_conversations")
            .insert({
              session_id,
              messages: allMessages as unknown as string,
            });
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`)
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
