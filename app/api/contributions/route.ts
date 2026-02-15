import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeTruthScore } from "@/lib/services/truth-score";

/**
 * POST /api/contributions — Submit post-stay contribution data.
 *
 * Requires authenticated user with a COMPLETED booking.
 * Creates contribution, generates discount code, and triggers Truth Score recomputation.
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { bookingId, ...contributionData } = body;

        if (!bookingId) {
            return NextResponse.json(
                { error: "bookingId is required" },
                { status: 400 }
            );
        }

        // Verify booking exists, belongs to user, and is completed
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { contribution: { select: { id: true } } },
        });

        if (!booking) {
            return NextResponse.json(
                { error: "Booking not found" },
                { status: 404 }
            );
        }

        if (booking.userId !== session.userId) {
            return NextResponse.json(
                { error: "Booking does not belong to this user" },
                { status: 403 }
            );
        }

        if (booking.status !== "COMPLETED") {
            return NextResponse.json(
                { error: "Booking must be completed before contributing" },
                { status: 400 }
            );
        }

        if (booking.contribution) {
            return NextResponse.json(
                { error: "A contribution already exists for this booking" },
                { status: 409 }
            );
        }

        // Generate a discount code for the contributor
        const discountCodeValue = `TRUTH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const discountValidUntil = new Date(
            Date.now() + 90 * 24 * 60 * 60 * 1000 // 90 days
        );

        // Create discount code record
        await prisma.discountCode.create({
            data: {
                code: discountCodeValue,
                discount: 0.1, // 10% discount
                validUntil: discountValidUntil,
            },
        });

        // Create contribution
        const contribution = await prisma.contribution.create({
            data: {
                userId: session.userId,
                bookingId,
                hotelId: booking.liteapiHotelId,
                wifiDownload: contributionData.wifiDownload ?? null,
                wifiUpload: contributionData.wifiUpload ?? null,
                wifiPing: contributionData.wifiPing ?? null,
                wifiFloor: contributionData.wifiFloor ?? null,
                wifiTestedAt: contributionData.wifiDownload ? new Date() : null,
                hotWaterReliable: contributionData.hotWaterReliable ?? null,
                blackoutCurtains: contributionData.blackoutCurtains ?? null,
                quietAtNight: contributionData.quietAtNight ?? null,
                acWorksWell: contributionData.acWorksWell ?? null,
                workDeskPresent: contributionData.workDeskPresent ?? null,
                noiseLevel: contributionData.noiseLevel ?? null,
                overallRating: contributionData.overallRating ?? null,
                additionalNotes: contributionData.additionalNotes ?? null,
                discountCode: discountCodeValue,
                verified: true, // Auto-verified since linked to a real booking
                verifiedAt: new Date(),
            },
        });

        // Mark booking as contribution-requested
        await prisma.booking.update({
            where: { id: bookingId },
            data: {
                contributionRequested: true,
                contributionRequestedAt: new Date(),
            },
        });

        // Recompute Truth Score for this hotel (async, don't block response)
        computeTruthScore(booking.liteapiHotelId).catch((err) =>
            console.error("[contributions] Truth Score recompute failed:", err)
        );

        return NextResponse.json(
            {
                contribution: {
                    id: contribution.id,
                    hotelId: contribution.hotelId,
                    createdAt: contribution.createdAt,
                },
                discountCode: {
                    code: discountCodeValue,
                    discount: "10%",
                    validUntil: discountValidUntil.toISOString(),
                },
                message:
                    "Thank you for contributing! Your data helps future travelers make better decisions.",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("[contributions] POST error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
