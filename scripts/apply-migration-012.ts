/**
 * Apply migration 012 buyer intelligence fields via Supabase RPC.
 * Run: npx tsx scripts/apply-migration-012.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log("Applying migration 012: buyer intelligence fields...\n");

  const sql = `
    ALTER TABLE robots ADD COLUMN IF NOT EXISTS maintenance_annual_cost_low INT;
    ALTER TABLE robots ADD COLUMN IF NOT EXISTS maintenance_annual_cost_high INT;
    ALTER TABLE robots ADD COLUMN IF NOT EXISTS warranty_months INT;
    ALTER TABLE robots ADD COLUMN IF NOT EXISTS warranty_coverage TEXT;
    ALTER TABLE robots ADD COLUMN IF NOT EXISTS support_model TEXT;
    ALTER TABLE robots ADD COLUMN IF NOT EXISTS support_response_hours INT;
    ALTER TABLE robots ADD COLUMN IF NOT EXISTS spare_parts_availability TEXT;
    ALTER TABLE robots ADD COLUMN IF NOT EXISTS deployment_weeks_min INT;
    ALTER TABLE robots ADD COLUMN IF NOT EXISTS deployment_weeks_max INT;
    ALTER TABLE robots ADD COLUMN IF NOT EXISTS floor_space_sqft INT;
    ALTER TABLE robots ADD COLUMN IF NOT EXISTS power_requirements TEXT;
    ALTER TABLE robots ADD COLUMN IF NOT EXISTS network_requirements TEXT;
    ALTER TABLE robots ADD COLUMN IF NOT EXISTS wms_integrations TEXT[];
    ALTER TABLE robots ADD COLUMN IF NOT EXISTS erp_integrations TEXT[];
    ALTER TABLE robots ADD COLUMN IF NOT EXISTS api_available BOOLEAN;
    ALTER TABLE robots ADD COLUMN IF NOT EXISTS operator_training_hours INT;
    ALTER TABLE robots ADD COLUMN IF NOT EXISTS safety_certifications TEXT[];
    ALTER TABLE robots ADD COLUMN IF NOT EXISTS industry_certifications TEXT[];
    ALTER TABLE robots ADD COLUMN IF NOT EXISTS vendor_funding_total TEXT;
    ALTER TABLE robots ADD COLUMN IF NOT EXISTS vendor_employees_range TEXT;
    ALTER TABLE robots ADD COLUMN IF NOT EXISTS vendor_health_score INT;
  `;

  const { error } = await sb.rpc("exec_sql", { query: sql });

  if (error) {
    // rpc exec_sql may not exist — try raw SQL via postgrest
    console.log("RPC not available, trying individual column adds...\n");

    const columns = [
      "maintenance_annual_cost_low INT",
      "maintenance_annual_cost_high INT",
      "warranty_months INT",
      "warranty_coverage TEXT",
      "support_model TEXT",
      "support_response_hours INT",
      "spare_parts_availability TEXT",
      "deployment_weeks_min INT",
      "deployment_weeks_max INT",
      "floor_space_sqft INT",
      "power_requirements TEXT",
      "network_requirements TEXT",
      "wms_integrations TEXT[]",
      "erp_integrations TEXT[]",
      "api_available BOOLEAN",
      "operator_training_hours INT",
      "safety_certifications TEXT[]",
      "industry_certifications TEXT[]",
      "vendor_funding_total TEXT",
      "vendor_employees_range TEXT",
      "vendor_health_score INT",
    ];

    // Use supabase-js doesn't support raw DDL, so we need to use the REST API directly
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    for (const col of columns) {
      const colName = col.split(" ")[0];
      const colType = col.split(" ").slice(1).join(" ");
      const ddl = `ALTER TABLE robots ADD COLUMN IF NOT EXISTS ${colName} ${colType}`;

      const res = await fetch(`${url}/rest/v1/rpc/`, {
        method: "POST",
        headers: {
          "apikey": key,
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: ddl }),
      });

      if (!res.ok) {
        // Fallback: use the SQL editor endpoint
        console.log(`  Column ${colName}: will need manual SQL (REST DDL not supported)`);
      } else {
        console.log(`  [OK] ${colName}`);
      }
    }
  } else {
    console.log("[OK] All columns added successfully");
  }

  // Verify
  const { data, error: checkErr } = await sb
    .from("robots")
    .select("id, maintenance_annual_cost_low")
    .limit(1);

  if (checkErr) {
    console.log("\n[ERR] Columns still missing. You need to run this SQL in the Supabase SQL Editor:");
    console.log("\n" + sql);
  } else {
    console.log("\n[OK] Migration verified — columns exist");
  }
}

main().catch(console.error);
