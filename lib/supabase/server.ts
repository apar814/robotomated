import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * 10s cap on every Supabase request so a degraded database can never hang
 * a build (60s static-gen timeout) or a request. supabase-js surfaces the
 * abort as { data: null, error }, so callers' existing `data || []`
 * fallbacks render an empty state instead of crashing.
 */
const QUERY_TIMEOUT_MS = 10_000;

export function resilientFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return fetch(input, {
    ...init,
    signal: init?.signal ?? AbortSignal.timeout(QUERY_TIMEOUT_MS),
  }).catch((err) => {
    if (err instanceof Error && err.name === "TimeoutError") {
      console.warn(`[supabase] query timed out after ${QUERY_TIMEOUT_MS / 1000}s: ${String(input).slice(0, 120)}`);
    }
    throw err;
  });
}

/** Service-role client for admin operations (bypasses RLS) */
export function createServerClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { global: { fetch: resilientFetch } }
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
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { global: { fetch: resilientFetch } }
  );
}
