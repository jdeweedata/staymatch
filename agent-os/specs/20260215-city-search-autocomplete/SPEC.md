# Specification: City Search with Autocomplete

**Spec ID**: 20260215-city-search-autocomplete
**Author**: PM Agent
**Date**: 2026-02-15
**Status**: Draft

---

## 1. Overview

### 1.1 Description

Implement city search with autocomplete functionality for the StayMatch platform. Users can type a city name and see matching suggestions in a dropdown, with keyboard navigation support. Recent searches are persisted per user for quick access.

### 1.2 Goals

- Enable users to search for any city in the LiteAPI inventory (2M+ hotels)
- Provide fast, responsive autocomplete with <200ms perceived latency
- Store recent searches for quick repeat access
- Replace hardcoded cities (Lisbon, Bali, Bangkok) with dynamic selection

### 1.3 Non-Goals

- Full-text search across hotels (separate feature)
- Location-based/GPS city detection
- Multi-city trip planning
- City popularity ranking/recommendations

### 1.4 Success Criteria

- [ ] Users can search and select any city
- [ ] Autocomplete shows results within 200ms of typing
- [ ] Recent searches appear when input is focused
- [ ] Keyboard navigation works (arrow keys, enter, escape)
- [ ] Selected city flows into booking/swipe deck

---

## 2. User Stories

### US-1: Search for a City

**As a** traveler
**I want to** search for a city by name
**So that** I can find hotels in my destination

**Acceptance Criteria:**
- [ ] Typing 2+ characters triggers search
- [ ] Results show city name and country
- [ ] Results update as user types (debounced 300ms)
- [ ] Maximum 10 results shown
- [ ] "No results found" shown for empty results

### US-2: Select from Autocomplete

**As a** traveler
**I want to** select a city from the dropdown
**So that** I can proceed with my search

**Acceptance Criteria:**
- [ ] Clicking a result selects it
- [ ] Enter key selects highlighted result
- [ ] Arrow keys navigate results
- [ ] Escape closes dropdown
- [ ] Selection triggers onSelect callback

### US-3: View Recent Searches

**As a** returning user
**I want to** see my recent city searches
**So that** I can quickly re-search previous destinations

**Acceptance Criteria:**
- [ ] Last 5 searches shown when input focused (empty)
- [ ] Recent searches shown above live results
- [ ] Clicking recent search selects it
- [ ] Recent searches persist across sessions
- [ ] Only shown for authenticated users

### US-4: Clear Recent Searches

**As a** user
**I want to** clear my recent search history
**So that** I can start fresh

**Acceptance Criteria:**
- [ ] "Clear recent" button visible when recent searches shown
- [ ] Clicking clears all recent searches
- [ ] Confirmation not required (low-stakes action)

---

## 3. Technical Specification

### 3.1 API Endpoint

**POST /api/cities/search**

```typescript
// Request
{
  query: string;        // Min 2 chars
  countryCode?: string; // Optional filter
  limit?: number;       // Default 10, max 20
}

// Response
{
  cities: Array<{
    code: string;       // City code for LiteAPI
    name: string;       // Display name
    country: string;    // Country name
    countryCode: string;// ISO country code
  }>;
  count: number;
}
```

**Caching Strategy:**
- Cache full city list for 24 hours (CACHE_TTL.CITIES)
- Filter cached list on each request (no API call per search)
- Key: `cities:all` or `cities:{countryCode}`

### 3.2 Database Changes

**User Model Update:**

```prisma
model User {
  // ... existing fields
  recentSearches Json? // Array of { cityCode, cityName, countryCode, searchedAt }
}
```

**Recent Search Structure:**
```typescript
interface RecentSearch {
  cityCode: string;
  cityName: string;
  countryCode: string;
  searchedAt: string; // ISO date
}
```

### 3.3 Service Method

**Add to `lib/services/liteapi.ts`:**

