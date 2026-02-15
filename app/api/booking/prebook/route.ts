import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import LiteApi from "liteapi-node-sdk";

const client = LiteApi(process.env.LITEAPI_KEY || "");

interface PrebookResponse {
  prebookId: string;
  hotelId: string;
  hotelName: string;
  roomName: string;
  rateName: string;
  boardType: string;
  checkIn: string;
  checkOut: string;
  price: number;
  currency: string;
  cancellationPolicy: string | null;
  cancellationDeadline: string | null;
  transactionId: string | null; // For Payment SDK
}

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

    const { rateId } = body as Record<string, unknown>;

    // Validate required fields
    if (!rateId || typeof rateId !== "string") {
      return NextResponse.json(
        { error: "rateId is required and must be a string" },
        { status: 400 }
      );
    }

    // Call LiteAPI prebook
    // Note: Payment SDK integration can be added in the future
    const response = await client.preBook({
      rateId,
    });

    if (!response.data) {
      return NextResponse.json(
        { error: "Failed to prebook - no data returned" },
        { status: 500 }
      );
    }

    const data = response.data as {
      prebookId?: string;
      hotelId?: string;
      hotelName?: string;
      roomName?: string;
      rateName?: string;
      boardType?: string;
      checkin?: string;
      checkout?: string;
      price?: number;
      currency?: string;
      cancellationPolicy?: { type?: string; deadline?: string };
      transactionId?: string;
    };

    if (!data.prebookId) {
      return NextResponse.json(
        { error: "Failed to prebook - no prebookId returned" },
        { status: 500 }
      );
    }

    const result: PrebookResponse = {
      prebookId: data.prebookId,
      hotelId: data.hotelId || "",
      hotelName: data.hotelName || "",
      roomName: data.roomName || "",
      rateName: data.rateName || "",
      boardType: data.boardType || "Room Only",
      checkIn: data.checkin || "",
      checkOut: data.checkout || "",
      price: data.price || 0,
      currency: data.currency || "USD",
      cancellationPolicy: data.cancellationPolicy?.type || null,
      cancellationDeadline: data.cancellationPolicy?.deadline || null,
      transactionId: data.transactionId || null,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Prebook error:", error);

    // Check for specific LiteAPI errors
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    if (errorMessage.includes("rate not available") || errorMessage.includes("sold out")) {
      return NextResponse.json(
        { error: "This room is no longer available. Please select another option." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to hold booking" },
      { status: 500 }
    );
  }
}
