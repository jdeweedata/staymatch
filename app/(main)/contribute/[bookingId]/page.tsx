"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ContributionForm, {
    ContributionFormData,
} from "@/components/contributions/ContributionForm";

interface BookingInfo {
    id: string;
    hotelName: string;
    city: string;
    checkIn: string;
    checkOut: string;
    status: string;
}

interface DiscountResult {
    code: string;
    discount: string;
    validUntil: string;
}

export default function ContributePage({
    params,
}: {
    params: Promise<{ bookingId: string }>;
}) {
    const { bookingId } = use(params);
    const router = useRouter();
    const [booking, setBooking] = useState<BookingInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [discount, setDiscount] = useState<DiscountResult | null>(null);

    useEffect(() => {
        async function fetchBooking() {
            try {
                const res = await fetch(`/api/bookings/${bookingId}`);
                if (!res.ok) {
                    setError(
                        res.status === 404 ? "Booking not found" : "Failed to load booking"
                    );
                    return;
                }
                const data = await res.json();
                setBooking(data);
            } catch {
                setError("Failed to load booking details");
            } finally {
                setLoading(false);
            }
        }
        fetchBooking();
    }, [bookingId]);

    const handleSubmit = async (data: ContributionFormData) => {
        const res = await fetch("/api/contributions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId, ...data }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to submit contribution");
        }

        const result = await res.json();
        setDiscount(result.discountCode);
        setSubmitted(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="text-center">
                    <h2 className="font-display text-xl font-bold text-foreground mb-2">
                        {error}
                    </h2>
                    <button
                        onClick={() => router.push("/bookings")}
                        className="text-primary text-sm font-medium hover:underline"
                    >
                        Back to Bookings
                    </button>
                </div>
            </div>
        );
    }

    if (submitted && discount) {
        return (
            <div className="min-h-screen bg-background p-6">
                <div className="max-w-lg mx-auto pt-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.6 }}
                        className="flex justify-center mb-8"
                    >
                        <div className="w-24 h-24 rounded-full bg-accent-success/20 flex items-center justify-center">
                            <motion.svg
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="w-12 h-12 text-accent-success"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <motion.path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                />
                            </motion.svg>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-center mb-8"
                    >
                        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                            Thank You!
                        </h1>
                        <p className="text-muted-foreground">
                            Your data helps future travelers make better decisions.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-primary/10 border border-primary/20 rounded-xl p-5 text-center mb-6"
                    >
                        <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">
                            Your Reward — {discount.discount} Off Next Booking
                        </p>
                        <p className="text-2xl font-mono font-bold text-foreground tracking-wider mb-2">
                            {discount.code}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Valid until{" "}
                            {new Date(discount.validUntil).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-3"
                    >
                        <button
                            onClick={() => router.push("/")}
                            className="w-full py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                        >
                            Find Your Next Stay
                        </button>
                        <button
                            onClick={() => router.push("/bookings")}
                            className="w-full py-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                        >
                            Back to Bookings
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-lg mx-auto pt-4">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Back
                    </button>
                    <h1 className="font-display text-2xl font-bold text-foreground">
                        Share Your Experience
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        at <span className="font-semibold text-foreground">{booking?.hotelName}</span>
                    </p>
                </div>

                {/* Incentive banner */}
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">🎁</span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground">
                            Earn 10% off your next booking
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Share verified data to help the community
                        </p>
                    </div>
                </div>

                {/* Form */}
                <ContributionForm
                    bookingId={bookingId}
                    hotelName={booking?.hotelName || ""}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}
