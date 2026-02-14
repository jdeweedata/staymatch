# Session: Taste Vector Implementation

**Date**: 2026-02-14
**Duration**: ~1 hour (context resumed)
**Workflow**: Subagent-Driven Development with Two-Stage Review

## What Was Built

Complete taste vector generation system for StayMatch:

- `lib/services/embeddings.ts` - Core embeddings service
  - `buildEmbeddingText()` - Hotel text for embedding
  - `generateEmbedding()` - OpenAI API call
  - `embedHotel()` - Store embedding in pgvector
  - `computeTasteVector()` - Average liked hotel embeddings
  - `embedMissingHotels()` - Batch processing

- `scripts/embed-hotels.ts` - CLI for batch embedding
- `app/api/swipes/route.ts` - Integration on onboarding complete

## Patterns Extracted

### 1. Lazy OpenAI Client Initialization

```typescript
let _openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!_openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("[embeddings] OPENAI_API_KEY required");
    }
    _openai = new OpenAI({ apiKey });
  }
  return _openai;
}
```

**Why**: Prevents cryptic runtime errors at import time. Clear error message when API key missing.

### 2. pgvector Raw SQL with Prisma

```typescript
// NOTE: Using $executeRawUnsafe because Prisma's tagged template
// doesn't support pgvector's ::vector type casting. Parameters are
// passed separately ($1, $2) preventing SQL injection - this is safe.
await db.$executeRawUnsafe(
  `UPDATE "HotelCache" SET embedding = $1::vector WHERE id = $2`,
  vectorStr,
  hotelId
);
```

**Why**: Prisma's `$executeRaw` doesn't support `::vector` casting or `AVG()` on vector columns.

### 3. Non-blocking Background Computation

```typescript
// Fire-and-forget with error logging
computeTasteVector(user.id).catch((error) => {
  console.error("[swipes] Taste vector computation failed:", error);
});
```

**Why**: Expensive operations shouldn't block HTTP response. Errors logged but don't affect user.

### 4. Input Validation in Embeddings

```typescript
if (!text || !text.trim()) {
  throw new Error("[embeddings] Cannot generate embedding for empty text");
}
```

**Why**: OpenAI API will fail on empty strings. Validate early with clear error.

## Code Quality Issues Found & Fixed

| Issue | Review Finding | Fix Applied |
|-------|---------------|-------------|
| Unused constant | `EMBEDDING_DIMENSIONS` never used | Removed |
| No error handling | `generateEmbedding()` missing try/catch | Added with context |
| API key at import | OpenAI client created before key validated | Lazy initialization |
| Missing validation | Empty text not checked | Added input validation |
| Raw SQL unexplained | `$executeRawUnsafe` flagged as risk | Added safety comment |

## Key Decisions

- **OpenAI text-embedding-3-small** - 1536 dimensions, fast, affordable
- **Average embedding** for taste vector - Simple, effective for MVP
- **Non-blocking** taste computation - Don't slow down swipe response
- **Graceful degradation** - NULL tasteVector = no personalization (not error)

## Commits

```
7125d5f feat: add taste vector generation system
```

## Follow-up Tasks

- [ ] Run `npm run embed-hotels` when hotels in database
- [ ] Implement match generation API using taste vectors
- [ ] Add weighted averaging (SUPER_LIKE = 2x weight)
