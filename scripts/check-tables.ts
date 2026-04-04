import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TABLES = [
  "robots", "manufacturers", "robot_categories",
  "robot_service_providers", "rsp_robots", "robowork_jobs", "robowork_bids", "robowork_reviews",
  "lease_inquiries", "lease_transfers", "robot_time_shares", "time_share_bookings",
  "rco_certifications", "rco_questions", "rco_exam_sessions", "rco_credentials", "rco_payments",
  "service_requests", "parts_listings", "trade_in_valuations", "cpo_listings", "robot_insurance_inquiries",
  "rsp_fleet_status", "rsp_maintenance_logs", "rsp_invoices",
  "manufacturer_claims", "manufacturer_partnerships", "manufacturer_contact_clicks",
];

async function main() {
  console.log("Checking tables in Supabase...\n");
  for (const table of TABLES) {
    const { data, error } = await sb.from(table).select("id").limit(1);
    if (error) {
      console.log(`  MISSING: ${table} (${error.code}: ${error.message})`);
    } else {
      console.log(`  EXISTS:  ${table} (${data.length} sample rows)`);
    }
  }
}

main().catch(console.error);
