import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/auth-server";
import { createServerClient } from "@/lib/supabase/server";
import { ServiceLogForm } from "@/components/fleet/service-log-form";
import { DEMO_ASSETS } from "@/lib/fleet/demo-data";

export const metadata: Metadata = {
  title: "Log Service | Fleet | Robotomated",
  description: "Log a maintenance service for a robot in your fleet.",
};

export default async function LogServicePage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;

  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Resolve asset name
  let assetName = "Unknown Robot";

  const db = createServerClient();
  const { data: dbAsset } = await db
    .from("robot_assets")
    .select("custom_name, robots(name)")
    .eq("id", assetId)
    .eq("user_id", user.id)
    .single();

  if (dbAsset) {
    assetName =
      dbAsset.custom_name ||
      ((dbAsset as Record<string, unknown>).robots as { name: string } | null)?.name ||
      "Unknown Robot";
  } else {
    // Check demo data
    const demoAsset = DEMO_ASSETS.find((a) => a.id === assetId);
    if (demoAsset) {
      assetName = demoAsset.custom_name || demoAsset.robot_name;
    } else {
      return notFound();
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-white/40">
        <Link href="/fleet" className="hover:text-white/70 transition-colors">
          Fleet
        </Link>
        <span>/</span>
        <Link
          href={`/fleet/${assetId}`}
          className="hover:text-white/70 transition-colors"
        >
          {assetName}
        </Link>
        <span>/</span>
        <span className="text-white/60">Log Service</span>
      </nav>

      <h1 className="mb-8 text-2xl font-bold text-white">Log Service</h1>

      <ServiceLogForm assetId={assetId} assetName={assetName} />
    </div>
  );
}
