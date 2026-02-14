# OpenAI Embeddings Pattern

Lazy-initialized OpenAI client with pgvector storage for Next.js/Prisma apps.

## Client Initialization

```typescript
import OpenAI from "openai";

const EMBEDDING_MODEL = "text-embedding-3-small";

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

**Why lazy init**: Prevents errors at import time when API key might not be set.

## Generate Embedding

```typescript
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!text || !text.trim()) {
    throw new Error("[embeddings] Cannot generate embedding for empty text");
  }

  try {
    const openai = getOpenAIClient();
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text.trim(),
    });
    return response.data[0].embedding;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`[embeddings] Failed to generate embedding: ${message}`);
  }
}
```

## Store in pgvector (Prisma)

```typescript
export async function storeEmbedding(
  id: string,
  embedding: number[]
): Promise<void> {
  const vectorStr = `[${embedding.join(",")}]`;

  // NOTE: Using $executeRawUnsafe because Prisma's tagged template
  // doesn't support pgvector's ::vector type casting. Parameters are
  // passed separately ($1, $2) preventing SQL injection.
  await db.$executeRawUnsafe(
    `UPDATE "TableName" SET embedding = $1::vector WHERE id = $2`,
    vectorStr,
    id
  );
}
```

## Aggregate Embeddings (AVG)

```typescript
// Average multiple embeddings into one
await db.$executeRawUnsafe(
  `UPDATE "User"
   SET "tasteVector" = (
     SELECT AVG(item.embedding)
     FROM "Item" item
     WHERE item."userId" = $1
       AND item.embedding IS NOT NULL
   )
   WHERE id = $1`,
  userId
);
```

## Batch Processing

```typescript
export async function embedMissing(batchSize = 50) {
  const items = await db.$queryRaw<Array<{ id: string; text: string }>>`
    SELECT id, text FROM "Item" WHERE embedding IS NULL LIMIT ${batchSize}
  `;

  let processed = 0, failed = 0;

  for (const item of items) {
    try {
      const embedding = await generateEmbedding(item.text);
      await storeEmbedding(item.id, embedding);
      processed++;
    } catch (error) {
      console.error(`Failed to embed ${item.id}:`, error);
      failed++;
    }
  }

  return { processed, failed };
}
```

## Key Points

1. **Always validate input** - Empty strings cause API errors
2. **Use $executeRawUnsafe** for pgvector - Tagged templates don't support ::vector
3. **Add safety comments** - Explain why raw SQL is safe
4. **Catch errors with context** - Wrap API errors with descriptive messages
5. **Batch with resilience** - Continue processing even if some fail
