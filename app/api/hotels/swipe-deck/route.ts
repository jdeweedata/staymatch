import { NextResponse } from "next/server";
import liteApiService from "@/lib/services/liteapi";
import prisma from "@/lib/db";

export async function GET() {
  try {
    // First check if we have cached hotels in database
    const cachedHotels = await prisma.hotelImage.findMany({
      where: { inSwipeDeck: true, isActive: true },
      take: 30,
      orderBy: { createdAt: "desc" },
    });

    if (cachedHotels.length >= 15) {
      return NextResponse.json({
        images: cachedHotels.map((h) => ({
          id: h.id,
          hotelId: h.hotelId,
          imageUrl: h.imageUrl,
          category: h.category,
        })),
        source: "cache",
      });
    }

    // Fetch fresh hotels from LiteAPI
    const cities = ["lisbon", "bali", "bangkok"];
    const hotels = await liteApiService.getSwipeDeckHotels(cities, 50);

    // Transform to image format for swipe deck
    const images = hotels
      .filter((h) => h.main_photo || (h.images && h.images.length > 0))
      .flatMap((h) => {
        const hotelImages = [];

        if (h.main_photo) {
          hotelImages.push({
            id: `${h.id}-main`,
            hotelId: h.id,
            hotelName: h.name,
            city: h.city || "",
            imageUrl: h.main_photo,
            category: "main",
          });
        }

        if (h.images) {
          h.images.slice(0, 2).forEach((img, i) => {
            hotelImages.push({
              id: `${h.id}-${i}`,
              hotelId: h.id,
              hotelName: h.name,
              city: h.city || "",
              imageUrl: img,
              category: i === 0 ? "room" : "exterior",
            });
          });
        }

        return hotelImages;
      })
      .slice(0, 30);

    return NextResponse.json({
      images,
      source: "liteapi",
      count: images.length,
    });
  } catch (error) {
    console.error("Swipe deck error:", error);
    return NextResponse.json(
      { error: "Failed to fetch swipe deck images" },
      { status: 500 }
    );
  }
}
