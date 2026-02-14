/**
 * Batch embed hotels without embeddings
 *
 * Usage: npx tsx scripts/embed-hotels.ts [--batch-size=50] [--max-batches=10]
 *
 * Examples:
 *   npx tsx scripts/embed-hotels.ts                        # Default: 50 per batch, 10 batches
 *   npx tsx scripts/embed-hotels.ts --batch-size=100       # 100 per batch
 *   npx tsx scripts/embed-hotels.ts --max-batches=5        # Max 5 batches
 *   npm run embed-hotels -- --batch-size=5 --max-batches=1 # Via npm script
 */

import { embedMissingHotels } from "../lib/services/embeddings";

async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  let batchSize = 50;
  let maxBatches = 10;

  for (const arg of args) {
    if (arg.startsWith("--batch-size=")) {
      const value = parseInt(arg.split("=")[1], 10);
      if (isNaN(value) || value < 1) {
        console.error("[embed-hotels] Invalid batch-size, using default: 50");
      } else {
        batchSize = Math.min(value, 200); // Cap at 200 to prevent overload
      }
    }
    if (arg.startsWith("--max-batches=")) {
      const value = parseInt(arg.split("=")[1], 10);
      if (isNaN(value) || value < 1) {
        console.error("[embed-hotels] Invalid max-batches, using default: 10");
      } else {
        maxBatches = value;
      }
    }
  }

  console.log(
    `[embed-hotels] Starting with batchSize=${batchSize}, maxBatches=${maxBatches}`
  );

  let totalProcessed = 0;
  let totalFailed = 0;
  let batchNum = 0;

  while (batchNum < maxBatches) {
    batchNum++;
    console.log(`\n[embed-hotels] Processing batch ${batchNum}/${maxBatches}...`);

    const { processed, failed } = await embedMissingHotels(batchSize);
    totalProcessed += processed;
    totalFailed += failed;

    console.log(
      `[embed-hotels] Batch ${batchNum}: ${processed} processed, ${failed} failed`
    );

    // Stop if no more hotels to process
    if (processed === 0) {
      console.log("[embed-hotels] No more hotels to process");
      break;
    }

    // Rate limit: wait 1 second between batches to avoid OpenAI rate limits
    if (batchNum < maxBatches && processed > 0) {
      console.log("[embed-hotels] Waiting 1s before next batch...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log(`\n[embed-hotels] Complete!`);
  console.log(
    `[embed-hotels] Total: ${totalProcessed} processed, ${totalFailed} failed`
  );

  // Exit with error code if any failed
  if (totalFailed > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("[embed-hotels] Fatal error:", error);
  process.exit(1);
});
