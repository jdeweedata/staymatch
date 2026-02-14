# Taste Vector Generation Design

**Date:** 2026-02-14
**Status:** Approved
**Effort:** S-M (3-5 days)

## Overview

Compute user taste vectors from onboarding swipes to enable personalized hotel matching. Uses OpenAI embeddings and pgvector for similarity search.

## Requirements

| Requirement | Decision |
|-------------|----------|
| Trigger | On onboarding complete (10 swipes, 3+ likes) |
| Hotel embeddings | Pre-computed via background job |
| Embed content | Hotel description + amenities |
| Algorithm | Simple average of liked hotel embeddings |
| Model | OpenAI text-embedding-3-small (1536 dimensions) |
| Error handling | Graceful degradation (NULL vector = no personalization) |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      EMBEDDING PIPELINE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Background Job]                                                │
│       │                                                          │
│       ▼                                                          │
│  HotelCache ──► OpenAI API ──► HotelCache.embedding              │
│  (description    (text-         (vector 1536)                    │
│   + amenities)   embedding-                                      │
│                  3-small)                                        │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [On Onboarding Complete]                                        │
│       │                                                          │
│       ▼                                                          │
│  Liked Swipes ──► Hotel Embeddings ──► AVG() ──► User.tasteVector│
│  (RIGHT +         (from HotelCache)    (pgvector)                │
│   SUPER_LIKE)                                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Hotel Embedding Service

### embedHotel()

Generate embedding for a single hotel.

```typescript
import OpenAI from "openai";

const openai = new OpenAI();

export async function embedHotel(hotel: {
  name: string;
  description: string | null;
  amenities: string[];
}): Promise<number[]> {
  const text = buildEmbeddingText(hotel);

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
}

function buildEmbeddingText(hotel: {
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
```

### storeHotelEmbedding()

Store embedding in database using raw SQL (Prisma doesn't support pgvector).

```typescript
export async function storeHotelEmbedding(
  hotelId: string,
  embedding: number[]
): Promise<void> {
  const vectorStr = `[${embedding.join(",")}]`;

  await db.$executeRaw`
    UPDATE "HotelCache"
    SET embedding = ${vectorStr}::vector
    WHERE id = ${hotelId}
  `;
}
```

### embedMissingHotels()

Batch process hotels without embeddings.

```typescript
export async function embedMissingHotels(
  batchSize = 100
): Promise<{ processed: number; failed: number }> {
  const hotels = await db.$queryRaw<Array<{
    id: string;
    name: string;
    description: string | null;
    amenities: string[];
  }>>`
    SELECT id, name, description, amenities
    FROM "HotelCache"
    WHERE embedding IS NULL
    LIMIT ${batchSize}
  `;

  let processed = 0;
  let failed = 0;

  for (const hotel of hotels) {
    try {
      const embedding = await embedHotel(hotel);
      await storeHotelEmbedding(hotel.id, embedding);
      processed++;
    } catch (error) {
      console.error(`Failed to embed hotel ${hotel.id}:`, error);
      failed++;
    }
  }

  return { processed, failed };
}
```

## Taste Vector Computation

### computeTasteVector()

Average liked hotel embeddings to create user taste vector.

```typescript
export async function computeTasteVector(userId: string): Promise<boolean> {
  try {
    // Check if user has any liked hotels with embeddings
    const likedCount = await db.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count
      FROM "Swipe" s
      JOIN "HotelImage" hi ON s."hotelImageId" = hi.id
      JOIN "HotelCache" hc ON hi."hotelId" = hc.id
      WHERE s."userId" = ${userId}
        AND s.direction IN ('RIGHT', 'SUPER_LIKE')
        AND hc.embedding IS NOT NULL
    `;

    if (likedCount[0].count === 0n) {
      console.warn(`No liked hotels with embeddings for user ${userId}`);
      return false;
    }

    // Compute average embedding and store
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

    return true;
  } catch (error) {
    console.error(`Failed to compute taste vector for user ${userId}:`, error);
    return false;
  }
}
```

## API Integration

### POST /api/swipes modification

Add taste vector computation when onboarding completes:

```typescript
if (isComplete) {
  // Update onboarding status (existing)
  await db.user.updateMany({
    where: { id: user.id, onboardingComplete: false },
    data: { onboardingComplete: true },
  });

  // Compute taste vector (new)
  computeTasteVector(user.id).catch((error) => {
    console.error("Taste vector computation failed:", error);
    // Don't block - graceful degradation
  });
}
```

Note: `computeTasteVector` is called without await to avoid blocking the response. Errors are logged but don't affect the user experience.

## Error Handling

| Scenario | Handling |
|----------|----------|
| No liked hotels have embeddings | Log warning, return false, user has NULL tasteVector |
| OpenAI API rate limit | Retry with exponential backoff in batch job |
| OpenAI API error | Skip hotel, log error, continue with next |
| pgvector query fails | Log error, return false, graceful degradation |
| Taste vector computation fails | Log error, don't block swipe completion |

### Graceful Degradation

When `User.tasteVector` is NULL:
- Match API returns hotels sorted by popularity/rating instead
- User can still browse and book manually
- Vector is computed on next matching attempt if possible

## Files to Create/Modify

| File | Action |
|------|--------|
| `lib/services/embeddings.ts` | Create - embedding functions |
| `app/api/swipes/route.ts` | Modify - call computeTasteVector |
| `scripts/embed-hotels.ts` | Create - batch embedding script |

## Dependencies

```bash
npm install openai
```

Environment variable required:
```
OPENAI_API_KEY=sk-...
```

Already configured in `.env`.

## Success Criteria

- [ ] Hotels can be embedded via batch script
- [ ] Taste vector computed on onboarding complete
- [ ] NULL handling works (graceful degradation)
- [ ] Errors logged but don't block user flow
- [ ] pgvector AVG() works correctly on embeddings
