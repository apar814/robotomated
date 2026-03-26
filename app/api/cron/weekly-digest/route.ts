import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { resend, EMAIL_FROM } from "@/lib/email/resend";
import { anthropic, ADVISOR_MODEL } from "@/lib/ai/claude";

// Verify cron secret to prevent unauthorized access
function verifyCron(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

interface NewsItem {
  title: string;
  url: string;
  snippet: string;
}

async function fetchRoboticsNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        query: "robotics industry news this week 2026",
        limit: 5,
        scrapeOptions: { formats: ["markdown"] },
      }),
    });

    if (!res.ok) return [];

    const data = await res.json();
    return (data.data || []).slice(0, 5).map((item: { title?: string; url?: string; markdown?: string }) => ({
      title: item.title || "Untitled",
      url: item.url || "#",
      snippet: (item.markdown || "").slice(0, 200),
    }));
  } catch {
    return [];
  }
}

async function generateDigest(
  news: NewsItem[],
  newRobots: { name: string; manufacturer: string; price: number | null }[]
): Promise<string> {
  const newsContext = news
    .map((n, i) => `${i + 1}. ${n.title}\n   ${n.snippet}`)
    .join("\n\n");

  const robotsContext = newRobots.length > 0
    ? newRobots.map((r) => `- ${r.name} by ${r.manufacturer} (${r.price ? `$${r.price.toLocaleString()}` : "Price TBD"})`).join("\n")
    : "No new robots added this week.";

  const response = await anthropic.messages.create({
    model: ADVISOR_MODEL,
    max_tokens: 400,
    messages: [
      {
        role: "user",
        content: `Write a 200-word weekly robotics industry digest email for Robotomated subscribers. Tone: authoritative, accessible, concise. No fluff.

Top news this week:
${newsContext}

New robots added to Robotomated:
${robotsContext}

Format: Start with a one-line hook. Cover the top 2-3 stories briefly. Mention new robots if any. End with a forward-looking sentence. Do NOT use markdown headers or bullet points — this is a plain text email paragraph style. Do NOT include a subject line.`,
      },
    ],
  });

  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}

function buildHtml(digest: string, news: NewsItem[], unsubscribeUrl: string): string {
  const newsLinks = news
    .map((n) => `<li><a href="${n.url}" style="color:#00C2FF;text-decoration:none;">${n.title}</a></li>`)
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="background:#0A0F1E;color:#e0e0e0;font-family:'Space Grotesk',system-ui,sans-serif;padding:32px;max-width:600px;margin:0 auto;">
  <div style="text-align:center;margin-bottom:24px;">
    <h1 style="color:#00C2FF;font-size:24px;margin:0;">Robotomated Weekly</h1>
    <p style="color:#888;font-size:13px;margin:4px 0 0;">Your weekly robotics intelligence digest</p>
  </div>
  <div style="background:#141A2E;border-radius:12px;padding:24px;margin-bottom:24px;line-height:1.7;font-size:15px;">
    ${digest.split("\n\n").map((p) => `<p style="margin:0 0 16px;">${p}</p>`).join("")}
  </div>
  <div style="background:#141A2E;border-radius:12px;padding:24px;margin-bottom:24px;">
    <h2 style="color:#00C2FF;font-size:16px;margin:0 0 12px;">Top Stories</h2>
    <ul style="padding-left:18px;margin:0;line-height:2;">${newsLinks}</ul>
  </div>
  <div style="text-align:center;padding:24px 0;border-top:1px solid #222;">
    <a href="https://robotomated.com" style="color:#00C2FF;text-decoration:none;font-size:13px;">robotomated.com</a>
    <span style="color:#555;margin:0 8px;">|</span>
    <a href="${unsubscribeUrl}" style="color:#888;text-decoration:none;font-size:13px;">Unsubscribe</a>
  </div>
</body>
</html>`;
}

export async function GET(request: NextRequest) {
  if (!verifyCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();

  // Fetch subscribers
  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, unsubscribe_token")
    .returns<{ id: string; email: string; unsubscribe_token: string }[]>();

  if (!subscribers?.length) {
    return NextResponse.json({ message: "No subscribers", sent: 0 });
  }

  // Fetch top news
  const news = await fetchRoboticsNews();

  // Fetch robots added this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const { data: newRobots } = await supabase
    .from("robots")
    .select("name, price_current, manufacturers(name)")
    .gte("created_at", oneWeekAgo.toISOString())
    .eq("status", "active")
    .returns<{ name: string; price_current: number | null; manufacturers: { name: string } | null }[]>();

  const robotsList = (newRobots || []).map((r) => ({
    name: r.name,
    manufacturer: r.manufacturers?.name || "Unknown",
    price: r.price_current,
  }));

  // Generate AI digest
  const digest = await generateDigest(news, robotsList);

  // Send emails in batches of 50
  let sent = 0;
  const batchSize = 50;

  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);
    const promises = batch.map((sub) => {
      const unsubscribeUrl = `https://robotomated.com/unsubscribe?token=${sub.unsubscribe_token}`;
      const html = buildHtml(digest, news, unsubscribeUrl);

      return resend.emails.send({
        from: EMAIL_FROM,
        to: sub.email,
        subject: `Robotomated Weekly — ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
        html,
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
        },
      });
    });

    const results = await Promise.allSettled(promises);
    sent += results.filter((r) => r.status === "fulfilled").length;
  }

  return NextResponse.json({ message: "Digest sent", sent, total: subscribers.length });
}
