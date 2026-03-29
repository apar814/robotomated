/**
 * Run SQL migration directly against Supabase PostgreSQL
 * Run: npx tsx scripts/run-migration.ts <migration-file>
 */
import postgres from "postgres";
import * as fs from "fs";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
  const migrationFile = process.argv[2];
  if (!migrationFile) {
    console.log("Usage: npx tsx scripts/run-migration.ts <migration-file>");
    process.exit(1);
  }

  const sql_content = fs.readFileSync(migrationFile, "utf-8");
  console.log(`Running migration: ${migrationFile}\n`);

  // Build connection string from Supabase URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const projectRef = supabaseUrl.replace("https://", "").replace(".supabase.co", "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  // Supabase direct DB connection
  const dbUrl = `postgresql://postgres.${projectRef}:${serviceKey}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;

  const sql = postgres(dbUrl, { ssl: "require" });

  try {
    await sql.unsafe(sql_content);
    console.log("Migration completed successfully.");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log("Migration error:", msg);

    // Try splitting and running statements individually
    if (msg.includes("already exists") || msg.includes("duplicate")) {
      console.log("(Some objects already exist, which is fine.)");
    } else {
      // Try each statement individually
      const statements = sql_content
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith("--"));

      for (const stmt of statements) {
        try {
          await sql.unsafe(stmt);
          console.log(`  OK: ${stmt.slice(0, 60)}...`);
        } catch (e: unknown) {
          const eMsg = e instanceof Error ? e.message : String(e);
          console.log(`  Skip: ${eMsg.slice(0, 80)}`);
        }
      }
    }
  }

  await sql.end();
}

main().catch(console.error);
