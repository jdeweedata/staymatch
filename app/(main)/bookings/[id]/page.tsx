"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import BottomNav from "@/components/ui/BottomNav";
import { cn } from "@/lib/utils";

interface BookingDetail {
  id: string;
  liteapiBookingId: string;
  hotelId: string;
  hotelName: string;
  city: string;
  images: string[];
  starRating: number | null;
  truthScore: number | null;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomType: string;
  guestCount: number;
  totalPrice: number;
  currency: string;
  status: string;
  timing: "upcoming" | "current" | "past";
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  canCancel: boolean;
  canContribute: boolean;
  createdAt: string;
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [activeNav, setActiveNav] = useState("profile");
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const response = await fetch(`/api/bookings/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch booking");
        }

        setBooking(data);
      } catch (err) {
        console.error("Fetch booking error:", err);
        setError(err instanceof Error ? err.message : "Failed to load booking");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchBooking();
    }
  }, [id]);

  const handleCancel = async () => {
    if (!booking) return;

    setCancelling(true);
    try {
      const response = await fetch(`/api/bookings/${id}/cancel`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel booking");
      }

      // Update local state
      setBooking((prev) => (prev ? { ...prev, status: "CANCELLED", canCancel: false } : null));
      setShowCancelModal(false);
    } catch (err) {
      console.error("Cancel error:", err);
      alert(err instanceof Error ? err.message : "Failed to cancel booking");
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string, timing: string) => {
    if (status === "CANCELLED") {
      return { label: "Cancelled", className: "bg-red-100 text-red-700" };
    }
    if (timing === "current") {
      return { label: "Active Stay", className: "bg-green-100 text-green-700" };
    }
    if (timing === "upcoming") {
      return { label: "Confirmed", className: "bg-blue-100 text-blue-700" };
    }
    return { label: "Completed", className: "bg-gray-100 text-gray-700" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Booking not found"}</p>
          <button onClick={() => router.push("/bookings")} className="btn-primary">
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(booking.status, booking.timing);
  const mainImage = booking.images?.[0] || "/images/hotel-placeholder.jpg";

  return (
    <main className="min-h-screen bg-background pb-24 lg:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3 lg:ml-[220px]">
          <button
            onClick={() => router.push("/bookings")}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Go back"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-foreground">Booking Details</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="lg:ml-[220px]">
        <div className="max-w-lg lg:max-w-2xl mx-auto px-4 lg:px-8 py-6">
          {/* Hotel Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden mb-6"
          >
            <div
              className="h-48 lg:h-64 bg-cover bg-center"
              style={{ backgroundImage: `url(${mainImage})` }}
            />
            <div className="absolute top-4 right-4">
              <span className={cn("px-3 py-1 rounded-full text-sm font-medium", statusBadge.className)}>
                {statusBadge.label}
              </span>
            </div>
          </motion.div>

          {/* Hotel Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold text-foreground mb-1">{booking.hotelName}</h2>
            <p className="text-muted-foreground flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {booking.city}
            </p>
            {booking.starRating && (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-accent-warning">★</span>
                <span className="text-sm text-foreground">{booking.starRating}</span>
              </div>
            )}
          </motion.div>

          {/* Dates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface-secondary rounded-xl p-4 mb-4"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-3">STAY DATES</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Check-in</p>
                <p className="font-medium text-foreground">{formatDate(booking.checkIn)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Check-out</p>
                <p className="font-medium text-foreground">{formatDate(booking.checkOut)}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                {booking.nights} night{booking.nights !== 1 ? "s" : ""}
              </p>
            </div>
          </motion.div>

          {/* Room & Guests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface-secondary rounded-xl p-4 mb-4"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-3">ROOM DETAILS</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room Type</span>
                <span className="text-foreground">{booking.roomType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Guests</span>
                <span className="text-foreground">{booking.guestCount} guest{booking.guestCount !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </motion.div>

          {/* Guest Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-surface-secondary rounded-xl p-4 mb-4"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-3">GUEST INFORMATION</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="text-foreground">{booking.guestFirstName} {booking.guestLastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="text-foreground">{booking.guestEmail}</span>
              </div>
            </div>
          </motion.div>

          {/* Price */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-surface-secondary rounded-xl p-4 mb-6"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-3">PAYMENT</h3>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Paid</span>
              <span className="text-xl font-bold text-foreground">
                ${booking.totalPrice.toFixed(2)} {booking.currency}
              </span>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            {booking.canContribute && (
              <button
                onClick={() => {
                  // TODO: Navigate to Truth Check flow
                  alert("Truth Check feature coming soon!");
                }}
                className="w-full btn-primary"
              >
                Leave a Truth Check
                <span className="ml-2 text-sm opacity-80">Get 5% off next booking</span>
              </button>
            )}

            {booking.canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full py-3 px-4 border border-red-300 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors"
              >
                Cancel Booking
              </button>
            )}

            <button
              onClick={() => router.push("/bookings")}
              className="w-full py-3 px-4 border border-border text-muted-foreground rounded-xl font-medium hover:bg-muted transition-colors"
            >
              Back to My Bookings
            </button>
          </motion.div>

          {/* Booking Reference */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-center text-xs text-muted-foreground"
          >
            <p>Booking Reference: {booking.liteapiBookingId}</p>
            <p>Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
          </motion.div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full"
          >
            <h3 className="text-lg font-semibold text-foreground mb-2">Cancel Booking?</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to cancel your reservation at {booking.hotelName}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="flex-1 py-2 px-4 border border-border rounded-lg font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <BottomNav activeId={activeNav} onSelect={setActiveNav} />
    </main>
  );
}
