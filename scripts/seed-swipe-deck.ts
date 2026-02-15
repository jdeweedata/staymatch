/**
 * Seed swipe deck hotels from LiteAPI
 *
 * Usage: npx tsx scripts/seed-swipe-deck.ts [--limit=30]
 *
 * This script:
 * 1. Fetches hotels from LiteAPI for target cities
 * 2. Creates HotelCache records
 * 3. Creates HotelImage records with inSwipeDeck=true
 */

import { PrismaClient } from "@prisma/client";
import LiteApi from "liteapi-node-sdk";

const prisma = new PrismaClient();

// Initialize LiteAPI
const apiKey = process.env.LITEAPI_KEY || "";
if (!apiKey) {
  console.error("[seed-swipe-deck] LITEAPI_KEY not set");
  process.exit(1);
}
const liteApi = LiteApi(apiKey);

// Target cities for the swipe deck (nomad hubs per GTM strategy)
const CITIES = [
  { name: "Lisbon", countryCode: "PT" },
  { name: "Bali", countryCode: "ID" },
  { name: "Bangkok", countryCode: "TH" },
  { name: "Chiang Mai", countryCode: "TH" },
  { name: "Porto", countryCode: "PT" },
];

interface LiteApiHotel {
  id?: string;
  hotelId?: string;
  name?: string;
  hotelDescription?: string;
  starRating?: number;
  address?: string;
  city?: string;
  country?: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
  main_photo?: string;
  images?: string[];
  amenities?: string[];
}

async function fetchHotels(
  cityName: string,
  countryCode: string,
  limit: number
): Promise<LiteApiHotel[]> {
  try {
    console.log(`[seed-swipe-deck] Fetching hotels for ${cityName}, ${countryCode}...`);

    const response = await liteApi.getHotels({
      cityName,
      countryCode,
      limit,
    });

    if (!response.data || !Array.isArray(response.data)) {
      console.warn(`[seed-swipe-deck] No data for ${cityName}`);
      return [];
    }

    // Filter to hotels with images
    const hotels = response.data as LiteApiHotel[];
    const withImages = hotels.filter((h) => {
      return h.main_photo || (h.images && h.images.length > 0);
    });

    console.log(
      `[seed-swipe-deck] Found ${withImages.length} hotels with images in ${cityName}`
    );
    return withImages;
  } catch (error) {
    console.error(`[seed-swipe-deck] Error fetching ${cityName}:`, error);
    return [];
  }
}

async function seedHotels(limit: number) {
  console.log(`[seed-swipe-deck] Starting seed with limit=${limit}`);

  let totalHotels = 0;
  let totalImages = 0;

  // Calculate per-city limit
  const perCityLimit = Math.ceil(limit / CITIES.length);

  for (const city of CITIES) {
    const hotels = await fetchHotels(city.name, city.countryCode, perCityLimit);

    for (const hotel of hotels) {
      const hotelId = hotel.id || hotel.hotelId;
      if (!hotelId) continue;

      try {
        // Upsert HotelCache
        await prisma.hotelCache.upsert({
          where: { id: hotelId },
          update: {
            name: hotel.name || "Unknown Hotel",
            city: hotel.city || city.name,
            country: hotel.country || city.countryCode,
            latitude: hotel.latitude,
            longitude: hotel.longitude,
            starRating: hotel.starRating,
            description: hotel.hotelDescription,
            amenities: hotel.amenities || [],
            images: hotel.images || [],
            lastSynced: new Date(),
          },
          create: {
            id: hotelId,
            name: hotel.name || "Unknown Hotel",
            city: hotel.city || city.name,
            country: hotel.country || city.countryCode,
            latitude: hotel.latitude,
            longitude: hotel.longitude,
            starRating: hotel.starRating,
            description: hotel.hotelDescription,
            amenities: hotel.amenities || [],
            images: hotel.images || [],
          },
        });

        totalHotels++;

        // Create HotelImage records
        const imagesToCreate: Array<{
          hotelId: string;
          imageUrl: string;
          category: string;
          inSwipeDeck: boolean;
        }> = [];

        // Main photo
        if (hotel.main_photo) {
          imagesToCreate.push({
            hotelId,
            imageUrl: hotel.main_photo,
            category: "main",
            inSwipeDeck: true,
          });
        }

        // Additional images (up to 3)
        if (hotel.images) {
          const categories = ["room", "exterior", "lobby"];
          hotel.images.slice(0, 3).forEach((img, i) => {
            // Skip if same as main photo
            if (img !== hotel.main_photo) {
              imagesToCreate.push({
                hotelId,
                imageUrl: img,
                category: categories[i] || "other",
                inSwipeDeck: i === 0, // Only first additional image in swipe deck
              });
            }
          });
        }

        // Insert images (skip duplicates)
        for (const img of imagesToCreate) {
          // Check if image already exists
          const existing = await prisma.hotelImage.findFirst({
            where: {
              hotelId: img.hotelId,
              imageUrl: img.imageUrl,
            },
          });

          if (!existing) {
            await prisma.hotelImage.create({
              data: img,
            });
            totalImages++;
          }
        }
      } catch (error) {
        console.error(`[seed-swipe-deck] Error saving hotel ${hotelId}:`, error);
      }
    }

    // Rate limit between cities
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log(`\n[seed-swipe-deck] Complete!`);
  console.log(`[seed-swipe-deck] Hotels created/updated: ${totalHotels}`);
  console.log(`[seed-swipe-deck] Images created: ${totalImages}`);

  // Show swipe deck count
  const swipeDeckCount = await prisma.hotelImage.count({
    where: { inSwipeDeck: true, isActive: true },
  });
  console.log(`[seed-swipe-deck] Total swipe deck images: ${swipeDeckCount}`);
}

async function main() {
  const args = process.argv.slice(2);

  let limit = 30;

  for (const arg of args) {
    if (arg.startsWith("--limit=")) {
      const value = parseInt(arg.split("=")[1], 10);
      if (!isNaN(value) && value > 0) {
        limit = Math.min(value, 100); // Cap at 100
      }
    }
  }

  await seedHotels(limit);
}

main()
  .catch((error) => {
    console.error("[seed-swipe-deck] Fatal error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
