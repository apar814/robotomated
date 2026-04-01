/**
 * Add referral_code and referral_count columns to newsletter_subscribers.
 * Generate unique 8-char codes for existing subscribers.
 *
 * Run: npx tsx scripts/add-referral-codes.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import * as crypto from "crypto";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateCode(): string {
  return crypto.randomBytes(4).toString("hex"); // 8 hex chars
}

async function main() {
  console.log("=== Adding Referral Codes to Newsletter Subscribers ===\n");

  // 1. Add columns if they don't exist
  const { error: alterErr } = await sb.rpc("exec_sql", {
    sql: `
      ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
      ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;
      ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS referred_by TEXT;
    `,
  });

  if (alterErr) {
    // rpc may not exist, try raw approach
    console.log("  Note: exec_sql RPC not available, columns may need manual migration.");
    console.log("  Run this SQL in Supabase dashboard:");
    console.log("    ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;");
    console.log("    ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;");
    console.log("    ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS referred_by TEXT;");
  } else {
    console.log("  [OK] Columns added");
  }

  // 2. Generate codes for subscribers without one
  const { data: subs } = await sb
    .from("newsletter_subscribers")
    .select("id, email, referral_code")
    .is("referral_code", null);

  if (!subs?.length) {
    console.log("\n  All subscribers already have referral codes.");
    return;
  }

  let updated = 0;
  for (const sub of subs) {
    const code = generateCode();
    const { error } = await sb
      .from("newsletter_subscribers")
      .update({ referral_code: code })
      .eq("id", sub.id);

    if (error) {
      console.error(`  [ERR] ${sub.email}: ${error.message}`);
    } else {
      updated++;
    }
  }

  console.log(`\n  ${updated} subscribers updated with referral codes.`);

  // Show sample
  const { data: sample } = await sb
    .from("newsletter_subscribers")
    .select("email, referral_code")
    .not("referral_code", "is", null)
    .limit(5);

  if (sample?.length) {
    console.log("\n  Sample codes:");
    for (const s of sample) {
      console.log(`    ${s.email} → ${s.referral_code}`);
    }
  }
}

main().catch(console.error);
