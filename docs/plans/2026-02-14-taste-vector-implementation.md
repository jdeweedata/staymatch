# Taste Vector Generation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Compute user taste vectors from liked hotel embeddings to enable personalized matching.

**Architecture:** OpenAI generates hotel embeddings (text-embedding-3-small). On onboarding complete, average liked hotel embeddings to create user taste vector. Store in pgvector columns.

**Tech Stack:** OpenAI SDK, Prisma raw SQL, pgvector, TypeScript

**Design Doc:** `docs/plans/2026-02-14-taste-vector-design.md`

---

## Task 1: Install OpenAI SDK

**Files:**
- Modify: `package.json`

**Step 1: Install OpenAI SDK**

Run: `npm install openai`

**Step 2: Verify installation**

Run: `npm list openai`
Expected: `openai@4.x.x`

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add openai sdk dependency"
```

---

## Task 2: Create Embeddings Service

**Files:**
- Create: `lib/services/embeddings.ts`

**Step 1: Create the embeddings service**

```typescript
import OpenAI from "openai";
import db from "@/lib/db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Build text content for embedding a hotel
 */
export function buildEmbeddingText(hotel: {
  name: string;
  description: string | null;
  amenities: string[];
}): string {
  const parts = [hotel.name];

  if (hotel.description) {
    parts.push(hotel.description);
  }

  if (hotel.amenities.length > 0) {
    parts.push(`Amenities: ${hotel.amenities.join(", ")}`);
  }

  return parts.join(". ");
}

/**
 * Generate embedding for text using OpenAI
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
}

/**
 * Embed a single hotel and store in database
 */
export async function embedHotel(hotel: {
  id: string;
  name: string;
  description: string | null;
  amenities: string[];
}): Promise<void> {
  const text = buildEmbeddingText(hotel);
  const embedding = await generateEmbedding(text);
  const vectorStr = `[${embedding.join(",")}]`;

  await db.$executeRawUnsafe(
    `UPDATE "HotelCache" SET embedding = $1::vector WHERE id = $2`,
    vectorStr,
    hotel.id
  );
}

/**
 * Compute user taste vector from liked hotel embeddings
 */
