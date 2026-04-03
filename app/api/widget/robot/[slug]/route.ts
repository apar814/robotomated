import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

interface Props { params: Promise<{ slug: string }> }

export async function GET(request: NextRequest, { params }: Props) {
  const { slug } = await params;
  const supabase = createServerClient();

  const { data: robot } = await supabase
    .from("robots")
    .select("name, slug, robo_score, price_current, description_short, images, manufacturers(name)")
    .eq("slug", slug)
    .single();

  if (!robot) {
    return new NextResponse("Robot not found", { status: 404 });
  }

  const imageUrl = Array.isArray(robot.images) && robot.images.length > 0
    ? (robot.images[0] as { url: string }).url
    : "";
  const mfrName = (robot as Record<string, unknown>).manufacturers
    ? ((robot as Record<string, unknown>).manufacturers as { name: string }).name
    : "";
  const price = robot.price_current
    ? `$${robot.price_current.toLocaleString()}`
    : "Contact for pricing";
  const score = robot.robo_score ?? "N/A";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://robotomated.com";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Space Grotesk', system-ui, sans-serif; background: #0A0F1E; color: #E2E8F0; }
.card { border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; background: rgba(255,255,255,0.03); max-width: 400px; }
.card-img { width: 100%; height: 160px; object-fit: contain; border-radius: 8px; background: rgba(0,0,0,0.3); margin-bottom: 12px; }
.card-name { font-size: 18px; font-weight: 600; margin-bottom: 4px; }
.card-mfr { font-size: 13px; color: #94A3B8; margin-bottom: 12px; }
.card-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.score { background: linear-gradient(135deg, #00C2FF, #7B2FFF); color: white; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 14px; }
.price { font-size: 14px; color: #00E5A0; font-weight: 500; }
.cta { display: block; text-align: center; background: #00C2FF; color: #0A0F1E; padding: 10px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; }
.cta:hover { background: #00A8DD; }
</style>
</head>
<body>
<div class="card">
  ${imageUrl ? `<img class="card-img" src="${imageUrl}" alt="${robot.name}" />` : ""}
  <div class="card-name">${robot.name}</div>
  <div class="card-mfr">${mfrName}</div>
  <div class="card-row">
    <span class="score">RoboScore ${score}</span>
    <span class="price">${price}</span>
  </div>
  <a class="cta" href="${baseUrl}/explore/all/${robot.slug}" target="_blank" rel="noopener">View on Robotomated</a>
</div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Frame-Options": "ALLOWALL",
    },
  });
}
