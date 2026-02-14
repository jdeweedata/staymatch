import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import liteApiService from "@/lib/services/liteapi";

const searchSchema = z.object({
  cityCode: z.string().min(1, "City is required"),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  adults: z.number().min(1).max(10).default(2),
  children: z.number().min(0).max(10).optional(),
  rooms: z.number().min(1).max(5).default(1),
  currency: z.string().length(3).default("USD"),
  countryCode: z.string().length(2).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = searchSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const rates = await liteApiService.searchRates(result.data);

    return NextResponse.json({
      rates,
      count: rates.length,
    });
  } catch (error) {
    console.error("Hotel search error:", error);
    return NextResponse.json(
      { error: "Failed to search hotels" },
      { status: 500 }
    );
  }
}
