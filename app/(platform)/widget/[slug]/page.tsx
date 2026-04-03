import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { RoboScoreBadge } from "@/components/ui/robo-score";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug} — Robot Widget`,
    robots: { index: false },
  };
}

export default async function WidgetPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createServerClient();

  const { data: robot } = await supabase
    .from("robots")
    .select("name, slug, robo_score, price_current, description_short, images, manufacturers(name), robot_categories(slug)")
    .eq("slug", slug)
    .single();

  if (!robot) notFound();

  const imageUrl = Array.isArray(robot.images) && robot.images.length > 0
    ? (robot.images[0] as { url: string }).url
    : null;
  const mfr = (robot as Record<string, unknown>).manufacturers as { name: string } | null;
  const cat = (robot as Record<string, unknown>).robot_categories as { slug: string } | null;
  const price = robot.price_current
    ? `$${robot.price_current.toLocaleString()}`
    : "Contact for pricing";

  return (
    <div className="min-h-screen bg-[#0A0F1E] p-4">
      <div className="mx-auto max-w-md">
        <div className="glass rounded-xl p-6">
          {imageUrl && (
            <div className="mb-4 flex items-center justify-center rounded-lg bg-black/30 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt={robot.name} className="h-40 w-auto object-contain" />
            </div>
          )}
          <h1 className="font-display text-xl font-bold">{robot.name}</h1>
          {mfr && <p className="mt-1 text-sm text-muted">{mfr.name}</p>}
          {robot.description_short && (
            <p className="mt-3 text-sm text-muted">{robot.description_short}</p>
          )}
          <div className="mt-4 flex items-center justify-between">
            {robot.robo_score && <RoboScoreBadge score={robot.robo_score} />}
            <span className="font-mono text-sm font-semibold text-green">{price}</span>
          </div>
          <a
            href={`/explore/${cat?.slug || "all"}/${robot.slug}`}
            className="mt-4 block rounded-lg bg-blue py-2.5 text-center text-sm font-semibold text-[#0A0F1E] hover:bg-blue/90"
          >
            View on Robotomated
          </a>
        </div>
        <p className="mt-4 text-center text-xs text-muted/50">
          Embed this widget:{" "}
          <code className="font-mono text-xs text-muted/70">
            {`<iframe src="https://robotomated.com/widget/${robot.slug}" width="400" height="350"></iframe>`}
          </code>
        </p>
      </div>
    </div>
  );
}
