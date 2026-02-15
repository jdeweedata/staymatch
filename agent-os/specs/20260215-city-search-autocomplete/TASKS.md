# Tasks: City Search with Autocomplete

**Spec ID**: 20260215-city-search-autocomplete
**Total Points**: 13
**Estimated Duration**: 2-3 days

---

## Task Group 1: Backend (5 points)

**Owner**: backend-engineer
**Dependencies**: None
**Status**: ⬜ Pending

### Tasks

#### T1.1: Add City Type Definitions (1 point)

**File**: `lib/services/liteapi.ts`

- [ ] Add `City` interface with code, name, country, countryCode
- [ ] Add `CitySearchParams` interface
- [ ] Export types for use in API and components

```typescript
export interface City {
  code: string;
  name: string;
  country: string;
  countryCode: string;
}
```

#### T1.2: Implement searchCities Service Method (2 points)

**File**: `lib/services/liteapi.ts`

- [ ] Add `searchCities(query, countryCode?, limit?)` method
- [ ] Fetch and cache full city list using existing `getCities()`
- [ ] Implement fuzzy matching (starts-with priority, then contains)
- [ ] Return sorted results limited to requested count
- [ ] Handle empty query (return empty array)

#### T1.3: Create City Search API Endpoint (2 points)

**File**: `app/api/cities/search/route.ts` (new)

- [ ] Create POST handler with Zod validation
- [ ] Validate query length >= 2
- [ ] Call `liteApiService.searchCities()`
- [ ] Return `{ cities, count }` response
- [ ] Handle errors with proper status codes

**Validation Schema:**
```typescript
const searchSchema = z.object({
  query: z.string().min(2).max(100),
  countryCode: z.string().length(2).optional(),
  limit: z.number().min(1).max(20).default(10),
});
```

---

## Task Group 2: Database (3 points)

**Owner**: database-engineer
**Dependencies**: None (parallel with Group 1)
**Status**: ⬜ Pending

### Tasks

#### T2.1: Update User Schema (1 point)

**File**: `prisma/schema.prisma`

- [ ] Add `recentSearches Json?` field to User model
- [ ] Add comment documenting the JSON structure

#### T2.2: Create Migration (1 point)

**Command**: `npm run db:migrate`

- [ ] Run `prisma migrate dev --name add_recent_searches`
- [ ] Verify migration applies cleanly
- [ ] Test rollback works

#### T2.3: Create Recent Searches API (1 point)

**File**: `app/api/cities/recent/route.ts` (new)

- [ ] GET: Return user's recent searches (requires auth)
- [ ] POST: Add a city to recent searches
- [ ] DELETE: Clear all recent searches
- [ ] Limit to 5 most recent
- [ ] Deduplicate by cityCode

---

## Task Group 3: Frontend (5 points)

**Owner**: frontend-engineer
**Dependencies**: Task Group 1 (API must exist)
**Status**: ⬜ Pending

### Tasks

#### T3.1: Create useCitySearch Hook (2 points)

**File**: `lib/hooks/useCitySearch.ts` (new)

- [ ] Accept `query` and optional `debounceMs` parameters
- [ ] Return `{ results, isLoading, error }`
- [ ] Debounce API calls (default 300ms)
- [ ] Cancel pending requests on new input
- [ ] Clear results when query < 2 chars
- [ ] Export hook from `lib/hooks/index.ts`

#### T3.2: Create CityAutocomplete Component (3 points)

**File**: `components/ui/CityAutocomplete.tsx` (new)

- [ ] Accept `value`, `onChange`, `placeholder`, `showRecent` props
- [ ] Render input with search icon
- [ ] Show dropdown when focused and has results/recent
- [ ] Display recent searches section (if authenticated)
- [ ] Display search results section
- [ ] Implement keyboard navigation:
  - Arrow down/up: Navigate results
  - Enter: Select highlighted
  - Escape: Close dropdown
- [ ] Show loading spinner during search
- [ ] Show "No cities found" for empty results
- [ ] Style with TailwindCSS + brand colors
- [ ] Animate dropdown with framer-motion
- [ ] Close dropdown on outside click

**Component Structure:**
```
CityAutocomplete
├── Input (with search icon)
├── Dropdown (AnimatePresence)
│   ├── RecentSection (if showRecent && hasRecent)
│   │   ├── Header "Recent Searches"
│   │   └── CityItem[] (with remove button)
│   ├── Divider (if both sections)
│   └── ResultsSection
│       ├── Header "Suggestions" / "No results"
│       └── CityItem[] (highlighted on hover/keyboard)
└── [optional] ClearButton (if hasValue)
```

---

## Task Group 4: Integration (0 points - included in above)

**Owner**: frontend-engineer
**Dependencies**: Task Groups 1, 2, 3
**Status**: ⬜ Pending

### Tasks

#### T4.1: Integrate with Booking Page

**File**: `app/(main)/booking/page.tsx`

- [ ] Import CityAutocomplete
- [ ] Replace city input with CityAutocomplete
- [ ] Pass selected city to rate search

#### T4.2: Update SearchBar (Optional)

**File**: `components/ui/SearchBar.tsx`

- [ ] Add optional `useAutocomplete` prop
- [ ] Wrap with CityAutocomplete when enabled

---

## Summary

| Group | Points | Tasks | Files |
|-------|--------|-------|-------|
| Backend | 5 | 3 | 2 |
| Database | 3 | 3 | 3 |
| Frontend | 5 | 2 | 2 |
| **Total** | **13** | **8** | **7** |

---

## Execution Order

```
Day 1:
  ├── [Parallel] T1.1, T1.2, T1.3 (Backend)
  └── [Parallel] T2.1, T2.2, T2.3 (Database)

Day 2:
  ├── T3.1 (Hook - needs API)
  └── T3.2 (Component - needs Hook)

Day 3:
  ├── T4.1, T4.2 (Integration)
  └── Testing & Polish
```

---

## Definition of Done

- [ ] All tasks completed
- [ ] TypeScript compiles without errors
- [ ] No console errors in browser
- [ ] Works on mobile and desktop
- [ ] Recent searches persist across sessions
- [ ] Keyboard navigation works
- [ ] Code reviewed and approved
