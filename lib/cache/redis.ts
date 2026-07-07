import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  redis = new Redis({ url, token });
  return redis;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const r = getRedis();
  if (!r) return null;
  try {
    return await r.get<T>(key);
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  const r = getRedis();
  if (!r) return;
  try {
    await r.set(key, value, { ex: ttlSeconds });
  } catch {
    // Silent fail — cache is non-critical
  }
}

/**
 * Fetch with cache — returns cached data or calls fetcher and caches the result.
 * `shouldCache` guards against persisting degraded-database fallbacks (empty
 * arrays, zero counts) for the full TTL — skipped results are recomputed on
 * the next request instead.
 */
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
  shouldCache: (data: T) => boolean = () => true
): Promise<T> {
  const cachedData = await cacheGet<T>(key);
  if (cachedData !== null) return cachedData;

  const data = await fetcher();
  if (shouldCache(data)) {
    await cacheSet(key, data, ttlSeconds);
  } else {
    console.warn(`[cache] not caching "${key}" — result looks like a degraded-database fallback`);
  }
  return data;
}
