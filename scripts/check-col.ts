import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
  // Try selecting the new column
  const { data, error } = await sb
    .from("robots")
    .select("id, maintenance_annual_cost_low, vendor_health_score, warranty_months")
    .limit(1);

  if (error) {
    console.log("COLUMN STATUS: MISSING —", error.message);
  } else {
    console.log("COLUMN STATUS: EXISTS —", JSON.stringify(data));
  }
}

check();
