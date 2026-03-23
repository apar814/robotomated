import { createServerClient } from "@/lib/supabase/server";

export const PRO_LIMITS = {
  free: {
    advisorConversationsPerMonth: 5,
    priceAlerts: 3,
    compareRobots: 2,
  },
  pro: {
    advisorConversationsPerMonth: Infinity,
    priceAlerts: Infinity,
    compareRobots: 5,
  },
} as const;

/**
 * Check if a user has Pro subscription.
 * Returns true if subscription_tier is 'pro' or 'enterprise'.
 */
export async function isPro(userId: string): Promise<boolean> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("users")
    .select("subscription_tier, subscription_ends_at")
    .eq("id", userId)
    .single()
    .returns<{ subscription_tier: string; subscription_ends_at: string | null }>();

  if (!data) return false;

  if (data.subscription_tier === "pro" || data.subscription_tier === "enterprise") {
    // Check if subscription hasn't expired
    if (data.subscription_ends_at) {
      return new Date(data.subscription_ends_at) > new Date();
    }
    return true;
  }

  return false;
}

/**
 * Get the number of advisor conversations this month for a user.
 */
export async function getMonthlyConversationCount(userId: string): Promise<number> {
  const supabase = createServerClient();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("advisor_conversations")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString());

  return count || 0;
}

/**
 * Get the number of active price alerts for an email.
 */
export async function getPriceAlertCount(email: string): Promise<number> {
  const supabase = createServerClient();
  const { count } = await supabase
    .from("price_alerts")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .eq("active", true);

  return count || 0;
}