export async function computeTasteVector(userId: string): Promise<boolean> {
  try {
    // Check if user has any liked hotels with embeddings
    const result = await db.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count
      FROM "Swipe" s
      JOIN "HotelImage" hi ON s."hotelImageId" = hi.id
      JOIN "HotelCache" hc ON hi."hotelId" = hc.id
      WHERE s."userId" = ${userId}
        AND s.direction IN ('RIGHT', 'SUPER_LIKE')
        AND hc.embedding IS NOT NULL
    `;

    if (result[0].count === 0n) {
      console.warn(`[embeddings] No liked hotels with embeddings for user ${userId}`);
      return false;
    }

    // Compute average embedding and store as taste vector
    await db.$executeRaw`
      UPDATE "User"
      SET "tasteVector" = (
        SELECT AVG(hc.embedding)
        FROM "Swipe" s
        JOIN "HotelImage" hi ON s."hotelImageId" = hi.id
        JOIN "HotelCache" hc ON hi."hotelId" = hc.id
        WHERE s."userId" = ${userId}
          AND s.direction IN ('RIGHT', 'SUPER_LIKE')
          AND hc.embedding IS NOT NULL
      )
      WHERE id = ${userId}
    `;

    console.log(`[embeddings] Computed taste vector for user ${userId}`);
    return true;
  } catch (error) {
    console.error(`[embeddings] Failed to compute taste vector for user ${userId}:`, error);
    return false;
  }
}

/**
 * Batch embed hotels without embeddings
 */
export async function embedMissingHotels(
  batchSize = 50
): Promise<{ processed: number; failed: number }> {
  const hotels = await db.$queryRaw<
    Array<{
      id: string;
      name: string;
      description: string | null;
      amenities: string[];
    }>
  >`
    SELECT id, name, description, amenities
    FROM "HotelCache"
    WHERE embedding IS NULL
    LIMIT ${batchSize}
  `;

  let processed = 0;
  let failed = 0;

  for (const hotel of hotels) {
    try {
      await embedHotel(hotel);
      processed++;
      console.log(`[embeddings] Embedded hotel ${hotel.id}: ${hotel.name}`);
    } catch (error) {
      console.error(`[embeddings] Failed to embed hotel ${hotel.id}:`, error);
      failed++;
    }
  }

  return { processed, failed };
}
```

**Step 2: Verify file compiles**

Run: `npm run type-check`
Expected: No errors

**Step 3: Commit**

```bash
git add lib/services/embeddings.ts
git commit -m "feat(embeddings): add embedding service with OpenAI integration"
```

---

## Task 3: Create Hotel Embedding Script

**Files:**
- Create: `scripts/embed-hotels.ts`

**Step 1: Create the batch embedding script**

```typescript
/**
 * Batch embed hotels without embeddings
 *
 * Usage: npx tsx scripts/embed-hotels.ts [--batch-size=50] [--max-batches=10]
 */

import { embedMissingHotels } from "../lib/services/embeddings";

async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  let batchSize = 50;
  let maxBatches = 10;

  for (const arg of args) {
    if (arg.startsWith("--batch-size=")) {
      batchSize = parseInt(arg.split("=")[1], 10);
    }
    if (arg.startsWith("--max-batches=")) {
      maxBatches = parseInt(arg.split("=")[1], 10);
    }
  }

  console.log(`[embed-hotels] Starting with batchSize=${batchSize}, maxBatches=${maxBatches}`);

  let totalProcessed = 0;
  let totalFailed = 0;
  let batchNum = 0;

  while (batchNum < maxBatches) {
    batchNum++;
    console.log(`\n[embed-hotels] Processing batch ${batchNum}/${maxBatches}...`);

    const { processed, failed } = await embedMissingHotels(batchSize);
    totalProcessed += processed;
    totalFailed += failed;

    console.log(`[embed-hotels] Batch ${batchNum}: ${processed} processed, ${failed} failed`);

    // Stop if no more hotels to process
    if (processed === 0) {
      console.log("[embed-hotels] No more hotels to process");
      break;
    }

    // Rate limit: wait 1 second between batches
    if (batchNum < maxBatches) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log(`\n[embed-hotels] Complete!`);
  console.log(`[embed-hotels] Total: ${totalProcessed} processed, ${totalFailed} failed`);
}

main().catch((error) => {
  console.error("[embed-hotels] Fatal error:", error);
  process.exit(1);
});
```

**Step 2: Add script command to package.json**

Add to `scripts` in `package.json`:

```json
"embed-hotels": "tsx scripts/embed-hotels.ts"
```

**Step 3: Install tsx if not present**

Run: `npm install -D tsx`

**Step 4: Verify script syntax**

Run: `npm run type-check`
Expected: No errors

**Step 5: Commit**

```bash
git add scripts/embed-hotels.ts package.json package-lock.json
git commit -m "feat(scripts): add hotel embedding batch script"
```

---

## Task 4: Integrate with Swipes API

**Files:**
- Modify: `app/api/swipes/route.ts`

**Step 1: Add import**

At top of file, add:

```typescript
import { computeTasteVector } from "@/lib/services/embeddings";
```

**Step 2: Call computeTasteVector on completion**

Find the `if (isComplete)` block and add the taste vector computation:

```typescript
if (isComplete) {
  // Update onboarding status (existing code)
  await db.user.updateMany({
    where: {
      id: user.id,
      onboardingComplete: false,
    },
    data: { onboardingComplete: true },
  });

  // Compute taste vector (non-blocking)
  computeTasteVector(user.id).catch((error) => {
    console.error("[swipes] Taste vector computation failed:", error);
  });
}
```

**Step 3: Verify file compiles**

Run: `npm run type-check`
Expected: No errors

**Step 4: Commit**

```bash
git add app/api/swipes/route.ts
git commit -m "feat(swipes): compute taste vector on onboarding complete"
```

---

## Task 5: Build and Verify

**Step 1: Run type check**

Run: `npm run type-check`
Expected: No errors

**Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Manual verification checklist**

To test the embedding script (requires hotels in database):
```bash
npm run embed-hotels -- --batch-size=5 --max-batches=1
```

Expected output:
```
[embed-hotels] Starting with batchSize=5, maxBatches=1
[embed-hotels] Processing batch 1/1...
[embeddings] Embedded hotel xxx: Hotel Name
...
[embed-hotels] Complete!
```

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete taste vector generation system

- OpenAI embeddings service for hotels
- Batch embedding script (npm run embed-hotels)
- Taste vector computed on onboarding complete
- Graceful degradation if embeddings missing

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Summary

| Task | Description | Est. Time |
|------|-------------|-----------|
| 1 | Install OpenAI SDK | 2 min |
| 2 | Create embeddings service | 15 min |
| 3 | Create batch embedding script | 10 min |
| 4 | Integrate with swipes API | 5 min |
| 5 | Build and verify | 10 min |
| **Total** | | **~45 min** |

## Future Enhancements (Not In Scope)

- [ ] Cron job for continuous hotel embedding
- [ ] Re-embed hotels when description changes
- [ ] Weighted averaging (SUPER_LIKE = 2x)
- [ ] Incremental taste vector updates after booking
