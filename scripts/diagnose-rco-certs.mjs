// One-off diagnostic: list rco_certifications rows to verify slug values
// Loads service-role key from .env.local. Run: node scripts/diagnose-rco-certs.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    })
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);
const { data, error } = await supabase
  .from("rco_certifications")
  .select("id, slug, name, level, active")
  .order("level");

if (error) {
  console.error("Query failed:", error);
  process.exit(1);
}

console.log("rco_certifications rows:");
console.table(data);
console.log(`\nTotal rows: ${data.length}`);
const foundation = data.find((r) => r.slug === "foundation");
console.log(`\nLookup by slug='foundation': ${foundation ? "FOUND" : "NOT FOUND"}`);
if (foundation) console.log("  →", foundation);
