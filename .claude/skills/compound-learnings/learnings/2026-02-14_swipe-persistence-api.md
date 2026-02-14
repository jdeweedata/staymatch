# Session: Swipe Persistence API Implementation

**Date**: 2026-02-14
**Duration**: ~2 hours
**Workflow**: Brainstorming → Design → Subagent-Driven Development

## What Was Built

Complete swipe persistence system for StayMatch onboarding:

- `POST /api/swipes` - Persist swipe with upsert
- `GET /api/swipes` - Get progress (count, liked, disliked, isComplete)
- `DELETE /api/swipes/[id]` - Undo functionality
- `useSwipes` hook - React integration
- OnboardingPage integration with error handling

## Workflow Used

1. **Brainstorming Skill** - Asked 3 clarifying questions:
   - Min swipes for completion? → 10
   - Real-time vs batched? → Real-time
   - Undo behavior? → Delete from DB

2. **Design Doc** - Sections approved incrementally:
   - API endpoints
   - Database operations
   - Frontend integration
   - Error handling

3. **Implementation Plan** - 8 bite-sized tasks with TDD steps

4. **Subagent-Driven Execution**:
   - Fresh subagent per task
   - Two-stage review: spec compliance → code quality
   - Fix loops until approved

## Patterns Extracted

### 1. Atomic Database Updates

Avoid race conditions by using WHERE clause instead of fetch-check-update:

```typescript
// BAD - race condition possible
if (!user.onboardingComplete) {
  await db.user.update({...});
}

// GOOD - atomic, only first request wins
await db.user.updateMany({
  where: { id: user.id, onboardingComplete: false },
  data: { onboardingComplete: true },
});
```

### 2. Safe JSON Parsing

Always wrap request.json() in try/catch:

```typescript
let body: unknown;
try {
  body = await request.json();
} catch {
  return NextResponse.json(
    { error: "Invalid JSON in request body" },
    { status: 400 }
  );
}
```

### 3. Next.js 15 Dynamic Route Params

In Next.js 15, params is a Promise:

```typescript
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Must await!
}
```

### 4. Prisma Upsert for Idempotency

Handle create-or-update in single operation:

```typescript
const swipe = await db.swipe.upsert({
  where: {
    userId_hotelImageId: { userId, hotelImageId }
  },
  update: { direction },
  create: { userId, hotelImageId, direction },
});
```

### 5. Type Guard for Validation

Use type guard functions for safe narrowing:

```typescript
function isValidDirection(value: unknown): value is SwipeDirection {
  return typeof value === "string" &&
    ["LEFT", "RIGHT", "SUPER_LIKE"].includes(value);
}
```

## Code Quality Issues Found & Fixed

| Issue | Code Quality Review Finding | Fix Applied |
|-------|----------------------------|-------------|
| Unsafe JSON parsing | request.json() can throw | try/catch wrapper |
| Race condition | fetch-check-update pattern | Atomic updateMany |
| User data staleness | Checking stale user state | Atomic update handles it |

## Key Decisions

- **10 swipes minimum** - Quick onboarding (~2 min)
- **3 likes required** - Ensures meaningful preference signal
- **Real-time persistence** - Resume if user leaves
- **Upsert on conflict** - Changing swipe direction is allowed
- **Optimistic UI** - Swipe animation happens before API confirms

## Time Breakdown

| Phase | Time |
|-------|------|
| Brainstorming | 10 min |
| Design doc | 15 min |
| Implementation plan | 10 min |
| Task 1-3 (API endpoints) | 45 min |
| Task 4 (useSwipes hook) | 15 min |
| Task 5-7 (integration) | 20 min |
| Task 8 (build/verify) | 5 min |
| **Total** | ~2 hours |

## Commits

```
91c3112 feat(api): add POST /api/swipes endpoint
9643b4d feat(api): add GET /api/swipes progress endpoint
fb951be feat(api): add DELETE /api/swipes/[id] endpoint
46c4838 feat(hooks): add useSwipes hook for API integration
80e9a7b feat(onboarding): integrate swipe persistence API
edf84ae feat(swipe): add undo API integration
```

## Follow-up Tasks

- [ ] Add taste vector computation after 10+ swipes
- [ ] Implement match generation API using vectors
- [ ] Add booking API integration with LiteAPI
