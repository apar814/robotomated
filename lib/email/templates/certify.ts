// lib/email/templates/certify.ts — RCO certification enrollment emails
import { resend, EMAIL_FROM } from "../resend";
import { createServerClient } from "@/lib/supabase/server";
import { CERT_BY_SLUG } from "@/lib/certifications";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://robotomated.com";
const SUPPORT_EMAIL = "support@robotomated.com";

const HEADER = `
<div style="text-align:center;margin-bottom:32px;">
  <h1 style="color:#00C2FF;font-size:24px;margin:0;font-family:'Space Grotesk',system-ui,sans-serif;">Robotomated</h1>
  <p style="color:#888;font-size:12px;margin:6px 0 0;">Certified Robot Operator Program</p>
</div>`;

const FOOTER = `
<div style="text-align:center;padding:24px 0;color:#555;font-size:11px;border-top:1px solid #1A1A1A;margin-top:32px;">
  <p>Robotomated &middot; Certified Robot Operator</p>
  <p style="margin-top:8px;">
    <a href="${BASE_URL}" style="color:#00C2FF;text-decoration:none;">robotomated.com</a>
    &middot;
    <a href="mailto:${SUPPORT_EMAIL}" style="color:#00C2FF;text-decoration:none;">${SUPPORT_EMAIL}</a>
  </p>
</div>`;

function wrap(content: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head>
<body style="background:#0A0F1E;color:#e0e0e0;font-family:'Space Grotesk',system-ui,sans-serif;padding:32px;max-width:600px;margin:0 auto;">
${HEADER}
<div style="background:#141A2E;border-radius:12px;padding:28px;margin-bottom:24px;">
${content}
</div>
${FOOTER}
</body>
</html>`;
}

interface SendCertEnrollmentEmailArgs {
  to: string;
  payerName: string;
  certSlug: string;
  certificationId: string;
}

export async function sendCertEnrollmentEmail({
  to,
  payerName,
  certSlug,
  certificationId,
}: SendCertEnrollmentEmailArgs) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServerClient() as any;
  const { data: cert } = await supabase
    .from("rco_certifications")
    .select("name, level, exam_duration, question_count, passing_score, renewal_years")
    .eq("id", certificationId)
    .maybeSingle();

  const fallback = CERT_BY_SLUG[certSlug];
  const certName: string = cert?.name || fallback?.name || "your certification";
  const level: number | undefined = cert?.level ?? fallback?.level;
  const duration: number | undefined = cert?.exam_duration ?? fallback?.duration;
  const questions: number | undefined = cert?.question_count ?? fallback?.questions;
  const passScore: number | undefined = cert?.passing_score ?? fallback?.passScore;
  const renewalYears: number = cert?.renewal_years ?? fallback?.renewalYears ?? 2;

  const studyUrl = `${BASE_URL}/certify/study/${certSlug}`;
  const examUrl = `${BASE_URL}/certify/${certSlug}`;

  const detailRow = (label: string, value: string) =>
    `<tr><td style="padding:8px 0;color:#888;width:140px;">${label}</td><td style="padding:8px 0;color:#e0e0e0;">${value}</td></tr>`;

  const detailsTable = [
    level !== undefined ? detailRow("Level", `${level} — ${certName}`) : "",
    duration !== undefined ? detailRow("Exam duration", `${duration} minutes`) : "",
    questions !== undefined && questions > 0 ? detailRow("Questions", `${questions}`) : "",
    passScore !== undefined ? detailRow("Pass score", `${passScore}%`) : "",
    detailRow("Valid for", `${renewalYears} years from purchase`),
  ].filter(Boolean).join("");

  const subject = `You're enrolled — RCO ${certName}`;

  const html = wrap(`
    <h2 style="color:#fff;font-size:20px;margin:0 0 16px;">You're in, ${payerName}.</h2>
    <p style="line-height:1.7;font-size:15px;margin:0 0 16px;">
      Your enrollment in <strong style="color:#00C2FF;">RCO ${certName}</strong> is confirmed.
      Study at your pace, take the exam when ready.
    </p>

    <table style="width:100%;border-collapse:collapse;margin:8px 0 20px;">
      ${detailsTable}
    </table>

    <div style="margin:24px 0;">
      <a href="${studyUrl}" style="display:inline-block;background:#00C2FF;color:#0A0F1E;padding:12px 28px;text-decoration:none;font-weight:600;border-radius:6px;margin-right:12px;">Start studying</a>
      <a href="${examUrl}" style="display:inline-block;background:transparent;color:#00C2FF;border:1px solid #00C2FF;padding:11px 27px;text-decoration:none;font-weight:600;border-radius:6px;">Take the exam when ready</a>
    </div>

    <p style="line-height:1.7;font-size:14px;color:#aaa;margin:24px 0 0;">
      Your enrollment is valid for ${renewalYears} years from today. After that, recertify to stay current with the program.
    </p>

    <p style="color:#888;font-size:13px;margin:16px 0 0;">
      Questions? Email <a href="mailto:${SUPPORT_EMAIL}" style="color:#00C2FF;">${SUPPORT_EMAIL}</a>.
    </p>
  `);

  await resend.emails.send({
    from: EMAIL_FROM,
    to,
    replyTo: SUPPORT_EMAIL,
    subject,
    html,
  });
}
