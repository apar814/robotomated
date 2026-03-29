/**
 * Migration 013: Create market_reports table
 * Run: npx tsx scripts/apply-migration-013-market-reports.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log("Migration 013: Creating market_reports table...\n");

  const sql = `
    CREATE TABLE IF NOT EXISTS market_reports (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      source TEXT NOT NULL,
      source_url TEXT,
      report_date DATE,
      category TEXT,
      market_size_usd_billions DECIMAL,
      cagr_percent DECIMAL,
      forecast_year INT,
      key_findings TEXT[],
      raw_excerpt TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    ALTER TABLE market_reports ENABLE ROW LEVEL SECURITY;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Public read market_reports'
      ) THEN
        CREATE POLICY "Public read market_reports" ON market_reports FOR SELECT USING (true);
      END IF;
    END $$;
  `;

  // Try RPC first
  const { error } = await supabase.rpc("exec_sql", { query: sql });
  if (error) {
    console.log("RPC exec_sql failed:", error.message);
    console.log("Trying Management API...\n");

    // Use Supabase Management API (requires project ref)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const projectRef = supabaseUrl.replace("https://", "").replace(".supabase.co", "");
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // Try direct REST SQL execution
    const resp = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ query: sql }),
    });

    if (!resp.ok) {
      const body = await resp.text();
      console.log("REST API also failed:", body);
      console.log("\nPlease run this SQL in the Supabase dashboard SQL editor:");
      console.log(sql);
      console.log("\nAlternatively, skipping table creation — it may already exist.");
    } else {
      console.log("Table created via REST API.");
    }
  } else {
    console.log("Table created via RPC.");
  }

  // Verify
  const { error: verifyError } = await supabase
    .from("market_reports")
    .select("id")
    .limit(1);

  if (verifyError) {
    console.log("\nVerification failed:", verifyError.message);
    console.log("Table needs to be created manually. Run this SQL in Supabase dashboard:");
    console.log(`
CREATE TABLE IF NOT EXISTS market_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  source_url TEXT,
  report_date DATE,
  category TEXT,
  market_size_usd_billions DECIMAL,
  cagr_percent DECIMAL,
  forecast_year INT,
  key_findings TEXT[],
  raw_excerpt TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE market_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read market_reports" ON market_reports FOR SELECT USING (true);
    `);
  } else {
    console.log("Verified: market_reports table exists and is accessible.");
  }
}

main().catch(console.error);
