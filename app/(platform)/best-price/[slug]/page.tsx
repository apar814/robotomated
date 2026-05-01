import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { PriceComparison } from "@/components/commerce/price-comparison";
import { PriceChart } from "@/components/robots/price-chart";
import { PriceAlertForm } from "@/components/commerce/price-alert-form";
import { AffiliateDisclosureInline } from "@/components/commerce/affiliate-disclosure";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { RoboScoreBadge } from "@/components/ui/robo-score";

interface RobotRow {
  id: string;
  slug: string;
  name: string;
  price_current: number | null;
  price_msrp: number | null;
  robo_score: number | null;
  affiliate_url: string | null;
  manufacturers: { name: string; website: string | null } | null;
  robot_categories: { slug: string; name: string } | null;
}

interface PricePoint { recorded_at: string; price: number; retailer: string; currency: string }

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data } = await supabase.from("robots").select("name").eq("slug", slug).single().returns<{ name: string }>();
  if (!data) return { title: "Robot Not Found" };
  return {
    title: `Best Price for ${data.name} — Price Comparison & Alerts`,
    description: `Compare prices for ${data.name} across retailers. Set price drop alerts and track price history.`,
  };
}

export default async function BestPricePage({ params }: Props) {
  const { slug } = await params;
  const supabase = createServerClient();

  const [{ data: robot }, { data: priceHistory }] = await Promise.all([
    supabase
      .from("robots")
      .select("id, slug, name, price_current, price_msrp, robo_score, affiliate_url, manufacturers(name, website), robot_categories(slug, name)")
      .eq("slug", slug)
      .single()
      .returns<RobotRow>(),
    supabase
      .from("price_history")
      .select("recorded_at, price, retailer, currency")
      .eq("robot_id", slug) // Will be corrected below
      .order("recorded_at", { ascending: true })
      .returns<PricePoint[]>(),
  ]);

  if (!robot) notFound();

  // Fetch price history using actual robot ID
  const { data: prices } = await supabase
    .from("price_history")
    .select("recorded_at, price, retailer, currency")
    .eq("robot_id", robot.id)
    .order("recorded_at", { ascending: true })
    .returns<PricePoint[]>();

  const mfr = robot.manufacturers as { name: string; website: string | null } | null;
  const cat = robot.robot_categories as { slug: string; name: string } | null;
  const priceData = prices || [];

  // Build price entries from history
  const latestPrices = new Map<string, PricePoint>();
  for (const p of priceData) {
    const existing = latestPrices.get(p.retailer);
    if (!existing || new Date(p.recorded_at) > new Date(existing.recorded_at)) {
      latestPrices.set(p.retailer, p);
    }
  }
  const priceEntries = Array.from(latestPrices.values()).map((p) => ({
    retailer: p.retailer,
    price: p.price,
    currency: p.currency,
  }));

  return (
    <div>
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <Breadcrumbs items={[
            { name: "Home", href: "/" },
            { name: "Explore", href: "/explore" },
            { name: robot.name, href: `/explore/${cat?.slug || "all"}/${robot.slug}` },
            { name: "Best Price", href: `/best-price/${robot.slug}` },
          ]} />

          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted">{mfr?.name}</p>
              <h1 className="text-3xl font-bold">{robot.name} — Best Price</h1>
            </div>
            <div className="text-right">
              {robot.robo_score != null && <RoboScoreBadge score={robot.robo_score} />}
              <div className="mt-2">
                {robot.price_current != null && (
                  <span className="text-2xl font-bold">${robot.price_current.toLocaleString()}</span>
                )}
                {robot.price_msrp != null && robot.price_current != null && robot.price_msrp > robot.price_current && (
                  <span className="ml-2 text-sm text-muted line-through">${robot.price_msrp.toLocaleString()}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Price comparison */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-xl font-bold">Compare Prices</h2>
          <PriceComparison
            robotSlug={robot.slug}
            prices={priceEntries}
            affiliateUrl={robot.affiliate_url}
            manufacturerWebsite={mfr?.website || null}
          />
          <AffiliateDisclosureInline />
        </div>
      </section>

      {/* Price history chart */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-xl font-bold">Price History</h2>
          <PriceChart data={priceData} />
        </div>
      </section>

      {/* Price alert */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <PriceAlertForm
            robotId={robot.id}
            robotName={robot.name}
            currentPrice={robot.price_current}
          />
        </div>
      </section>

      {/* Back to robot */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <Link
            href={`/explore/${cat?.slug || "all"}/${robot.slug}`}
            className="text-sm text-white hover:underline"
          >
            &larr; Back to {robot.name} full review
          </Link>
        </div>
      </section>
    </div>
  );
}
