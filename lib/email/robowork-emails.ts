import { resend, EMAIL_FROM } from "./resend";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "team@robotomated.com";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://robotomated.com";

export async function sendJobPostedNotification(job: {
  title: string;
  slug: string;
  business_name: string;
  business_email: string;
  task_type: string;
  industry: string;
}) {
  try {
    // Notify admin
    await resend.emails.send({
      from: EMAIL_FROM,
      to: ADMIN_EMAIL,
      subject: `[RoboWork] New job posted: ${job.title}`,
      html: `
        <div style="font-family: 'Space Grotesk', sans-serif; max-width: 600px; margin: 0 auto; background: #080808; color: #e0e0e0; padding: 32px;">
          <h1 style="color: #0EA5E9; font-size: 20px;">New RoboWork Job Posted</h1>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px 0; color: #888;">Title</td><td style="padding: 8px 0;">${job.title}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Business</td><td style="padding: 8px 0;">${job.business_name}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Email</td><td style="padding: 8px 0;">${job.business_email}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Task Type</td><td style="padding: 8px 0;">${job.task_type}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Industry</td><td style="padding: 8px 0;">${job.industry}</td></tr>
          </table>
          <a href="${BASE_URL}/robowork/jobs/${job.slug}" style="display: inline-block; background: #0EA5E9; color: #000; padding: 10px 24px; text-decoration: none; font-weight: 600; border-radius: 4px;">View Job</a>
        </div>
      `,
    });

    // Confirmation to poster
    await resend.emails.send({
      from: EMAIL_FROM,
      to: job.business_email,
      subject: `Your RoboWork job "${job.title}" has been posted`,
      html: `
        <div style="font-family: 'Space Grotesk', sans-serif; max-width: 600px; margin: 0 auto; background: #080808; color: #e0e0e0; padding: 32px;">
          <h1 style="color: #0EA5E9; font-size: 20px;">Job Posted Successfully</h1>
          <p>Your job <strong>"${job.title}"</strong> is now live on RoboWork.</p>
          <p style="color: #888;">Robot service providers can now find your job and submit bids. We'll notify you when you receive a bid.</p>
          <a href="${BASE_URL}/robowork/jobs/${job.slug}" style="display: inline-block; background: #0EA5E9; color: #000; padding: 10px 24px; text-decoration: none; font-weight: 600; border-radius: 4px; margin-top: 16px;">View Your Job</a>
          <p style="color: #555; font-size: 12px; margin-top: 24px;">Robotomated RoboWork -- ${BASE_URL}/robowork</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[RoboWork] Email notification failed:", err);
  }
}

export async function sendBidReceivedNotification(bid: {
  job_title: string;
  job_slug: string;
  business_email: string;
  provider_name: string;
  proposed_price: number;
  message?: string | null;
}) {
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: bid.business_email,
      subject: `New bid on "${bid.job_title}" from ${bid.provider_name}`,
      html: `
        <div style="font-family: 'Space Grotesk', sans-serif; max-width: 600px; margin: 0 auto; background: #080808; color: #e0e0e0; padding: 32px;">
          <h1 style="color: #0EA5E9; font-size: 20px;">New Bid Received</h1>
          <p>A robot service provider has bid on your job.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px 0; color: #888;">Job</td><td style="padding: 8px 0;">${bid.job_title}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Provider</td><td style="padding: 8px 0;">${bid.provider_name}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Proposed Price</td><td style="padding: 8px 0; color: #C8FF00; font-weight: 600;">$${bid.proposed_price.toLocaleString()}</td></tr>
            ${bid.message ? `<tr><td style="padding: 8px 0; color: #888;">Message</td><td style="padding: 8px 0;">${bid.message}</td></tr>` : ""}
          </table>
          <a href="${BASE_URL}/robowork/jobs/${bid.job_slug}" style="display: inline-block; background: #0EA5E9; color: #000; padding: 10px 24px; text-decoration: none; font-weight: 600; border-radius: 4px;">View Bids</a>
          <p style="color: #555; font-size: 12px; margin-top: 24px;">Robotomated RoboWork -- ${BASE_URL}/robowork</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[RoboWork] Bid notification failed:", err);
  }
}

export async function sendProviderRegisteredNotification(provider: {
  company_name: string;
  contact_email: string;
  city?: string | null;
  state?: string | null;
}) {
  try {
    // Admin notification
    await resend.emails.send({
      from: EMAIL_FROM,
      to: ADMIN_EMAIL,
      subject: `[RoboWork] New provider registered: ${provider.company_name}`,
      html: `
        <div style="font-family: 'Space Grotesk', sans-serif; max-width: 600px; margin: 0 auto; background: #080808; color: #e0e0e0; padding: 32px;">
          <h1 style="color: #C8FF00; font-size: 20px;">New Provider Registration</h1>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px 0; color: #888;">Company</td><td style="padding: 8px 0;">${provider.company_name}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Email</td><td style="padding: 8px 0;">${provider.contact_email}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Location</td><td style="padding: 8px 0;">${[provider.city, provider.state].filter(Boolean).join(", ") || "Not specified"}</td></tr>
          </table>
          <a href="${BASE_URL}/admin/robowork" style="display: inline-block; background: #C8FF00; color: #000; padding: 10px 24px; text-decoration: none; font-weight: 600; border-radius: 4px;">Review in Admin</a>
        </div>
      `,
    });

    // Welcome email to provider
    await resend.emails.send({
      from: EMAIL_FROM,
      to: provider.contact_email,
      subject: `Welcome to RoboWork, ${provider.company_name}!`,
      html: `
        <div style="font-family: 'Space Grotesk', sans-serif; max-width: 600px; margin: 0 auto; background: #080808; color: #e0e0e0; padding: 32px;">
          <h1 style="color: #C8FF00; font-size: 20px;">Welcome to RoboWork</h1>
          <p>Your provider profile for <strong>${provider.company_name}</strong> has been created.</p>
          <p style="color: #888;">Here's what you can do next:</p>
          <ul style="color: #ccc; line-height: 1.8;">
            <li>Complete your profile with robot fleet details</li>
            <li>Browse available jobs and submit bids</li>
            <li>Get verified to build trust with clients</li>
          </ul>
          <a href="${BASE_URL}/robowork/jobs" style="display: inline-block; background: #0EA5E9; color: #000; padding: 10px 24px; text-decoration: none; font-weight: 600; border-radius: 4px; margin-top: 16px;">Browse Jobs</a>
          <p style="color: #555; font-size: 12px; margin-top: 24px;">Robotomated RoboWork -- ${BASE_URL}/robowork</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[RoboWork] Provider registration email failed:", err);
  }
}
