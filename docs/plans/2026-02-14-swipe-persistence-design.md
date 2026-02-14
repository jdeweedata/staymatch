# Swipe Persistence API Design

**Date:** 2026-02-14
**Status:** Approved
**Effort:** S (2-3 days)

## Overview

Persist user swipes during onboarding to enable:
- Resume onboarding if user leaves mid-session
- Compute taste vectors from swipe history
- Track engagement metrics

## Requirements

| Requirement | Decision |
|-------------|----------|
| Minimum swipes to complete | 10 |
| Minimum likes required | 3 |
| Persistence strategy | Real-time (each swipe = 1 API call) |
| Undo behavior | DELETE removes record from database |
| Conflict handling | Upsert (update direction if swipe exists) |

## API Endpoints

### POST /api/swipes

Create or update a swipe record.

**Auth:** Required (JWT)

**Request:**
```json
{
  "hotelImageId": "string",
  "direction": "LEFT" | "RIGHT" | "SUPER_LIKE"
}
```

**Response (200):**
```json
{
  "id": "string",
  "count": 10,
  "isComplete": true
}
```

**Completion Logic:**
- `isComplete = true` when `count >= 10` AND `liked >= 3`
- On completion, set `user.onboardingComplete = true`

### DELETE /api/swipes/:id

Delete a swipe record (undo).

**Auth:** Required

**Response (200):**
```json
{
  "success": true,
  "count": 9
}
```

### GET /api/swipes/progress

Get user's swipe progress.

**Auth:** Required

**Response (200):**
```json
{
  "count": 10,
  "isComplete": true,
  "liked": 6,
  "disliked": 4
}
```

## Database Operations

### Create Swipe (Upsert)
```sql
INSERT INTO "Swipe" (id, userId, hotelImageId, direction, createdAt)
VALUES (cuid(), $userId, $hotelImageId, $direction, now())
ON CONFLICT (userId, hotelImageId) DO UPDATE SET direction = $direction
RETURNING id
```

### Delete Swipe
```sql
DELETE FROM "Swipe"
WHERE id = $id AND userId = $userId
RETURNING id
```

### Get Progress
```sql
SELECT
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE direction IN ('RIGHT', 'SUPER_LIKE')) as liked,
  COUNT(*) FILTER (WHERE direction = 'LEFT') as disliked
FROM "Swipe"
WHERE userId = $userId
```

## Frontend Integration

### OnboardingPage Changes

1. **On swipe:** POST to `/api/swipes` with hotelImageId and direction
2. **On undo:** DELETE `/api/swipes/:id` using stored last swipe ID
3. **On mount:** GET `/api/swipes/progress` to check if already complete
4. **On complete:** Redirect to `/matches` when `isComplete = true`

### State Management

```tsx
// Track last swipe ID for undo
const [lastSwipeId, setLastSwipeId] = useState<string | null>(null);

// On successful swipe
const { id } = await response.json();
setLastSwipeId(id);

// On undo
await fetch(`/api/swipes/${lastSwipeId}`, { method: 'DELETE' });
setLastSwipeId(null);
```

### Optimistic UI

- Swipe animation happens immediately
- API call happens in background
- On failure: show error toast, don't revert animation
- User can manually undo if needed

## Error Handling

| Scenario | Status | Response | Frontend Action |
|----------|--------|----------|-----------------|
| Not authenticated | 401 | `{ error: "Unauthorized" }` | Redirect to `/login` |
| Invalid hotelImageId | 400 | `{ error: "Invalid hotel image" }` | Toast error |
| Swipe exists | 200 | Updated record | No action (upsert) |
| Delete non-existent | 404 | `{ error: "Not found" }` | Silently ignore |
| Server error | 500 | `{ error: "Internal error" }` | Toast + retry |

## Files to Create/Modify

| File | Action |
|------|--------|
| `app/api/swipes/route.ts` | Create (POST, GET) |
| `app/api/swipes/[id]/route.ts` | Create (DELETE) |
| `app/(main)/onboarding/page.tsx` | Modify (API integration) |
| `components/onboarding/SwipeStack.tsx` | Modify (expose swipe IDs) |

## Success Criteria

- [ ] Swipes persist to database on each swipe action
- [ ] User can resume onboarding after leaving
- [ ] Undo removes the swipe from database
- [ ] Onboarding completes after 10 swipes with 3+ likes
- [ ] `user.onboardingComplete` set to true on completion
- [ ] Error states handled gracefully with user feedback
