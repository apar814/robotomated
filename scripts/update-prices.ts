/**
 * Price monitoring script for Robotomated.com
 *
 * Fetches current prices for all robots with an Amazon ASIN
 * and updates the price_history table.
 *
 * Designed to run as a Vercel Cron Job daily at 6am UTC.
 * Endpoint: /api/cron/update-prices
 *
 * Usage (local dev):
 *   npx tsx scripts/update-prices.ts
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

interface RobotWithASIN {
  id: string;
  slug: string;
  name: string;
  amazon_asin: string;
  price_current: number | null;
}

/**
 * TODO: Implement actual Amazon Product Advertising API call
 * when API access is approved.
 *
 * Steps to implement:
 * 1. Sign up for Amazon Product Advertising API (PA-API 5.0)
 * 2. Set env vars: AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, AMAZON_PARTNER_TAG
 * 3. Use the GetItems operation with ItemIds = ASIN
 * 4. Extract: Offers.Listings[0].Price.Amount
 *
 * For now, this stub returns null to indicate "no update available".
 */
async function fetchAmazonPrice(asin: string): Promise<number | null> {
  // TODO: Replace with actual PA-API call
  // Example implementation:
  //
  // const paapi = new ProductAdvertisingAPIv1({
  //   accessKey: process.env.AMAZON_ACCESS_KEY!,
  //   secretKey: process.env.AMAZON_SECRET_KEY!,
  //   partnerTag: process.env.AMAZON_PARTNER_TAG!,
  //   host: 'webservices.amazon.com',
  //   region: 'us-east-1',
  // });
  //
  // const response = await paapi.getItems({
  //   ItemIds: [asin],
  //   Resources: ['Offers.Listings.Price'],
  // });
  //
  // return response.ItemsResult?.Items?.[0]?.Offers?.Listings?.[0]?.Price?.Amount ?? null;

  console.log(`  [STUB] Would fetch price for ASIN: ${asin}`);
  return null;
}

async function main() {
  console.log("[BOT] Robotomated Price Update Script");
  console.log("===================================");
  console.log(`Time: ${new Date().toISOString()}\n`);

  // Fetch all robots with Amazon ASINs
  const { data: robots, error } = await supabase
    .from("robots")
    .select("id, slug, name, amazon_asin, price_current")
    .not("amazon_asin", "is", null)
    .eq("status", "active");

  if (error) {
    console.error("Failed to fetch robots:", error.message);
    process.exit(1);
  }

  const withASIN = (robots || []).filter((r) => r.amazon_asin) as RobotWithASIN[];
  console.log(`Found ${withASIN.length} robots with Amazon ASINs\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const robot of withASIN) {
    console.log(`Processing: ${robot.name} (${robot.amazon_asin})`);

    try {
      const newPrice = await fetchAmazonPrice(robot.amazon_asin);

      if (newPrice === null) {
        console.log("  Skipped (no price data)\n");
        skipped++;
        continue;
      }

      // Record in price_history
      const { error: insertError } = await supabase
        .from("price_history")
        .insert({
          robot_id: robot.id,
          retailer: "amazon",
          price: newPrice,
          currency: "USD",
        });

      if (insertError) {
        console.error(`  Error recording price: ${insertError.message}\n`);
        errors++;
        continue;
      }

      // Update current price on robot if changed
      if (newPrice !== robot.price_current) {
        await supabase
          .from("robots")
          .update({ price_current: newPrice })
          .eq("id", robot.id);

        console.log(`  Updated: $${robot.price_current} → $${newPrice}\n`);
      } else {
        console.log(`  Price unchanged: $${newPrice}\n`);
      }

      updated++;

      // Rate limit: 1 request per second (Amazon PA-API limit)
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      console.error(`  Error: ${err}\n`);
      errors++;
    }
  }

  console.log("\n===================================");
  console.log(`Results: ${updated} updated, ${skipped} skipped, ${errors} errors`);
  console.log(`Total robots processed: ${withASIN.length}`);
}

main().catch(console.error);
