import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { RobotForm } from "@/components/admin/robot-form";
import { DIMENSIONS } from "@/lib/scoring/roboscore";
import type { Robot, RoboScoreBreakdown, Json } from "@/lib/supabase/types";

interface Props { params: Promise<{ id: string }> }

export default async function AdminEditRobotPage({ params }: Props) {
  const { id } = await params;
  const supabase = createServerClient();

  const { data: robot } = await supabase
    .from("robots")
    .select("*")
    .eq("id", id)
    .single()
    .returns<Robot>();

  if (!robot) notFound();

  const specs = (robot.specs || {}) as Record<string, unknown>;
  const bd = (robot.score_breakdown || {}) as Partial<RoboScoreBreakdown>;
  const images = (robot.images || []) as { url: string; alt: string }[];

  const initialData = {
    id: robot.id,
    slug: robot.slug,
    name: robot.name,
    manufacturer_id: robot.manufacturer_id,
    category_id: robot.category_id,
    model_number: robot.model_number || "",
    year_released: robot.year_released?.toString() || "",
    price_msrp: robot.price_msrp?.toString() || "",
    price_current: robot.price_current?.toString() || "",
    description_short: robot.description_short || "",
    description_long: robot.description_long || "",
    affiliate_url: robot.affiliate_url || "",
    amazon_asin: robot.amazon_asin || "",
    status: robot.status as "active" | "discontinued" | "coming_soon",
    specs: Object.entries(specs).map(([key, value]) => ({ key, value: String(value) })),
    images: images.length > 0 ? images : [{ url: "", alt: "" }],
    scores: Object.fromEntries(DIMENSIONS.map((d) => [d.key, (bd as Record<string, number>)[d.key] || 75])),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Edit: {robot.name}</h1>
      <RobotForm mode="edit" initialData={initialData} />
    </div>
  );
}
