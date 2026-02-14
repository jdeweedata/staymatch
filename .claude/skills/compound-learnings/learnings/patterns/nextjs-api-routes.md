# Next.js 15 API Route Handler Pattern

Safe, type-safe API route handlers for Next.js App Router.

## Basic Route Handler

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // 1. Auth check
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Safe JSON parsing
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // 3. Validation
    const { field } = body as { field?: unknown };
    if (!field || typeof field !== "string") {
      return NextResponse.json(
        { error: "Invalid field" },
        { status: 400 }
      );
    }

    // 4. Business logic
    const result = await db.model.create({
      data: { field, userId: user.id },
    });

    // 5. Success response
    return NextResponse.json({ id: result.id });

  } catch (error) {
    console.error("POST /api/route error:", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
```

## Dynamic Route Handler (Next.js 15)

```typescript
// app/api/items/[id]/route.ts

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // Promise in Next.js 15!
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;  // Must await params

    // Delete only if owned by user
    const deleted = await db.item.deleteMany({
      where: { id, userId: user.id },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("DELETE /api/items/[id] error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
```

## Type Guard Pattern

```typescript
const VALID_STATUSES = ["pending", "active", "completed"] as const;
type Status = (typeof VALID_STATUSES)[number];

function isValidStatus(value: unknown): value is Status {
  return typeof value === "string" &&
    VALID_STATUSES.includes(value as Status);
}

// Usage
if (!isValidStatus(body.status)) {
  return NextResponse.json({ error: "Invalid status" }, { status: 400 });
}
// body.status is now typed as Status
```

## Atomic Updates (Avoid Race Conditions)

```typescript
// BAD - race condition
const item = await db.item.findUnique({ where: { id } });
if (!item.isProcessed) {
  await db.item.update({
    where: { id },
    data: { isProcessed: true },
  });
}

// GOOD - atomic, first request wins
await db.item.updateMany({
  where: { id, isProcessed: false },
  data: { isProcessed: true },
});
```

## Upsert for Idempotency

```typescript
const item = await db.item.upsert({
  where: {
    userId_itemId: { userId: user.id, itemId },
  },
  update: { value: newValue },
  create: { userId: user.id, itemId, value: newValue },
});
```

## Response Conventions

```typescript
// Success responses
{ data: {...} }           // Single item
{ items: [...], count }   // List
{ success: true }         // Action confirmation
{ id, count, isComplete } // Create with metadata

// Error responses
{ error: "Unauthorized" }       // 401
{ error: "Invalid field" }      // 400
{ error: "Not found" }          // 404
{ error: "Internal error" }     // 500
```

## Key Points

1. **Always await params** in Next.js 15 dynamic routes
2. **Wrap request.json()** in try/catch
3. **Use deleteMany/updateMany** with WHERE for ownership checks
4. **Atomic updates** prevent race conditions
5. **Generic 500 errors** don't leak internal details
6. **Log errors server-side** for debugging