```typescript
async searchCities(query: string, countryCode?: string, limit = 10): Promise<City[]> {
  // 1. Get cached city list
  const allCities = await this.getCities(countryCode);

  // 2. Filter by query (case-insensitive, starts-with + contains)
  const normalizedQuery = query.toLowerCase().trim();

  const startsWithMatches = allCities.filter(c =>
    c.name.toLowerCase().startsWith(normalizedQuery)
  );

  const containsMatches = allCities.filter(c =>
    !c.name.toLowerCase().startsWith(normalizedQuery) &&
    c.name.toLowerCase().includes(normalizedQuery)
  );

  // 3. Return starts-with first, then contains
  return [...startsWithMatches, ...containsMatches].slice(0, limit);
}
```

### 3.4 React Hook

**`lib/hooks/useCitySearch.ts`:**

```typescript
function useCitySearch(query: string, debounceMs = 300) {
  const [results, setResults] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/cities/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
          signal: controller.signal,
        });
        const data = await res.json();
        setResults(data.cities);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Failed to search cities');
        }
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, debounceMs]);

  return { results, isLoading, error };
}
```

### 3.5 Component Structure

**`components/ui/CityAutocomplete.tsx`:**

```
┌─────────────────────────────────────┐
│ 🔍 Search cities...                 │
├─────────────────────────────────────┤
│ Recent Searches                     │
│ ├─ Lisbon, Portugal              ✕  │
│ └─ Bangkok, Thailand             ✕  │
├─────────────────────────────────────┤
│ Suggestions                         │
│ ├─ Lisboa, Portugal        [hover]  │
│ ├─ Lismore, Australia               │
│ └─ Lisieux, France                  │
└─────────────────────────────────────┘
```

**Props:**
```typescript
interface CityAutocompleteProps {
  value: City | null;
  onChange: (city: City | null) => void;
  placeholder?: string;
  className?: string;
  showRecent?: boolean; // Default true for auth users
}
```

---

## 4. Integration Points

### 4.1 Booking Flow

Update `app/(main)/booking/page.tsx`:
- Replace hardcoded city selector with CityAutocomplete
- Pass selected city to rate search API

### 4.2 Swipe Deck

Update `app/api/hotels/swipe-deck/route.ts`:
- Accept `cityCode` parameter instead of hardcoded list
- Fall back to popular cities if no city specified

### 4.3 Matches Page

Update `app/(main)/matches/page.tsx`:
- Add city filter to matches display
- Allow changing city to refresh matches

---

## 5. Risk Assessment

**Risk Level**: Low

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| LiteAPI rate limits | Low | Medium | Cache city list for 24h |
| Slow autocomplete | Low | High | Client-side filtering of cached list |
| Empty results | Medium | Low | Show "No cities found" with suggestions |

---

## 6. Testing Strategy

### Unit Tests
- [ ] `searchCities()` filters correctly (starts-with priority)
- [ ] Hook debounces requests
- [ ] Hook cancels pending requests on unmount

### Integration Tests
- [ ] API returns valid city structure
- [ ] Recent searches persist across sessions
- [ ] Cache invalidation works

### E2E Tests
- [ ] Type → see results → select → verify selection
- [ ] Keyboard navigation (arrows, enter, escape)
- [ ] Recent searches appear on focus

---

## 7. Rollout Plan

1. **Phase 1**: API + Service (no UI changes)
2. **Phase 2**: Component + Hook (feature-flagged)
3. **Phase 3**: Integration with booking flow
4. **Phase 4**: Remove hardcoded cities

---

## Appendix: LiteAPI Cities Response

Sample response from `client.getCitiesByCountryCode()`:

```json
[
  {
    "cityCode": "LIS",
    "cityName": "Lisbon",
    "countryCode": "PT",
    "countryName": "Portugal"
  },
  {
    "cityCode": "BKK",
    "cityName": "Bangkok",
    "countryCode": "TH",
    "countryName": "Thailand"
  }
]
```
