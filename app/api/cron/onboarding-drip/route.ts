import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { resend, EMAIL_FROM } from "@/lib/email/resend";
import { ONBOARDING_EMAILS } from "@/lib/email/templates/onboarding";

/**
 * Cron-triggered onboarding drip email sender.
 * Run daily via Vercel Cron or external scheduler.
 *
 * For each onboarding email in the sequence, finds subscribers
 * who signed up N days ago and haven't received that email yet.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  const now = new Date();
  let sent = 0;
  let errors = 0;

  for (const email of ONBOARDING_EMAILS) {
    // Find subscribers who signed up exactly email.delayDays ago (within a 24-hour window)
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() - email.delayDays);
    const dayStart = new Date(targetDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(targetDate);
    dayEnd.setHours(23, 59, 59, 999);

    // Get subscribers who signed up on that day
    const { data: subscribers } = await supabase
      .from("newsletter_subscribers")
      .select("email")
      .gte("created_at", dayStart.toISOString())
      .lte("created_at", dayEnd.toISOString());

    if (!subscribers || subscribers.length === 0) continue;

    // Check which subscribers already received this email
    // email_sends table may not exist yet — treat any error as "no sends yet"
    let sentEmails = new Set<string>();
    try {
      const { data: alreadySent } = await supabase
        .from("email_sends" as never)
        .select("recipient_email")
        .eq("template_id", email.id)
        .in("recipient_email", subscribers.map(s => s.email));

      if (alreadySent) {
        sentEmails = new Set(
          (alreadySent as { recipient_email: string }[]).map(s => s.recipient_email)
        );
      }
    } catch {
      // Table doesn't exist yet — send to all
    }

    const toSend = subscribers.filter(s => !sentEmails.has(s.email));

    for (const subscriber of toSend) {
      try {
        await resend.emails.send({
          from: EMAIL_FROM,
          to: subscriber.email,
          subject: email.subject,
          html: email.html,
        });

        // Record the send (table may not exist yet — fail silently)
        try {
          await (supabase.from("email_sends" as never) as unknown as {
            insert: (data: Record<string, string>) => Promise<unknown>;
          }).insert({ recipient_email: subscriber.email, template_id: email.id, sent_at: new Date().toISOString() });
        } catch {
          // Table doesn't exist yet
        }

        sent++;
      } catch {
        errors++;
      }
    }
  }

  return NextResponse.json({
    ok: true,
    sent,
    errors,
    timestamp: now.toISOString(),
  });
}
