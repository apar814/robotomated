import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { resend, EMAIL_FROM } from "@/lib/email/resend";

function verifyCron(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

interface AlertRow {
  id: string;
  email: string;
  target_price: number;
  robot_id: string;
  robots: {
    name: string;
    slug: string;
    price_current: number | null;
    robot_categories: { slug: string } | null;
  };
}

function buildPriceDropEmail(robotName: string, oldTarget: number, newPrice: number, robotUrl: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="background:#0A0F1E;color:#e0e0e0;font-family:'Space Grotesk',system-ui,sans-serif;padding:32px;max-width:600px;margin:0 auto;">
  <div style="text-align:center;margin-bottom:24px;">
    <h1 style="color:#00C2FF;font-size:24px;margin:0;">Price Drop Alert</h1>
    <p style="color:#888;font-size:13px;margin:4px 0 0;">Robotomated Price Watch</p>
  </div>
  <div style="background:#141A2E;border-radius:12px;padding:24px;margin-bottom:24px;">
    <h2 style="color:#00E5A0;font-size:20px;margin:0 0 12px;">${robotName} price dropped!</h2>
    <p style="margin:0 0 8px;font-size:15px;">
      Your target: <span style="text-decoration:line-through;color:#888;">$${oldTarget.toLocaleString()}</span>
    </p>
    <p style="margin:0 0 16px;font-size:22px;font-weight:bold;color:#00E5A0;">
      New price: $${newPrice.toLocaleString()}
    </p>
    <a href="${robotUrl}" style="display:inline-block;background:#00C2FF;color:#0A0F1E;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
      View ${robotName} &rarr;
    </a>
  </div>
  <div style="text-align:center;padding:16px 0;border-top:1px solid #222;">
    <a href="https://robotomated.com" style="color:#00C2FF;text-decoration:none;font-size:13px;">robotomated.com</a>
  </div>
</body>
</html>`;
}

export async function GET(request: NextRequest) {
  if (!verifyCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();

  // Fetch all active alerts with robot price data
  const { data: alerts } = await supabase
    .from("price_alerts")
    .select("id, email, target_price, robot_id, robots(name, slug, price_current, robot_categories(slug))")
    .is("triggered_at", null)
    .returns<AlertRow[]>();

  if (!alerts?.length) {
    return NextResponse.json({ message: "No active alerts", checked: 0, triggered: 0 });
  }

  let triggered = 0;

  for (const alert of alerts) {
    const robot = alert.robots;
    if (!robot?.price_current) continue;

    // Check if price dropped below target
    if (robot.price_current <= alert.target_price) {
      const catSlug = (robot.robot_categories as { slug: string } | null)?.slug || "all";
      const robotUrl = `https://robotomated.com/explore/${catSlug}/${robot.slug}`;
      const html = buildPriceDropEmail(robot.name, alert.target_price, robot.price_current, robotUrl);

      try {
        await resend.emails.send({
          from: EMAIL_FROM,
          to: alert.email,
          subject: `Price Drop: ${robot.name} is now $${robot.price_current.toLocaleString()}`,
          html,
        });

        // Mark alert as triggered
        await supabase
          .from("price_alerts")
          .update({ triggered_at: new Date().toISOString() })
          .eq("id", alert.id);

        triggered++;
      } catch (err) {
        console.error(`Failed to send price alert for ${robot.name} to ${alert.email}:`, err);
      }
    }
  }

  return NextResponse.json({
    message: "Price alerts checked",
    checked: alerts.length,
    triggered,
  });
}
