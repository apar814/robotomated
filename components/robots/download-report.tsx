"use client";

interface DownloadReportProps {
  robot: {
    name: string;
    manufacturer: string;
    roboScore: number | null;
    scoreBreakdown: Record<string, number> | null;
    priceCurrent: number | null;
    specs: Record<string, unknown>;
    maintenanceCostLow: number | null;
    maintenanceCostHigh: number | null;
    warrantyMonths: number | null;
  };
}

const DIMENSIONS = [
  { key: "performance", label: "Performance", weight: "25%" },
  { key: "reliability", label: "Reliability", weight: "20%" },
  { key: "ease_of_use", label: "Ease of Use", weight: "15%" },
  { key: "intelligence", label: "Intelligence", weight: "15%" },
  { key: "value", label: "Value", weight: "10%" },
  { key: "ecosystem", label: "Ecosystem", weight: "8%" },
  { key: "safety", label: "Safety", weight: "5%" },
  { key: "design", label: "Design", weight: "2%" },
];

function fmtKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function fmtVal(value: unknown): string {
  if (value === null || value === undefined) return "\u2014";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function fmtPrice(p: number): string {
  if (p >= 1000000) return `$${(p / 1000000).toFixed(1)}M`;
  return `$${p.toLocaleString()}`;
}

function buildReportHtml(robot: DownloadReportProps["robot"]): string {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const scoreStr = robot.roboScore != null ? robot.roboScore.toFixed(1) : "N/A";

  const scoreRows = robot.scoreBreakdown
    ? DIMENSIONS.map(
        (dim) =>
          `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${dim.label}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${dim.weight}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-weight:600;">${robot.scoreBreakdown![dim.key] ?? "\u2014"}</td>
          </tr>`,
      ).join("")
    : "";

  const specEntries = Object.entries(robot.specs).filter(
    ([, v]) => v != null && v !== "" && v !== false,
  );
  const specRows = specEntries
    .map(
      ([key, value]) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;">${fmtKey(key)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${fmtVal(value)}</td>
        </tr>`,
    )
    .join("");

  const hasTco =
    robot.priceCurrent != null &&
    (robot.maintenanceCostLow != null || robot.maintenanceCostHigh != null);

  let tcoSection = "";
  if (hasTco) {
    const avgMaint =
      robot.maintenanceCostLow != null && robot.maintenanceCostHigh != null
        ? Math.round((robot.maintenanceCostLow + robot.maintenanceCostHigh) / 2)
        : robot.maintenanceCostLow ?? robot.maintenanceCostHigh ?? 0;
    const fiveYear = robot.priceCurrent! + 5 * avgMaint;

    tcoSection = `
      <h2 style="font-size:18px;margin:32px 0 12px;color:#111827;">Total Cost of Ownership (Estimate)</h2>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;">
        <tbody>
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;">Purchase Price</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:600;">${fmtPrice(robot.priceCurrent!)}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;">Annual Maintenance (est.)</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${robot.maintenanceCostLow != null ? fmtPrice(robot.maintenanceCostLow) : "\u2014"} \u2013 ${robot.maintenanceCostHigh != null ? fmtPrice(robot.maintenanceCostHigh) : "\u2014"}</td>
          </tr>
          ${robot.warrantyMonths != null ? `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;">Warranty</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${robot.warrantyMonths} months</td></tr>` : ""}
          <tr style="background:#f0fdf4;">
            <td style="padding:8px 12px;font-weight:600;">5-Year Total</td>
            <td style="padding:8px 12px;font-weight:700;font-size:16px;">${fmtPrice(fiveYear)}</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>RoboScore Report \u2014 ${robot.name}</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 24px;
      color: #111827;
      background: #ffffff;
      font-size: 14px;
      line-height: 1.6;
    }
    table { font-size: 13px; }
    h1 { font-size: 28px; margin: 0 0 4px; }
    h2 { font-size: 18px; color: #111827; }
  </style>
</head>
<body>
  <div style="border-bottom:2px solid #2563EB;padding-bottom:16px;margin-bottom:24px;">
    <p style="font-size:12px;color:#2563EB;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 4px;">RoboScore Report</p>
    <h1>${robot.name}</h1>
    <p style="color:#6b7280;margin:4px 0 0;">by ${robot.manufacturer} &bull; Generated ${today}</p>
  </div>

  <div style="display:flex;gap:24px;margin-bottom:32px;align-items:center;">
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px 24px;text-align:center;">
      <p style="font-size:12px;color:#6b7280;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.1em;">Overall Score</p>
      <p style="font-size:40px;font-weight:700;margin:0;color:#111827;">${scoreStr}</p>
      <p style="font-size:12px;color:#9ca3af;margin:4px 0 0;">/ 100</p>
    </div>
    ${robot.priceCurrent != null ? `<div><p style="font-size:12px;color:#6b7280;margin:0;">Current Price</p><p style="font-size:24px;font-weight:700;margin:4px 0 0;">${fmtPrice(robot.priceCurrent)}</p></div>` : ""}
  </div>

  ${
    robot.scoreBreakdown
      ? `<h2 style="font-size:18px;margin:0 0 12px;color:#111827;">Score Breakdown</h2>
  <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;margin-bottom:32px;">
    <thead>
      <tr style="background:#f9fafb;">
        <th style="padding:8px 12px;text-align:left;border-bottom:1px solid #e5e7eb;font-size:12px;text-transform:uppercase;color:#6b7280;">Dimension</th>
        <th style="padding:8px 12px;text-align:center;border-bottom:1px solid #e5e7eb;font-size:12px;text-transform:uppercase;color:#6b7280;">Weight</th>
        <th style="padding:8px 12px;text-align:center;border-bottom:1px solid #e5e7eb;font-size:12px;text-transform:uppercase;color:#6b7280;">Score</th>
      </tr>
    </thead>
    <tbody>${scoreRows}</tbody>
  </table>`
      : ""
  }

  ${
    specEntries.length > 0
      ? `<h2 style="font-size:18px;margin:0 0 12px;color:#111827;">Technical Specifications</h2>
  <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;margin-bottom:32px;">
    <tbody>${specRows}</tbody>
  </table>`
      : ""
  }

  ${tcoSection}

  <div style="margin-top:48px;padding-top:16px;border-top:1px solid #e5e7eb;">
    <p style="font-size:11px;color:#9ca3af;">Generated by Robotomated &mdash; robotomated.com</p>
    <p style="font-size:11px;color:#9ca3af;">Scores follow the public RoboScore methodology. For methodology details visit robotomated.com/methodology</p>
  </div>
</body>
</html>`;
}

export function DownloadReport({ robot }: DownloadReportProps) {
  function handleDownload() {
    const html = buildReportHtml(robot);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, "_blank");
    if (!printWindow) {
      URL.revokeObjectURL(url);
      return;
    }
    printWindow.addEventListener("afterprint", () => {
      URL.revokeObjectURL(url);
    });
    printWindow.addEventListener("load", () => {
      printWindow.focus();
      printWindow.print();
    });
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 font-mono text-[10px] text-text-secondary transition-colors hover:bg-white/10 hover:text-text-primary"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
        <path d="M7 11l5 5l5 -5" />
        <path d="M12 4l0 12" />
      </svg>
      Download Report
    </button>
  );
}
