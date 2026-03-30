const HEADER = `
<div style="text-align:center;margin-bottom:32px;">
  <h1 style="color:#00C2FF;font-size:24px;margin:0;font-family:'Space Grotesk',system-ui,sans-serif;">Robotomated</h1>
  <p style="color:#888;font-size:12px;margin:6px 0 0;">The Robotics Intelligence Platform</p>
</div>`;

const FOOTER = `
<div style="text-align:center;padding:24px 0;color:#555;font-size:11px;border-top:1px solid #1A1A1A;margin-top:32px;">
  <p>Robotomated — The Robotics Intelligence Platform</p>
  <p style="margin-top:8px;">
    <a href="https://robotomated.com" style="color:#00C2FF;text-decoration:none;">robotomated.com</a>
    &nbsp;|&nbsp;
    <a href="https://robotomated.com/unsubscribe" style="color:#555;text-decoration:none;">Unsubscribe</a>
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

export const ONBOARDING_EMAILS = [
  {
    id: "onboarding-1-checklist",
    delayDays: 0,
    subject: "Your Robot Buyer's Checklist + How to Use It",
    html: wrap(`
    <h2 style="color:#fff;font-size:20px;margin:0 0 16px;">Your buyer's checklist is ready</h2>
    <p style="line-height:1.7;font-size:15px;margin:0 0 16px;">
      You've taken the first step toward smarter automation purchasing. Here's how to get the most from your checklist:
    </p>
    <div style="background:#0A0F1E;border-radius:8px;padding:20px;margin:16px 0;">
      <p style="color:#00E5A0;font-weight:600;font-size:14px;margin:0 0 12px;">3 Ways to Use Your Checklist</p>
      <ol style="line-height:2;font-size:14px;padding-left:20px;margin:0;">
        <li><strong style="color:#00C2FF;">Before vendor meetings</strong> — Know exactly what questions to ask</li>
        <li><strong style="color:#00C2FF;">During evaluations</strong> — Score each robot against your requirements</li>
        <li><strong style="color:#00C2FF;">For internal buy-in</strong> — Share with stakeholders to align on priorities</li>
      </ol>
    </div>
    <p style="line-height:1.7;font-size:15px;margin:0 0 20px;">
      Next: compare robots head-to-head with our comparison tool. It's the fastest way to narrow from 5 options to 2.
    </p>
    <div style="text-align:center;">
      <a href="https://robotomated.com/compare" style="display:inline-block;background:#00C2FF;color:#0A0F1E;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
        Compare Robots &rarr;
      </a>
    </div>`),
  },
  {
    id: "onboarding-2-vendor-questions",
    delayDays: 3,
    subject: "15 Questions to Ask Your Robot Vendor (Before You Commit)",
    html: wrap(`
    <h2 style="color:#fff;font-size:20px;margin:0 0 16px;">Questions your vendor hopes you won't ask</h2>
    <p style="line-height:1.7;font-size:15px;margin:0 0 16px;">
      Most buyers focus on price and specs. The smartest buyers ask about what happens <em>after</em> the purchase. Here are 15 questions that separate informed buyers from easy targets:
    </p>
    <div style="background:#0A0F1E;border-radius:8px;padding:20px;margin:16px 0;">
      <p style="color:#00C2FF;font-weight:600;font-size:13px;margin:0 0 8px;">TOTAL COST OF OWNERSHIP</p>
      <ol style="line-height:2;font-size:13px;padding-left:20px;margin:0 0 16px;">
        <li>What's the annual maintenance cost as a percentage of purchase price?</li>
        <li>Are software updates included, or licensed separately?</li>
        <li>What's the expected lifespan and depreciation schedule?</li>
      </ol>
      <p style="color:#00C2FF;font-weight:600;font-size:13px;margin:0 0 8px;">DEPLOYMENT & SUPPORT</p>
      <ol start="4" style="line-height:2;font-size:13px;padding-left:20px;margin:0 0 16px;">
        <li>What's the average deployment timeline for a facility like mine?</li>
        <li>What infrastructure changes does your system require?</li>
        <li>What's your support response time SLA?</li>
        <li>Can I see references from similar-size deployments?</li>
      </ol>
      <p style="color:#00C2FF;font-weight:600;font-size:13px;margin:0 0 8px;">INTEGRATION & SCALING</p>
      <ol start="8" style="line-height:2;font-size:13px;padding-left:20px;margin:0 0 16px;">
        <li>Does your system integrate with my existing WMS/ERP?</li>
        <li>What's the incremental cost to add more units?</li>
        <li>Is there a RaaS or lease option?</li>
      </ol>
      <p style="color:#00C2FF;font-weight:600;font-size:13px;margin:0 0 8px;">RISK & EXIT</p>
      <ol start="11" style="line-height:2;font-size:13px;padding-left:20px;margin:0 0 16px;">
        <li>What happens if your company is acquired or goes under?</li>
        <li>Can I switch to a competitor's system later?</li>
        <li>What's the warranty coverage and what voids it?</li>
        <li>What training is included vs. charged separately?</li>
        <li>What does your product roadmap look like for the next 2 years?</li>
      </ol>
    </div>
    <p style="line-height:1.7;font-size:15px;margin:0 0 20px;">
      Use our TCO Calculator to model the full 5-year cost before your next vendor meeting.
    </p>
    <div style="text-align:center;">
      <a href="https://robotomated.com/tools/tco-calculator" style="display:inline-block;background:#00C2FF;color:#0A0F1E;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
        Calculate Your TCO &rarr;
      </a>
    </div>`),
  },
  {
    id: "onboarding-3-tco-walkthrough",
    delayDays: 7,
    subject: "Your 5-Year Total Cost of Ownership (It's Not Just the Sticker Price)",
    html: wrap(`
    <h2 style="color:#fff;font-size:20px;margin:0 0 16px;">The sticker price is only 40-60% of the real cost</h2>
    <p style="line-height:1.7;font-size:15px;margin:0 0 16px;">
      Robot buyers who only compare purchase prices make expensive mistakes. Here's what a complete 5-year TCO analysis includes — and how to calculate yours in 5 minutes.
    </p>
    <div style="background:#0A0F1E;border-radius:8px;padding:20px;margin:16px 0;">
      <p style="color:#00E5A0;font-weight:600;font-size:14px;margin:0 0 12px;">5-Year TCO Breakdown</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr style="border-bottom:1px solid #1A1A1A;">
          <td style="padding:8px 0;color:#888;">Purchase / Lease</td>
          <td style="padding:8px 0;text-align:right;color:#fff;font-weight:600;">40-60%</td>
        </tr>
        <tr style="border-bottom:1px solid #1A1A1A;">
          <td style="padding:8px 0;color:#888;">Integration & Deployment</td>
          <td style="padding:8px 0;text-align:right;color:#fff;font-weight:600;">10-20%</td>
        </tr>
        <tr style="border-bottom:1px solid #1A1A1A;">
          <td style="padding:8px 0;color:#888;">Annual Maintenance</td>
          <td style="padding:8px 0;text-align:right;color:#fff;font-weight:600;">8-12%/yr</td>
        </tr>
        <tr style="border-bottom:1px solid #1A1A1A;">
          <td style="padding:8px 0;color:#888;">Software & Licensing</td>
          <td style="padding:8px 0;text-align:right;color:#fff;font-weight:600;">5-10%/yr</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#888;">Training & Downtime</td>
          <td style="padding:8px 0;text-align:right;color:#fff;font-weight:600;">5-10%</td>
        </tr>
      </table>
    </div>
    <p style="line-height:1.7;font-size:15px;margin:0 0 20px;">
      Our TCO Calculator models all of these costs automatically based on the specific robots you're evaluating. Takes 5 minutes, saves thousands.
    </p>
    <div style="text-align:center;">
      <a href="https://robotomated.com/tools/tco-calculator" style="display:inline-block;background:#00C2FF;color:#0A0F1E;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
        Run Your TCO Analysis &rarr;
      </a>
    </div>`),
  },
  {
    id: "onboarding-4-fleet-management",
    delayDays: 14,
    subject: "Bought a Robot? Here's How to Manage Your Fleet from Day One",
    html: wrap(`
    <h2 style="color:#fff;font-size:20px;margin:0 0 16px;">Day one with your new robot</h2>
    <p style="line-height:1.7;font-size:15px;margin:0 0 16px;">
      Congratulations on your automation investment. Now the real work begins: getting maximum value from your fleet. Here's your 30-day setup guide.
    </p>
    <div style="background:#0A0F1E;border-radius:8px;padding:20px;margin:16px 0;">
      <p style="color:#7B2FFF;font-weight:600;font-size:13px;margin:0 0 8px;">WEEK 1: BASELINE</p>
      <ul style="line-height:2;font-size:13px;padding-left:20px;margin:0 0 16px;">
        <li>Register your robot(s) in Robotomated Fleet Manager</li>
        <li>Record baseline metrics: throughput, uptime, error rates</li>
        <li>Set up maintenance schedule alerts</li>
      </ul>
      <p style="color:#7B2FFF;font-weight:600;font-size:13px;margin:0 0 8px;">WEEK 2-3: OPTIMIZE</p>
      <ul style="line-height:2;font-size:13px;padding-left:20px;margin:0 0 16px;">
        <li>Track daily utilization — target 85%+ for ROI timeline</li>
        <li>Document common issues and resolution steps</li>
        <li>Train backup operators (minimum 2 per shift)</li>
      </ul>
      <p style="color:#7B2FFF;font-weight:600;font-size:13px;margin:0 0 8px;">WEEK 4: MEASURE</p>
      <ul style="line-height:2;font-size:13px;padding-left:20px;margin:0 0 16px;">
        <li>Compare actuals to your original ROI projections</li>
        <li>Identify optimization opportunities</li>
        <li>Plan expansion if metrics support it</li>
      </ul>
    </div>
    <div style="text-align:center;">
      <a href="https://robotomated.com/fleet" style="display:inline-block;background:#00C2FF;color:#0A0F1E;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
        Set Up Fleet Manager &rarr;
      </a>
    </div>`),
  },
  {
    id: "onboarding-5-survey",
    delayDays: 30,
    subject: "How Did Your Robot Evaluation Go? (Quick Survey)",
    html: wrap(`
    <h2 style="color:#fff;font-size:20px;margin:0 0 16px;">Quick check-in: how's it going?</h2>
    <p style="line-height:1.7;font-size:15px;margin:0 0 16px;">
      It's been a month since you started your robotics evaluation. We'd love to know how it's going — and how we can help.
    </p>
    <div style="background:#0A0F1E;border-radius:8px;padding:20px;margin:16px 0;">
      <p style="color:#fff;font-weight:600;font-size:14px;margin:0 0 12px;">Where are you in the process?</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="padding:10px 0;">
            <a href="https://robotomated.com/portal?survey=purchased" style="color:#00E5A0;text-decoration:none;font-weight:600;">
              ✅ Already purchased / deployed
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;">
            <a href="https://robotomated.com/portal?survey=evaluating" style="color:#00C2FF;text-decoration:none;font-weight:600;">
              🔍 Still evaluating options
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;">
            <a href="https://robotomated.com/portal?survey=postponed" style="color:#FF6B35;text-decoration:none;font-weight:600;">
              ⏸️ Put the project on hold
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;">
            <a href="https://robotomated.com/portal?survey=decided-against" style="color:#888;text-decoration:none;font-weight:600;">
              ❌ Decided against automation (for now)
            </a>
          </td>
        </tr>
      </table>
    </div>
    <p style="line-height:1.7;font-size:15px;margin:0 0 20px;">
      Whatever stage you're at, we're here to help. Hit reply to this email and tell us what you need — our team reads every response.
    </p>
    <p style="line-height:1.7;font-size:14px;color:#888;margin:0;">
      — The Robotomated Team
    </p>`),
  },
];

export function getOnboardingEmail(id: string) {
  return ONBOARDING_EMAILS.find(e => e.id === id);
}
