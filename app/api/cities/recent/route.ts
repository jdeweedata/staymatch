import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";
import type { Prisma } from "@prisma/client";

const MAX_RECENT_SEARCHES = 5;

interface RecentSearch {
  cityCode: string;
  cityName: string;
  countryCode: string;
  searchedAt: string;
}

const addRecentSchema = z.object({
  cityCode: z.string().min(1),
  cityName: z.string().min(1),
  countryCode: z.string().length(2),
});

// GET - List recent searches
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get full user data with recentSearches
    const fullUser = await db.user.findUnique({
      where: { id: user.id },
      select: { recentSearches: true },
    });

    const recentSearches = (fullUser?.recentSearches as unknown as RecentSearch[]) || [];

    return NextResponse.json({
      recentSearches,
      count: recentSearches.length,
    });
  } catch (error) {
    console.error("Get recent searches error:", error);
    return NextResponse.json(
      { error: "Failed to get recent searches" },
      { status: 500 }
    );
  }
}

// POST - Add a recent search
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    // Validate input
    const parseResult = addRecentSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { cityCode, cityName, countryCode } = parseResult.data;

    // Get current recent searches
    const fullUser = await db.user.findUnique({
      where: { id: user.id },
      select: { recentSearches: true },
    });

    const currentSearches = (fullUser?.recentSearches as unknown as RecentSearch[]) || [];

    // Create new search entry
    const newSearch: RecentSearch = {
      cityCode,
      cityName,
      countryCode,
      searchedAt: new Date().toISOString(),
    };

    // Remove duplicate (same cityCode) and add new at front
    const filteredSearches = currentSearches.filter(
      (s) => s.cityCode !== cityCode
    );
    const updatedSearches = [newSearch, ...filteredSearches].slice(
      0,
      MAX_RECENT_SEARCHES
    );

    // Update user
    await db.user.update({
      where: { id: user.id },
      data: { recentSearches: updatedSearches as unknown as Prisma.InputJsonValue },
    });

    return NextResponse.json({
      recentSearches: updatedSearches,
      count: updatedSearches.length,
    });
  } catch (error) {
    console.error("Add recent search error:", error);
    return NextResponse.json(
      { error: "Failed to add recent search" },
      { status: 500 }
    );
  }
}

// DELETE - Clear all recent searches
export async function DELETE() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Clear recent searches
    await db.user.update({
      where: { id: user.id },
      data: { recentSearches: [] as Prisma.InputJsonValue },
    });

    return NextResponse.json({
      success: true,
      message: "Recent searches cleared",
    });
  } catch (error) {
    console.error("Clear recent searches error:", error);
    return NextResponse.json(
      { error: "Failed to clear recent searches" },
      { status: 500 }
    );
  }
}
