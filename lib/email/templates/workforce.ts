// lib/email/templates/workforce.ts — Workforce Network email templates
import { resend, EMAIL_FROM } from "../resend";

const ADMIN_EMAIL = "apar@buildtal.com";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://robotomated.com";

const HEADER = `
<div style="text-align:center;margin-bottom:32px;">
  <h1 style="color:#00C2FF;font-size:24px;margin:0;font-family:'Space Grotesk',system-ui,sans-serif;">Robotomated</h1>
  <p style="color:#888;font-size:12px;margin:6px 0 0;">Workforce Network</p>
</div>`;

const FOOTER = `
<div style="text-align:center;padding:24px 0;color:#555;font-size:11px;border-top:1px solid #1A1A1A;margin-top:32px;">
  <p>Robotomated Workforce Network</p>
  <p style="margin-top:8px;">
    <a href="${BASE_URL}" style="color:#00C2FF;text-decoration:none;">robotomated.com</a>
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

// ─── Employer emails ──────────────────────────────────────────────

export async function sendEmployerIntentNotification(data: {
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_title?: string;
  role_type: string;
  hires_needed: number;
  timeline: string;
  salary_min?: number;
  salary_max?: number;
  notes?: string;
}) {
  // Admin notification
  await resend.emails.send({
    from: EMAIL_FROM,
    to: ADMIN_EMAIL,
    subject: `[Workforce] New employer: ${data.company_name} — ${data.hires_needed} hires`,
    html: wrap(`
      <h2 style="color:#fff;font-size:20px;margin:0 0 16px;">New Employer Intent</h2>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr><td style="padding:8px 0;color:#888;width:140px;">Company</td><td style="padding:8px 0;">${data.company_name}</td></tr>
        <tr><td style="padding:8px 0;color:#888;">Contact</td><td style="padding:8px 0;">${data.contact_name}${data.contact_title ? ` (${data.contact_title})` : ""}</td></tr>
        <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;"><a href="mailto:${data.contact_email}" style="color:#00C2FF;">${data.contact_email}</a></td></tr>
        <tr><td style="padding:8px 0;color:#888;">Role Type</td><td style="padding:8px 0;">${data.role_type}</td></tr>
        <tr><td style="padding:8px 0;color:#888;">Hires Needed</td><td style="padding:8px 0;">${data.hires_needed}</td></tr>
        <tr><td style="padding:8px 0;color:#888;">Timeline</td><td style="padding:8px 0;">${data.timeline}</td></tr>
        ${data.salary_min || data.salary_max ? `<tr><td style="padding:8px 0;color:#888;">Salary Range</td><td style="padding:8px 0;">$${(data.salary_min || 0).toLocaleString()} - $${(data.salary_max || 0).toLocaleString()}</td></tr>` : ""}
        ${data.notes ? `<tr><td style="padding:8px 0;color:#888;">Notes</td><td style="padding:8px 0;">${data.notes}</td></tr>` : ""}
      </table>
      <a href="${BASE_URL}/admin/workforce-network" style="display:inline-block;background:#00C2FF;color:#0A0F1E;padding:10px 24px;text-decoration:none;font-weight:600;border-radius:6px;">View Pipeline</a>
    `),
  });

  // Auto-reply to employer
  await resend.emails.send({
    from: EMAIL_FROM,
    to: data.contact_email,
    replyTo: ADMIN_EMAIL,
    subject: "Robotomated Workforce Network — We received your hiring request",
    html: wrap(`
      <h2 style="color:#fff;font-size:20px;margin:0 0 16px;">Thanks, ${data.contact_name}</h2>
      <p style="line-height:1.7;font-size:15px;margin:0 0 16px;">
        We received your request for <strong style="color:#00C2FF;">${data.hires_needed} certified robot operator${data.hires_needed > 1 ? "s" : ""}</strong>.
      </p>
      <p style="line-height:1.7;font-size:15px;margin:0 0 16px;">
        Someone from our team will reach out within <strong style="color:#00E5A0;">24 hours</strong> to discuss your needs.
      </p>
      <div style="background:#0A0F1E;border-radius:8px;padding:20px;margin:16px 0;">
        <p style="color:#00E5A0;font-weight:600;font-size:14px;margin:0 0 12px;">What happens next:</p>
        <ol style="line-height:2;font-size:14px;padding-left:20px;margin:0;">
          <li>We schedule a 15-min call to understand your requirements</li>
          <li>We match you with candidates from our certified operator pool</li>
          <li>You interview and hire — <strong>no recruiting fees during our launch period</strong></li>
        </ol>
      </div>
      <p style="color:#888;font-size:13px;margin:16px 0 0;">
        Questions? Reply to this email directly.
      </p>
    `),
  });
}

// ─── Student welcome emails ──────────────────────────────────────

export const STUDENT_WELCOME_EMAILS = [
  {
    id: "workforce-welcome-day0",
    delayDays: 0,
    subject: "Welcome to Cohort 1 — Here's what to expect",
    html: wrap(`
      <h2 style="color:#fff;font-size:20px;margin:0 0 16px;">You're in. Let's get to work.</h2>
      <p style="line-height:1.7;font-size:15px;margin:0 0 16px;">
        You just enrolled in <strong style="color:#00C2FF;">Robotomated Certified Operator — Level 1</strong>. Good move.
      </p>
      <div style="background:#0A0F1E;border-radius:8px;padding:20px;margin:16px 0;">
        <p style="color:#00E5A0;font-weight:600;font-size:14px;margin:0 0 12px;">Your 4-Week Program</p>
        <ol style="line-height:2.2;font-size:14px;padding-left:20px;margin:0;">
          <li><strong style="color:#00C2FF;">Week 1:</strong> Robot Fundamentals and Safety Protocols</li>
          <li><strong style="color:#00C2FF;">Week 2:</strong> Industrial Robots and Cobots</li>
          <li><strong style="color:#00C2FF;">Week 3:</strong> AMR Fleet Management and Programming</li>
          <li><strong style="color:#00C2FF;">Week 4:</strong> Job Readiness and Certification Exam</li>
        </ol>
      </div>
      <p style="line-height:1.7;font-size:15px;margin:0 0 16px;">
        <strong>Time commitment:</strong> About 10 hours/week. Live sessions Tuesdays and Thursdays, 7-9 PM ET. Self-paced modules unlock each Monday.
      </p>
      <p style="line-height:1.7;font-size:15px;margin:0 0 16px;">
        We'll send your cohort schedule and community access 3 days before your start date.
      </p>
      <p style="color:#888;font-size:13px;margin:16px 0 0;">
        Questions? Reply to this email. We read every one.
      </p>
    `),
  },
  {
    id: "workforce-welcome-day1",
    delayDays: 1,
    subject: "Your pre-work — 3 things to do before cohort starts",
    html: wrap(`
      <h2 style="color:#fff;font-size:20px;margin:0 0 16px;">Set yourself up right</h2>
      <p style="line-height:1.7;font-size:15px;margin:0 0 16px;">
        Your cohort starts soon. Here's how to prepare:
      </p>
      <div style="background:#0A0F1E;border-radius:8px;padding:20px;margin:16px 0;">
        <p style="color:#00E5A0;font-weight:600;font-size:14px;margin:0 0 12px;">Before Your Cohort Starts</p>
        <ol style="line-height:2.2;font-size:14px;padding-left:20px;margin:0;">
          <li><strong style="color:#00C2FF;">Take the free Level 0 quiz</strong> — Our <a href="${BASE_URL}/certify" style="color:#00C2FF;">Robot Awareness assessment</a> covers the basics. It's free and takes 30 minutes.</li>
          <li><strong style="color:#00C2FF;">Block your calendar</strong> — 10 hrs/week for 4 weeks. Live sessions are Tuesdays and Thursdays evenings.</li>
          <li><strong style="color:#00C2FF;">Read these 3 articles</strong> — They'll give you a head start on Week 1 material:
            <ul style="margin-top:8px;">
              <li><a href="${BASE_URL}/explore" style="color:#00C2FF;">Explore the Robot Database</a> — See what's out there</li>
              <li><a href="${BASE_URL}/intelligence" style="color:#00C2FF;">Robotics Industry Intelligence</a> — Market context</li>
              <li><a href="${BASE_URL}/certify" style="color:#00C2FF;">RCO Certification Framework</a> — Where Level 1 fits</li>
            </ul>
          </li>
        </ol>
      </div>
      <p style="color:#888;font-size:13px;margin:16px 0 0;">
        Questions? Reply to this email.
      </p>
    `),
  },
  {
    id: "workforce-welcome-day-7-before",
    delayDays: -7, // 7 days before cohort start (triggered differently)
    subject: "Cohort starts in 1 week — final logistics",
    html: wrap(`
      <h2 style="color:#fff;font-size:20px;margin:0 0 16px;">One week out</h2>
      <p style="line-height:1.7;font-size:15px;margin:0 0 16px;">
        Your <strong style="color:#00C2FF;">Operator Level 1</strong> cohort begins in 7 days.
      </p>
      <div style="background:#0A0F1E;border-radius:8px;padding:20px;margin:16px 0;">
        <p style="color:#00E5A0;font-weight:600;font-size:14px;margin:0 0 12px;">Final Checklist</p>
        <ul style="line-height:2.2;font-size:14px;padding-left:20px;margin:0;">
          <li>Live sessions: <strong>Tuesdays and Thursdays, 7-9 PM ET</strong></li>
          <li>Self-paced modules unlock each Monday morning</li>
          <li>Final exam is Week 4 — 70% passing score required</li>
          <li>Community access link: <em>Coming in a separate email</em></li>
        </ul>
      </div>
      <p style="line-height:1.7;font-size:15px;margin:0 0 16px;">
        After you pass: we connect you with employers in our Workforce Network who are actively hiring certified operators. Starting salary range is $45,000-$75,000 depending on role and location.
      </p>
      <p style="color:#888;font-size:13px;margin:16px 0 0;">
        See you in a week.
      </p>
    `),
  },
];

// Send a specific welcome email
export async function sendStudentWelcomeEmail(to: string, emailIndex: number) {
  const template = STUDENT_WELCOME_EMAILS[emailIndex];
  if (!template) return;

  await resend.emails.send({
    from: EMAIL_FROM,
    to,
    replyTo: ADMIN_EMAIL,
    subject: template.subject,
    html: template.html,
  });
}
