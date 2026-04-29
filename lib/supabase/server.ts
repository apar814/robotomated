import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/** Service-role client for admin operations (bypasses RLS) */
export function createServerClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Untyped service-role client for tables not yet in generated Database types.
 * Use this for workforce network tables (employer_intent, cohorts, certification_enrollments).
 * Remove once `npx supabase gen types` is re-run after migration 039.
 */
export function createUntypedServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
