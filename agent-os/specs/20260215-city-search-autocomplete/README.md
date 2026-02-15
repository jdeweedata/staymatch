# City Search with Autocomplete

**Spec ID**: 20260215-city-search-autocomplete
**Priority**: High
**Total Story Points**: 13
**Risk Level**: Low

## Overview

Add city search functionality with autocomplete dropdown and recent searches, replacing the hardcoded city list in the swipe deck. Users can search for any city supported by LiteAPI (2M+ hotels globally).

## Key Deliverables

- City search API endpoint with fuzzy matching
- Autocomplete dropdown component with keyboard navigation
- Recent searches stored per user
- Integration with booking flow

## Files to Create

| File | Purpose |
|------|---------|
| `app/api/cities/search/route.ts` | City search API endpoint |
| `lib/hooks/useCitySearch.ts` | Debounced city search hook |
| `components/ui/CityAutocomplete.tsx` | Autocomplete dropdown component |

## Files to Modify

| File | Change |
|------|--------|
| `lib/services/liteapi.ts` | Add `searchCities()` method |
| `prisma/schema.prisma` | Add `recentSearches` to User |
| `components/ui/SearchBar.tsx` | Integrate CityAutocomplete |

## Quick Start

```bash
# 1. Apply database migration
npm run db:migrate

# 2. Verify types
npm run type-check

# 3. Test the API
curl -X POST http://localhost:3000/api/cities/search \
  -H "Content-Type: application/json" \
  -d '{"query": "lis"}'
```

## Task Groups

| Group | Points | Status |
|-------|--------|--------|
| Backend (API + Service) | 5 | ⬜ Pending |
| Frontend (Components + Hook) | 5 | ⬜ Pending |
| Database (Schema + Migration) | 3 | ⬜ Pending |

---

**Generated**: 2026-02-15
**Generator**: PM Agent v1.0
