# Redis Caching Pattern (Upstash)

Serverless-friendly caching with graceful fallback.

## Setup

```bash
npm install @upstash/redis
```

## Core Client

```tsx
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});
```

## TTL Strategy

```tsx
export const CACHE_TTL = {
  STATIC: 60 * 60 * 24,      // 24h - rarely changes (cities, countries)
  MODERATE: 60 * 60,          // 1h - changes moderately (hotel lists)
  DETAILS: 60 * 60 * 6,       // 6h - slow change (hotel details)
  DYNAMIC: 60 * 5,            // 5min - frequent change (rates, availability)
  USER: 60 * 60 * 24 * 7,     // 7 days - user preferences
  SESSION: 60 * 60 * 2,       // 2h - session-based data
} as const;
```

## Graceful Fallback Pattern

```tsx
export async function cached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number
): Promise<T> {
  try {
    // Skip cache if Redis not configured
    if (!process.env.UPSTASH_REDIS_REST_URL) {
      return fetcher();
    }

    // Try cache first
    const cached = await redis.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch and cache
    const data = await fetcher();
    await redis.setex(key, ttl, data);
    return data;
  } catch (error) {
    // On cache error, still return fresh data
    console.error("Cache error:", error);
    return fetcher();
  }
}
```

## Cache Key Generation

```tsx
export function cacheKey(...parts: (string | number)[]): string {
  return parts.map((p) => String(p).toLowerCase()).join(":");
}

// Usage
const key = cacheKey("hotels", cityCode, limit);
// Result: "hotels:lisbon:50"
```

## Usage in Services

```tsx
async getHotelsByCity(cityCode: string, limit = 50): Promise<Hotel[]> {
  const key = cacheKey(CACHE_PREFIX.HOTELS, cityCode, limit);

  return cached(
    key,
    async () => {
      // Expensive API call here
      const response = await client.getDataHotels(cityCode, limit);
      return normalizeHotels(response.data);
    },
    CACHE_TTL.MODERATE
  );
}
```

## Environment Variables

```env
UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxx"
```

## Key Principles

1. **Always fallback** - App must work without Redis
2. **TTL by volatility** - Match cache duration to data change frequency
3. **Consistent keys** - Use `cacheKey()` helper for uniformity
4. **Log errors, don't throw** - Cache failures shouldn't break the app

## Gotchas

- Upstash uses REST API, not Redis protocol
- Build warnings about missing config are expected (harmless)
- Serialization is automatic (JSON), no need to stringify
