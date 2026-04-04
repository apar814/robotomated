import { createServerClient } from "@/lib/supabase/server";
import crypto from "crypto";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

/* ------------------------------------------------------------------ */
/*  generateApiKey                                                     */
/* ------------------------------------------------------------------ */

export function generateApiKey(): {
  key: string;
  keyHash: string;
  prefix: string;
} {
  const raw = crypto.randomBytes(32).toString("base64url");
  const key = `rtm_live_${raw}`;
  const keyHash = sha256(key);
  const prefix = `rtm_live_${raw.slice(0, 8)}`;
  return { key, keyHash, prefix };
}

/* ------------------------------------------------------------------ */
/*  validateApiKey                                                     */
/* ------------------------------------------------------------------ */

export async function validateApiKey(key: string): Promise<
  | { valid: true; tier: string; keyId: string; userId: string }
  | { valid: false; error: string }
> {
  const keyHash = sha256(key);
  const supabase = createServerClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("api_keys")
    .select("id, user_id, tier, expires_at, requests_today, requests_per_day, total_requests")
    .eq("key_hash", keyHash)
    .single();

  if (error || !data) {
    return { valid: false, error: "Invalid API key" };
  }

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, error: "API key has expired" };
  }

  if (data.requests_today >= data.requests_per_day) {
    return {
      valid: false,
      error: `Daily rate limit exceeded (${data.requests_per_day} requests/day)`,
    };
  }

  // Increment counters
  await (supabase as any)
    .from("api_keys")
    .update({
      requests_today: data.requests_today + 1,
      total_requests: (data.total_requests ?? 0) + 1,
      last_used_at: new Date().toISOString(),
    })
    .eq("id", data.id);

  return {
    valid: true,
    tier: data.tier,
    keyId: data.id,
    userId: data.user_id,
  };
}

/* ------------------------------------------------------------------ */
/*  createApiKey                                                       */
/* ------------------------------------------------------------------ */

const TIER_LIMITS: Record<string, number> = {
  free: 100,
  starter: 1000,
  pro: 10000,
  enterprise: 100000,
};

export async function createApiKey(
  userId: string,
  name: string,
  tier: string = "free"
): Promise<{ key: string; keyId: string; prefix: string }> {
  const { key, keyHash, prefix } = generateApiKey();
  const supabase = createServerClient();

  const requestsPerDay = TIER_LIMITS[tier] ?? TIER_LIMITS.free;

  const { data, error } = await (supabase as any)
    .from("api_keys")
    .insert({
      user_id: userId,
      name,
      tier,
      key_hash: keyHash,
      key_prefix: prefix,
      requests_per_day: requestsPerDay,
      requests_today: 0,
      total_requests: 0,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create API key");
  }

  return { key, keyId: data.id, prefix };
}

/* ------------------------------------------------------------------ */
/*  revokeApiKey                                                       */
/* ------------------------------------------------------------------ */

export async function revokeApiKey(
  keyId: string,
  userId: string
): Promise<{ success: boolean }> {
  const supabase = createServerClient();

  const { error } = await (supabase as any)
    .from("api_keys")
    .delete()
    .eq("id", keyId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

/* ------------------------------------------------------------------ */
/*  getApiKeys                                                         */
/* ------------------------------------------------------------------ */

export async function getApiKeys(userId: string) {
  const supabase = createServerClient();

  const { data, error } = await (supabase as any)
    .from("api_keys")
    .select(
      "id, name, tier, key_prefix, requests_today, requests_per_day, total_requests, created_at, last_used_at, expires_at"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((k: Record<string, unknown>) => ({
    id: k.id,
    name: k.name,
    tier: k.tier,
    prefix: `${k.key_prefix}...`,
    requestsToday: k.requests_today,
    requestsPerDay: k.requests_per_day,
    totalRequests: k.total_requests,
    createdAt: k.created_at,
    lastUsedAt: k.last_used_at,
    expiresAt: k.expires_at,
  }));
}

/* ------------------------------------------------------------------ */
/*  resetDailyLimits (called by cron)                                  */
/* ------------------------------------------------------------------ */

export async function resetDailyLimits(): Promise<{ reset: number }> {
  const supabase = createServerClient();

  const { data, error } = await (supabase as any)
    .from("api_keys")
    .update({ requests_today: 0 })
    .gt("requests_today", 0)
    .select("id");

  if (error) {
    throw new Error(error.message);
  }

  return { reset: data?.length ?? 0 };
}
