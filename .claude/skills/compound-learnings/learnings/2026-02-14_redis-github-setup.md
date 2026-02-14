# Session: Redis Caching + GitHub Setup

**Date**: 2026-02-14
**Duration**: ~30 min
**Outcome**: Redis caching layer complete, GitHub repo created

## What Was Done

### 1. Redis Caching Layer

Created complete Upstash Redis integration:

```
lib/cache/
├── redis.ts       # Core client, TTL constants, cached() helper
├── user-cache.ts  # User preference/taste vector caching
└── index.ts       # Module exports
```

**Cached Operations:**
| Function | TTL | Rationale |
|----------|-----|-----------|
| getCities | 24h | Rarely change |
| getHotelsByCity | 1h | Moderate change |
| getHotelDetails | 6h | Slow change |
| getSwipeDeckHotels | 2h | Session-based |
| User taste vectors | 7 days | Stable after onboarding |

### 2. GitHub Repository

Created `jdeweedata/staymatch` with full MVP codebase.

**Friction Encountered:**
- SSH key not loaded → `gh repo create --push` failed
- Solution: Switch to HTTPS remote

```bash
# When SSH fails
git remote set-url origin https://github.com/jdeweedata/staymatch.git
git push -u origin master
```

## Key Decisions

1. **Graceful fallback** - App works without Redis (important for dev/test)
2. **TTL-based strategy** - Different cache durations by data volatility
3. **REST-based Redis** - Upstash uses REST, simpler for serverless

## Files Modified

- `lib/services/liteapi.ts` - Added caching to API calls
- `.env` - Added Redis credentials
- `.env.example` - Created template
- `CLAUDE.md` - Updated stack and env vars

## Patterns Extracted

- `learnings/patterns/redis-caching.md` - Full caching pattern

## Follow-up Tasks

- [ ] Add cache invalidation on booking completion
- [ ] Add cache warming on deploy (optional)
- [ ] Monitor cache hit rates in production
