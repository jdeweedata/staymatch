import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";
import { computeTasteVector } from "@/lib/services/embeddings";

const VALID_DIRECTIONS = ["LEFT", "RIGHT", "SUPER_LIKE"] as const;
type SwipeDirection = (typeof VALID_DIRECTIONS)[number];

function isValidDirection(value: unknown): value is SwipeDirection {
  return typeof value === "string" && VALID_DIRECTIONS.includes(value as SwipeDirection);
}

const MIN_SWIPES_FOR_COMPLETE = 10;
const MIN_LIKES_FOR_COMPLETE = 3;

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { hotelImageId, direction } = body as Record<string, unknown>;

    // Validate hotelImageId
    if (!hotelImageId || typeof hotelImageId !== "string" || hotelImageId.trim() === "") {
      return NextResponse.json(
        { error: "Invalid hotelImageId: must be a non-empty string" },
        { status: 400 }
      );
    }

    // Validate direction
    if (!isValidDirection(direction)) {
      return NextResponse.json(
        { error: `Invalid direction: must be one of ${VALID_DIRECTIONS.join(", ")}` },
        { status: 400 }
      );
    }

    // Upsert swipe (create or update if exists)
    const swipe = await db.swipe.upsert({
      where: {
        userId_hotelImageId: {
          userId: user.id,
          hotelImageId: hotelImageId.trim(),
        },
      },
      update: {
        direction,
      },
      create: {
        userId: user.id,
        hotelImageId: hotelImageId.trim(),
        direction,
      },
    });

    // Count total swipes and liked swipes
    const [totalCount, likedCount] = await Promise.all([
      db.swipe.count({
        where: { userId: user.id },
      }),
      db.swipe.count({
        where: {
          userId: user.id,
          direction: { in: ["RIGHT", "SUPER_LIKE"] },
        },
      }),
    ]);

    // Determine if onboarding is complete
    const isComplete = totalCount >= MIN_SWIPES_FOR_COMPLETE && likedCount >= MIN_LIKES_FOR_COMPLETE;

    // Atomically update user onboarding status if complete (WHERE clause prevents race conditions)
    if (isComplete) {
      await db.user.updateMany({
        where: {
          id: user.id,
          onboardingComplete: false,
        },
        data: { onboardingComplete: true },
      });

      // Compute taste vector in background (non-blocking)
      // Errors are logged but don't affect the swipe response
      computeTasteVector(user.id).catch((error) => {
        console.error("[swipes] Taste vector computation failed:", error);
      });
    }

    return NextResponse.json({
      id: swipe.id,
      count: totalCount,
      isComplete,
    });
  } catch (error) {
    console.error("Swipe error:", error);
    return NextResponse.json(
      { error: "Failed to record swipe" },
      { status: 500 }
    );
  }
}

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

    // Count total swipes, liked swipes, and disliked swipes
    const [count, liked, disliked] = await Promise.all([
      db.swipe.count({
        where: { userId: user.id },
      }),
      db.swipe.count({
        where: {
          userId: user.id,
          direction: { in: ["RIGHT", "SUPER_LIKE"] },
        },
      }),
      db.swipe.count({
        where: {
          userId: user.id,
          direction: "LEFT",
        },
      }),
    ]);

    // Determine if onboarding is complete
    const isComplete = count >= MIN_SWIPES_FOR_COMPLETE && liked >= MIN_LIKES_FOR_COMPLETE;

    return NextResponse.json({
      count,
      liked,
      disliked,
      isComplete,
    });
  } catch (error) {
    console.error("Get swipe progress error:", error);
    return NextResponse.json(
      { error: "Failed to get swipe progress" },
      { status: 500 }
    );
  }
}
