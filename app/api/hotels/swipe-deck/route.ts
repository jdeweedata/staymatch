import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export interface SwipeDeckItem {
  id: string; // HotelImage ID (for swipe API)
  hotelId: string;
  imageUrl: string;
  title: string;
  location: string;
  rating: number | null;
  price: string;
  tags: string[];
  matchScore: number;
  description: string;
  images: string[];
  amenities: string[];
}

export async function GET() {
  try {
    // Get swipe deck images with hotel metadata
    const swipeDeckImages = await prisma.hotelImage.findMany({
      where: { inSwipeDeck: true, isActive: true },
      take: 30,
      orderBy: { createdAt: "desc" },
      include: {
        hotel: true,
      },
    });

    if (swipeDeckImages.length === 0) {
      return NextResponse.json(
        {
          error: "No swipe deck images found. Run: npx tsx scripts/seed-swipe-deck.ts",
          items: [],
        },
        { status: 404 }
      );
    }

    // Group by hotel and take one image per hotel for main swipe cards
    const hotelMap = new Map<string, typeof swipeDeckImages[0]>();
    for (const img of swipeDeckImages) {
      // Prefer main photos
      const existing = hotelMap.get(img.hotelId);
      if (!existing || img.category === "main") {
        hotelMap.set(img.hotelId, img);
      }
    }

    // Transform to SwipeDeckItem format
    const items: SwipeDeckItem[] = Array.from(hotelMap.values()).map((img) => {
      const hotel = img.hotel;

      // Get all images for this hotel
      const hotelImages = swipeDeckImages
        .filter((i) => i.hotelId === img.hotelId)
        .map((i) => i.imageUrl);

      // Generate realistic price based on star rating
      const basePrice = hotel.starRating ? Math.round(80 + hotel.starRating * 40) : 150;
      const price = `$${basePrice + Math.floor(Math.random() * 50)}`;

      // Generate match score (in production, this comes from embedding similarity)
      const matchScore = 70 + Math.floor(Math.random() * 28);

      // Extract amenities as tags (first 4)
      const tags = (hotel.amenities || []).slice(0, 4);
      if (hotel.starRating && hotel.starRating >= 4) {
        tags.unshift(`${hotel.starRating}-Star`);
      }

      return {
        id: img.id, // HotelImage ID - this is what the swipe API needs
        hotelId: img.hotelId,
        imageUrl: img.imageUrl,
        title: hotel.name,
        location: `${hotel.city}, ${hotel.country}`,
        rating: hotel.starRating,
        price,
        tags: tags.slice(0, 4),
        matchScore,
        description: hotel.description || `Experience ${hotel.name} in ${hotel.city}.`,
        images: hotelImages.length > 0 ? hotelImages : [img.imageUrl],
        amenities: hotel.amenities || [],
      };
    });

    return NextResponse.json({
      items,
      count: items.length,
    });
  } catch (error) {
    console.error("Swipe deck error:", error);
    return NextResponse.json(
      { error: "Failed to fetch swipe deck images" },
      { status: 500 }
    );
  }
}
