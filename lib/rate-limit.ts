import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  return redis;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

/**
 * Simple sliding-window rate limiter using Upstash Redis.
 * Falls back to allowing all requests if Redis is unavailable.
 */
export async function rateLimit(
  identifier: string,
  limit: number = 100,
  windowSeconds: number = 3600
): Promise<RateLimitResult> {
  const client = getRedis();
  if (!client) {
    return { success: true, remaining: limit, reset: 0 };
  }

  const key = `rl:${identifier}`;

  try {
    const current = await client.incr(key);

    if (current === 1) {
      await client.expire(key, windowSeconds);
    }

    const ttl = await client.ttl(key);

    return {
      success: current <= limit,
      remaining: Math.max(0, limit - current),
      reset: ttl > 0 ? ttl : windowSeconds,
    };
  } catch {
    // Redis error — allow request
    return { success: true, remaining: limit, reset: 0 };
  }
}
