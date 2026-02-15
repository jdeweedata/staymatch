import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { liteApiService } from "@/lib/services/liteapi";

const searchSchema = z.object({
  query: z.string().min(2).max(100),
  countryCode: z.string().length(2).optional(),
  limit: z.number().min(1).max(20).default(10),
});

export async function POST(request: NextRequest) {
  try {
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
    const parseResult = searchSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { query, countryCode, limit } = parseResult.data;

    // Search cities
    const cities = await liteApiService.searchCities(query, countryCode, limit);

    return NextResponse.json({
      cities,
      count: cities.length,
    });
  } catch (error) {
    console.error("City search error:", error);
    return NextResponse.json(
      { error: "Failed to search cities" },
      { status: 500 }
    );
  }
}
