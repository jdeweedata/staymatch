import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";
import { z } from "zod";

// Validation schema for profile updates
const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional().nullable(),
  dealBreakers: z.array(z.string()).optional(),
  delightFactors: z.array(z.string()).optional(),
  preferences: z
    .object({
      budgetRange: z.string().optional(),
      minStarRating: z.number().min(1).max(5).optional(),
      amenityPriorities: z.array(z.string()).optional(),
    })
    .optional(),
});

export async function GET() {
  try {
    // Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get full user data including createdAt
    const fullUser = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        preferences: true,
        dealBreakers: true,
        delightFactors: true,
        onboardingComplete: true,
        createdAt: true,
      },
    });

    if (!fullUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get swipe statistics
    const swipeStats = await db.swipe.groupBy({
      by: ["direction"],
      where: { userId: user.id },
      _count: { direction: true },
    });

    const totalSwipes = swipeStats.reduce(
      (acc, stat) => acc + stat._count.direction,
      0
    );
    const likes = swipeStats.find((s) => s.direction === "RIGHT")?._count.direction || 0;
    const superLikes = swipeStats.find((s) => s.direction === "SUPER_LIKE")?._count.direction || 0;
    const dislikes = swipeStats.find((s) => s.direction === "LEFT")?._count.direction || 0;

    // Calculate like ratio
    const totalLikes = likes + superLikes;
    const likeRatio = totalSwipes > 0 ? Math.round((totalLikes / totalSwipes) * 100) : 0;

    // Get top liked amenities from swiped hotels
    const likedSwipes = await db.swipe.findMany({
      where: {
        userId: user.id,
        direction: { in: ["RIGHT", "SUPER_LIKE"] },
      },
      include: {
        hotelImage: {
          include: {
            hotel: {
              select: {
                amenities: true,
              },
            },
          },
        },
      },
      take: 50, // Last 50 liked hotels
    });

    // Count amenity frequency
    const amenityCounts: Record<string, number> = {};
    for (const swipe of likedSwipes) {
      const amenities = swipe.hotelImage.hotel?.amenities || [];
      for (const amenity of amenities) {
        amenityCounts[amenity] = (amenityCounts[amenity] || 0) + 1;
      }
    }

    // Get top 5 amenities
    const topLikedAmenities = Object.entries(amenityCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([amenity]) => amenity);

    return NextResponse.json({
      user: {
        ...fullUser,
        memberSince: fullUser.createdAt.toISOString(),
      },
      stats: {
        totalSwipes,
        likes: totalLikes,
        dislikes,
        likeRatio,
        topLikedAmenities,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const parseResult = updateProfileSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const updates = parseResult.data;

    // Build update object
    const updateData: Record<string, unknown> = {};

    if (updates.name !== undefined) {
      updateData.name = updates.name;
    }

    if (updates.avatarUrl !== undefined) {
      updateData.avatarUrl = updates.avatarUrl;
    }

    if (updates.dealBreakers !== undefined) {
      updateData.dealBreakers = updates.dealBreakers;
    }

    if (updates.delightFactors !== undefined) {
      updateData.delightFactors = updates.delightFactors;
    }

    if (updates.preferences !== undefined) {
      // Merge with existing preferences
      const existingPrefs = (user.preferences as Record<string, unknown>) || {};
      updateData.preferences = {
        ...existingPrefs,
        ...updates.preferences,
      };
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        preferences: true,
        dealBreakers: true,
        delightFactors: true,
        onboardingComplete: true,
      },
    });

    return NextResponse.json({
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
