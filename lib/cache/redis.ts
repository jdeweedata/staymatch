import { Redis } from "@upstash/redis";

// Initialize Redis client
// Uses UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from env
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  CITIES: 60 * 60 * 24, // 24 hours - cities rarely change
  HOTELS_BY_CITY: 60 * 60, // 1 hour - hotel list changes moderately
  HOTEL_DETAILS: 60 * 60 * 6, // 6 hours - details change slowly
  HOTEL_RATES: 60 * 5, // 5 minutes - rates change frequently
  USER_PREFERENCES: 60 * 60 * 24 * 7, // 7 days - user taste vectors
  SWIPE_DECK: 60 * 60 * 2, // 2 hours - swipe deck hotels
} as const;

// Cache key prefixes
export const CACHE_PREFIX = {
  CITIES: "cities",
  HOTELS: "hotels",
  HOTEL_DETAILS: "hotel",
  RATES: "rates",
  USER: "user",
  SWIPE: "swipe",
} as const;

/**
 * Generate cache key with consistent format
 */
export function cacheKey(...parts: (string | number)[]): string {
  return parts.map((p) => String(p).toLowerCase()).join(":");
}

/**
 * Get cached value or execute fetcher and cache result
 */
export async function cached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number
): Promise<T> {
  try {
    // Check if Redis is configured
    if (!process.env.UPSTASH_REDIS_REST_URL) {
      // Redis not configured, just run the fetcher
      return fetcher();
    }

    // Try to get from cache
    const cached = await redis.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch fresh data
    const data = await fetcher();

    // Cache the result
    await redis.setex(key, ttl, data);

    return data;
  } catch (error) {
    // On cache error, still return fresh data
    console.error("Cache error:", error);
    return fetcher();
  }
}

/**
 * Invalidate cache by key pattern
 */
export async function invalidateCache(pattern: string): Promise<void> {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL) return;

    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error("Cache invalidation error:", error);
  }
}

/**
 * Delete specific cache key
 */
export async function deleteCache(key: string): Promise<void> {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL) return;
    await redis.del(key);
  } catch (error) {
    console.error("Cache delete error:", error);
  }
}

/**
 * Set cache value directly
 */
export async function setCache<T>(key: string, value: T, ttl: number): Promise<void> {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL) return;
    await redis.setex(key, ttl, value);
  } catch (error) {
    console.error("Cache set error:", error);
  }
}

/**
 * Get cache value directly
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL) return null;
    return redis.get<T>(key);
  } catch (error) {
    console.error("Cache get error:", error);
    return null;
  }
}

/**
 * Check if cache key exists
 */
export async function hasCache(key: string): Promise<boolean> {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL) return false;
    return (await redis.exists(key)) === 1;
  } catch (error) {
    console.error("Cache exists error:", error);
    return false;
  }
}

export default redis;
