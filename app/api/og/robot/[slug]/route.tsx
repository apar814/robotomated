import { ImageResponse } from "@vercel/og";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

const DIMENSIONS = [
  { key: "performance", label: "Performance" },
  { key: "reliability", label: "Reliability" },
  { key: "ease_of_use", label: "Ease of Use" },
  { key: "intelligence", label: "Intelligence" },
  { key: "value", label: "Value" },
  { key: "ecosystem", label: "Ecosystem" },
  { key: "safety", label: "Safety" },
  { key: "design", label: "Design" },
] as const;

function barColor(score: number): string {
  if (score >= 70) return "#00E5A0";
  if (score >= 50) return "#FACC15";
  return "#EF4444";
}

function fmtPrice(p: number): string {
  if (p >= 1000000) return `$${(p / 1000000).toFixed(1)}M`;
  if (p >= 1000) return `$${(p / 1000).toFixed(1)}K`;
  return `$${p.toLocaleString()}`;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data } = await supabase
    .from("robots")
    .select("name, robo_score, score_breakdown, price_current, manufacturers(name)")
    .eq("slug", slug)
    .single();

  if (!data) {
    // Fallback generic image
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#080808",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#D4D4D4",
              letterSpacing: "-0.03em",
            }}
          >
            ROBOTOMATED
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#9CA3AF",
              marginTop: 16,
            }}
          >
            Robot Intelligence Platform
          </div>
          <div
            style={{
              fontSize: 16,
              color: "#6B7280",
              marginTop: 8,
            }}
          >
            robotomated.com
          </div>
        </div>
      ),
      { width: 1200, height: 630 },
    );
  }

  const robotName = data.name as string;
  const roboScore = data.robo_score as number | null;
  const breakdown = data.score_breakdown as Record<string, number> | null;
  const price = data.price_current as number | null;
  const mfrRaw = data.manufacturers as unknown;
  const manufacturer = Array.isArray(mfrRaw)
    ? (mfrRaw[0] as { name: string })?.name || ""
    : (mfrRaw as { name: string } | null)?.name || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#080808",
          padding: "48px 56px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Left section (60%) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "60%",
            paddingRight: 40,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Manufacturer */}
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
              }}
            >
              {manufacturer}
            </div>

            {/* Robot name */}
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
                marginTop: 12,
                lineHeight: 1.1,
              }}
            >
              {robotName}
            </div>

            {/* Price */}
            {price != null && (
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: "#D4D4D4",
                  marginTop: 24,
                  fontFamily: "monospace",
                }}
              >
                {fmtPrice(price)}
              </div>
            )}
          </div>

          {/* Bottom branding */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#D4D4D4",
                letterSpacing: "0.08em",
              }}
            >
              ROBOTOMATED
            </div>
            <div
              style={{
                fontSize: 14,
                color: "#6B7280",
                marginTop: 4,
              }}
            >
              robotomated.com
            </div>
          </div>
        </div>

        {/* Right section (40%) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "40%",
            borderLeft: "1px solid #1F2937",
            paddingLeft: 40,
          }}
        >
          {/* Large RoboScore */}
          {roboScore != null ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  marginBottom: 8,
                }}
              >
                RoboScore
              </div>
              <div
                style={{
                  fontSize: 80,
                  fontWeight: 700,
                  color: "#D4D4D4",
                  lineHeight: 1,
                }}
              >
                {roboScore.toFixed(1)}
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: "#6B7280",
                  marginTop: 4,
                }}
              >
                / 100
              </div>
            </div>
          ) : (
            <div
              style={{
                fontSize: 20,
                color: "#6B7280",
              }}
            >
              Not yet rated
            </div>
          )}

          {/* Mini radar bars */}
          {breakdown && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                marginTop: 32,
                gap: 6,
              }}
            >
              {DIMENSIONS.map((dim) => {
                const score = (breakdown[dim.key] as number) ?? 0;
                return (
                  <div
                    key={dim.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: "#9CA3AF",
                        width: 70,
                        textAlign: "right",
                        flexShrink: 0,
                      }}
                    >
                      {dim.label}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flex: 1,
                        height: 8,
                        backgroundColor: "#1F2937",
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${score}%`,
                          height: "100%",
                          backgroundColor: barColor(score),
                          borderRadius: 4,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#D1D5DB",
                        width: 24,
                        textAlign: "right",
                        flexShrink: 0,
                      }}
                    >
                      {score}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
