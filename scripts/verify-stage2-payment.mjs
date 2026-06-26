// Verify Stage 2 cert payment landed in rco_payments.
// Run: node --env-file=.env.local scripts/verify-stage2-payment.mjs
// Reads env from process.env only — never opens .env files in user code.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in process.env");
  process.exit(1);
}

const FOUNDATION_UUID = "0dbef61a-3a18-4c60-bc00-b2497b290263";
const supabase = createClient(url, key);

const { count, error: countErr } = await supabase
  .from("rco_payments")
  .select("*", { count: "exact", head: true });

if (countErr) {
  console.error("Count query failed:", countErr);
  process.exit(1);
}

const { data, error } = await supabase
  .from("rco_payments")
  .select("user_id, certification_id, payer_email, amount, currency, status, stripe_payment_intent_id, created_at")
  .order("created_at", { ascending: false })
  .limit(1);

if (error) {
  console.error("Latest-row query failed:", error);
  process.exit(1);
}

console.log(`Total rows in rco_payments: ${count}`);
console.log("\nMost recent rco_payments row:");
if (!data || data.length === 0) {
  console.log("  (no rows)");
  process.exit(0);
}

const row = data[0];
console.log(JSON.stringify(row, null, 2));

console.log("\nFoundation UUID match check:");
console.log(`  expected: ${FOUNDATION_UUID}`);
console.log(`  actual:   ${row.certification_id}`);
console.log(`  match:    ${row.certification_id === FOUNDATION_UUID ? "YES" : "NO"}`);
