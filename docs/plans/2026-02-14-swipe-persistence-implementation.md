# Swipe Persistence API Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Persist user swipes during onboarding to database, enabling resume and taste vector computation.

**Architecture:** REST API endpoints (POST/DELETE/GET) using Next.js App Router, Prisma ORM, JWT auth. Frontend calls API on each swipe with optimistic UI.

**Tech Stack:** Next.js 15, Prisma, PostgreSQL (Supabase), TypeScript, React 19

**Design Doc:** `docs/plans/2026-02-14-swipe-persistence-design.md`

---

## Task 1: Create POST /api/swipes Endpoint

**Files:**
- Create: `app/api/swipes/route.ts`

**Step 1: Create the swipes route file with POST handler**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { hotelImageId, direction } = body;

    // Validate direction
    if (!["LEFT", "RIGHT", "SUPER_LIKE"].includes(direction)) {
      return NextResponse.json({ error: "Invalid direction" }, { status: 400 });
    }

    // Validate hotelImageId exists
    if (!hotelImageId || typeof hotelImageId !== "string") {
      return NextResponse.json({ error: "Invalid hotel image" }, { status: 400 });
    }

    // Upsert swipe (create or update if exists)
    const swipe = await db.swipe.upsert({
      where: {
        userId_hotelImageId: {
          userId: user.id,
          hotelImageId,
        },
      },
      update: {
        direction,
      },
      create: {
        userId: user.id,
        hotelImageId,
        direction,
      },
    });

    // Get updated counts
    const counts = await db.swipe.groupBy({
      by: ["direction"],
      where: { userId: user.id },
      _count: true,
    });

    const liked = counts
      .filter((c) => c.direction === "RIGHT" || c.direction === "SUPER_LIKE")
      .reduce((sum, c) => sum + c._count, 0);
    const total = counts.reduce((sum, c) => sum + c._count, 0);

    // Check completion (10+ swipes, 3+ likes)
    const isComplete = total >= 10 && liked >= 3;

    // Update user if complete
    if (isComplete && !user.onboardingComplete) {
      await db.user.update({
        where: { id: user.id },
        data: { onboardingComplete: true },
      });
    }

    return NextResponse.json({
      id: swipe.id,
      count: total,
      isComplete,
    });
  } catch (error) {
    console.error("POST /api/swipes error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
```

**Step 2: Verify file compiles**

Run: `npm run type-check`
Expected: No errors

**Step 3: Commit**

```bash
git add app/api/swipes/route.ts
git commit -m "feat(api): add POST /api/swipes endpoint"
```

---

## Task 2: Add GET /api/swipes/progress Endpoint

**Files:**
- Modify: `app/api/swipes/route.ts`

**Step 1: Add GET handler to existing route file**

Add this function to `app/api/swipes/route.ts`:

```typescript
export async function GET() {
  try {
    // Get authenticated user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get swipe counts by direction
    const counts = await db.swipe.groupBy({
      by: ["direction"],
      where: { userId: user.id },
      _count: true,
    });

    const liked = counts
      .filter((c) => c.direction === "RIGHT" || c.direction === "SUPER_LIKE")
      .reduce((sum, c) => sum + c._count, 0);
    const disliked = counts
      .filter((c) => c.direction === "LEFT")
      .reduce((sum, c) => sum + c._count, 0);
    const total = liked + disliked;

    const isComplete = total >= 10 && liked >= 3;

    return NextResponse.json({
      count: total,
      liked,
      disliked,
      isComplete,
    });
  } catch (error) {
    console.error("GET /api/swipes error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
```

**Step 2: Verify file compiles**

Run: `npm run type-check`
Expected: No errors

**Step 3: Commit**

```bash
git add app/api/swipes/route.ts
git commit -m "feat(api): add GET /api/swipes progress endpoint"
```

---

## Task 3: Create DELETE /api/swipes/[id] Endpoint

**Files:**
- Create: `app/api/swipes/[id]/route.ts`

**Step 1: Create the dynamic route file**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get authenticated user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Delete swipe (only if owned by user)
    const deleted = await db.swipe.deleteMany({
      where: {
        id,
        userId: user.id,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Get updated count
    const count = await db.swipe.count({
      where: { userId: user.id },
    });

    return NextResponse.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("DELETE /api/swipes/[id] error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
```

**Step 2: Verify file compiles**

Run: `npm run type-check`
Expected: No errors

**Step 3: Commit**

```bash
git add app/api/swipes/[id]/route.ts
git commit -m "feat(api): add DELETE /api/swipes/[id] endpoint"
```

---

## Task 4: Create Swipe API Client Hook

**Files:**
- Create: `lib/hooks/useSwipes.ts`
- Modify: `lib/hooks/index.ts`

**Step 1: Create the useSwipes hook**

```typescript
import { useState, useCallback } from "react";

interface SwipeResponse {
  id: string;
  count: number;
  isComplete: boolean;
}

interface ProgressResponse {
  count: number;
  liked: number;
  disliked: number;
  isComplete: boolean;
}

interface UseSwipesReturn {
  lastSwipeId: string | null;
  isLoading: boolean;
  error: string | null;
  swipe: (hotelImageId: string, direction: "LEFT" | "RIGHT" | "SUPER_LIKE") => Promise<SwipeResponse | null>;
  undo: () => Promise<boolean>;
  getProgress: () => Promise<ProgressResponse | null>;
}

export function useSwipes(): UseSwipesReturn {
  const [lastSwipeId, setLastSwipeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const swipe = useCallback(async (
    hotelImageId: string,
    direction: "LEFT" | "RIGHT" | "SUPER_LIKE"
  ): Promise<SwipeResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/swipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotelImageId, direction }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save swipe");
      }

      const data: SwipeResponse = await res.json();
      setLastSwipeId(data.id);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save swipe";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const undo = useCallback(async (): Promise<boolean> => {
    if (!lastSwipeId) return false;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/swipes/${lastSwipeId}`, {
        method: "DELETE",
      });

      if (!res.ok && res.status !== 404) {
        const data = await res.json();
        throw new Error(data.error || "Failed to undo");
      }

      setLastSwipeId(null);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to undo";
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [lastSwipeId]);

  const getProgress = useCallback(async (): Promise<ProgressResponse | null> => {
    try {
      const res = await fetch("/api/swipes");

      if (!res.ok) {
        return null;
      }

      return res.json();
    } catch {
      return null;
    }
  }, []);

  return {
    lastSwipeId,
    isLoading,
    error,
    swipe,
    undo,
    getProgress,
  };
}
```

**Step 2: Export from index**

Add to `lib/hooks/index.ts`:

```typescript
export { useSwipes } from "./useSwipes";
```

**Step 3: Verify file compiles**

Run: `npm run type-check`
Expected: No errors

**Step 4: Commit**

```bash
git add lib/hooks/useSwipes.ts lib/hooks/index.ts
git commit -m "feat(hooks): add useSwipes hook for API integration"
```

---

## Task 5: Integrate API into OnboardingPage

**Files:**
- Modify: `app/(main)/onboarding/page.tsx`

**Step 1: Add useSwipes hook and update handlers**

At the top of the file, add import:

```typescript
import { useSwipes } from "@/lib/hooks";
```

Inside the component, add the hook:

```typescript
const { swipe, undo, getProgress, error } = useSwipes();
```

**Step 2: Update handleSwipeRight**

Replace the existing `handleSwipeRight`:

```typescript
const handleSwipeRight = useCallback(async (item: SwipeItem) => {
  const result = await swipe(item.id, "RIGHT");
  if (result?.isComplete) {
    setIsComplete(true);
    setTimeout(() => router.push("/matches"), 2000);
  }
}, [swipe, router]);
```

**Step 3: Update handleSwipeLeft**

Replace the existing `handleSwipeLeft`:

```typescript
const handleSwipeLeft = useCallback(async (item: SwipeItem) => {
  await swipe(item.id, "LEFT");
}, [swipe]);
```

**Step 4: Add progress check on mount**

Add useEffect after existing hooks:

```typescript
useEffect(() => {
  const checkProgress = async () => {
    const progress = await getProgress();
    if (progress?.isComplete) {
      router.push("/matches");
    }
  };
  checkProgress();
}, [getProgress, router]);
```

**Step 5: Add error toast display**

Add after the loading overlay, before closing `</main>`:

```typescript
{error && (
  <div className="fixed bottom-4 left-4 right-4 bg-accent-error text-white px-4 py-3 rounded-lg text-sm z-50">
    {error}
  </div>
)}
```

**Step 6: Verify file compiles**

Run: `npm run type-check`
Expected: No errors

**Step 7: Commit**

```bash
git add app/(main)/onboarding/page.tsx
git commit -m "feat(onboarding): integrate swipe persistence API"
```

---

## Task 6: Update SwipeStack for Undo Integration

**Files:**
- Modify: `components/onboarding/SwipeStack.tsx`

**Step 1: Add onUndo callback prop**

Update the interface:

```typescript
export interface SwipeStackProps {
  items: SwipeItem[];
  onSwipeRight?: (item: SwipeItem) => void;
  onSwipeLeft?: (item: SwipeItem) => void;
  onTap?: (item: SwipeItem) => void;
  onUndo?: () => void;  // Add this
  onComplete?: (results: { liked: SwipeItem[]; disliked: SwipeItem[] }) => void;
  visibleCards?: number;
  className?: string;
}
```

**Step 2: Update component to use onUndo**

Update the undo button onClick handler (around line 240):

```typescript
onClick={() => {
  if (currentIndex > 0) {
    // Call onUndo callback first
    onUndo?.();

    setCurrentIndex(currentIndex - 1);
    const lastItem = items[currentIndex - 1];
    setLiked((prev) => prev.filter((i) => i.id !== lastItem.id));
    setDisliked((prev) => prev.filter((i) => i.id !== lastItem.id));
  }
}}
```

**Step 3: Verify file compiles**

Run: `npm run type-check`
Expected: No errors

**Step 4: Commit**

```bash
git add components/onboarding/SwipeStack.tsx
git commit -m "feat(swipe-stack): add onUndo callback prop"
```

---

## Task 7: Wire Up Undo in OnboardingPage

**Files:**
- Modify: `app/(main)/onboarding/page.tsx`

**Step 1: Add undo handler**

Add after handleSwipeLeft:

```typescript
const handleUndo = useCallback(async () => {
  await undo();
}, [undo]);
```

**Step 2: Pass onUndo to SwipeStack**

Update the SwipeStack component:

```typescript
<SwipeStack
  items={SAMPLE_HOTELS}
  onSwipeRight={handleSwipeRight}
  onSwipeLeft={handleSwipeLeft}
  onTap={handleTap}
  onUndo={handleUndo}
  onComplete={handleComplete}
  visibleCards={3}
/>
```

**Step 3: Verify file compiles**

Run: `npm run type-check`
Expected: No errors

**Step 4: Commit**

```bash
git add app/(main)/onboarding/page.tsx
git commit -m "feat(onboarding): wire up undo to API"
```

---

## Task 8: Build and Manual Test

**Step 1: Run full type check**

Run: `npm run type-check`
Expected: No errors

**Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Manual test checklist**

- [ ] Navigate to `/onboarding`
- [ ] Swipe right on a hotel
- [ ] Check Network tab: POST /api/swipes returns 200
- [ ] Swipe left on a hotel
- [ ] Click undo button
- [ ] Check Network tab: DELETE /api/swipes/[id] returns 200
- [ ] Complete 10 swipes with 3+ likes
- [ ] Verify redirect to `/matches`
- [ ] Return to `/onboarding`
- [ ] Verify redirect (already complete)

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete swipe persistence API integration

- POST /api/swipes persists swipes in real-time
- GET /api/swipes returns progress
- DELETE /api/swipes/[id] enables undo
- 10 swipes + 3 likes triggers completion
- OnboardingPage integrates via useSwipes hook

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Summary

| Task | Description | Est. Time |
|------|-------------|-----------|
| 1 | POST /api/swipes | 15 min |
| 2 | GET /api/swipes | 10 min |
| 3 | DELETE /api/swipes/[id] | 10 min |
| 4 | useSwipes hook | 15 min |
| 5 | OnboardingPage integration | 20 min |
| 6 | SwipeStack onUndo prop | 10 min |
| 7 | Wire up undo | 5 min |
| 8 | Build and test | 15 min |
| **Total** | | **~2 hours** |
