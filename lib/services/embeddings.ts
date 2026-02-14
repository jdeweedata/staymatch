import OpenAI from "openai";
import { prisma as db } from "@/lib/db";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Embedding model configuration
const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 1536;

/**
 * Build text content for embedding from hotel data.
 * Combines name, description, and amenities into a single string.
 */
export function buildEmbeddingText(hotel: {
  name: string;
  description: string | null;
  amenities: string[];
}): string {
  const parts: string[] = [];

  // Add hotel name
  parts.push(hotel.name);

  // Add description if available
  if (hotel.description && hotel.description.trim()) {
    parts.push(hotel.description.trim());
  }

  // Add amenities as comma-separated list
  if (hotel.amenities && hotel.amenities.length > 0) {
    parts.push(`Amenities: ${hotel.amenities.join(", ")}`);
  }

  return parts.join(". ");
}

/**
 * Generate embedding vector from text using OpenAI API.
 * Returns array of 1536 floats for text-embedding-3-small model.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  console.log(`[embeddings] Generating embedding for text (${text.length} chars)`);

  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });

  const embedding = response.data[0].embedding;
  console.log(`[embeddings] Generated embedding with ${embedding.length} dimensions`);

  return embedding;
}

/**
 * Embed a hotel and store the vector in the database.
 * Uses raw SQL to handle pgvector type.
 */
export async function embedHotel(hotel: {
  id: string;
  name: string;
  description: string | null;
  amenities: string[];
}): Promise<void> {
  console.log(`[embeddings] Embedding hotel: ${hotel.id} (${hotel.name})`);

  // Build text and generate embedding
  const text = buildEmbeddingText(hotel);
  const embedding = await generateEmbedding(text);

  // Format embedding as pgvector string: [0.1,0.2,0.3,...]
  const vectorString = `[${embedding.join(",")}]`;

  // Update hotel with embedding using raw SQL
  await db.$executeRawUnsafe(
    `UPDATE "HotelCache" SET embedding = $1::vector WHERE id = $2`,
    vectorString,
    hotel.id
  );

  console.log(`[embeddings] Stored embedding for hotel: ${hotel.id}`);
}

/**
 * Compute user taste vector by averaging embeddings of liked hotels.
 * Returns true if taste vector was computed, false if no valid liked hotels.
 */
export async function computeTasteVector(userId: string): Promise<boolean> {
  console.log(`[embeddings] Computing taste vector for user: ${userId}`);

  // Check if user has liked hotels with embeddings
  const likedCount = await db.$queryRaw<[{ count: bigint }]>`
    SELECT COUNT(*) as count
    FROM "Swipe" s
    JOIN "HotelImage" hi ON s."hotelImageId" = hi.id
    JOIN "HotelCache" hc ON hi."hotelId" = hc.id
    WHERE s."userId" = ${userId}
      AND s.direction IN ('RIGHT', 'SUPER_LIKE')
      AND hc.embedding IS NOT NULL
  `;

  const count = Number(likedCount[0].count);
  console.log(`[embeddings] Found ${count} liked hotels with embeddings for user: ${userId}`);

  if (count === 0) {
    console.log(`[embeddings] No liked hotels with embeddings found for user: ${userId}`);
    return false;
  }

  try {
    // Compute average embedding and update user taste vector
    await db.$executeRawUnsafe(
      `UPDATE "User"
       SET "tasteVector" = (
         SELECT AVG(hc.embedding)
         FROM "Swipe" s
         JOIN "HotelImage" hi ON s."hotelImageId" = hi.id
         JOIN "HotelCache" hc ON hi."hotelId" = hc.id
         WHERE s."userId" = $1
           AND s.direction IN ('RIGHT', 'SUPER_LIKE')
           AND hc.embedding IS NOT NULL
       )
       WHERE id = $1`,
      userId
    );

    console.log(`[embeddings] Successfully computed taste vector for user: ${userId}`);
    return true;
  } catch (error) {
    console.error(`[embeddings] Error computing taste vector for user: ${userId}`, error);
    return false;
  }
}

/**
 * Batch process hotels that don't have embeddings yet.
 * Returns count of processed and failed hotels.
 */
export async function embedMissingHotels(
  batchSize = 50
): Promise<{ processed: number; failed: number }> {
  console.log(`[embeddings] Starting batch embedding of up to ${batchSize} hotels`);

  // Find hotels without embeddings
  const hotelsToEmbed = await db.$queryRaw<
    Array<{ id: string; name: string; description: string | null; amenities: string[] }>
  >`
    SELECT id, name, description, amenities
    FROM "HotelCache"
    WHERE embedding IS NULL
    LIMIT ${batchSize}
  `;

  console.log(`[embeddings] Found ${hotelsToEmbed.length} hotels without embeddings`);

  let processed = 0;
  let failed = 0;

  for (const hotel of hotelsToEmbed) {
    try {
      await embedHotel(hotel);
      processed++;
    } catch (error) {
      console.error(`[embeddings] Failed to embed hotel: ${hotel.id}`, error);
      failed++;
    }
  }

  console.log(
    `[embeddings] Batch complete: ${processed} processed, ${failed} failed`
  );

  return { processed, failed };
}
