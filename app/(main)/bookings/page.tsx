"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import BottomNav from "@/components/ui/BottomNav";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  hotelName: string;
  city: string;
  mainImage: string | null;
  checkIn: string;
  checkOut: string;
  nights: number;
  status: string;
  timing: "upcoming" | "current" | "past";
  totalPrice: number;
  currency: string;
  guestName: string;
  canContribute: boolean;
}

type TabType = "upcoming" | "past";

export default function BookingsPage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("profile");
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch("/api/bookings");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch bookings");
        }

        setBookings(data.bookings || []);
      } catch (err) {
        console.error("Fetch bookings error:", err);
        setError(err instanceof Error ? err.message : "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  const upcomingBookings = bookings.filter((b) => b.timing === "upcoming" || b.timing === "current");
  const pastBookings = bookings.filter((b) => b.timing === "past");

  const displayedBookings = activeTab === "upcoming" ? upcomingBookings : pastBookings;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getStatusBadge = (status: string, timing: string) => {
    if (status === "CANCELLED") {
      return { label: "Cancelled", className: "bg-red-100 text-red-700" };
    }
    if (timing === "current") {
      return { label: "Active", className: "bg-green-100 text-green-700" };
    }
    if (timing === "upcoming") {
      return { label: "Upcoming", className: "bg-blue-100 text-blue-700" };
    }
    return { label: "Completed", className: "bg-gray-100 text-gray-700" };
  };

  return (
    <main className="min-h-screen bg-background pb-24 lg:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-border/50">
        <div className="lg:hidden px-4 py-4">
          <h1 className="text-xl font-bold text-foreground">My Bookings</h1>
          <p className="text-sm text-muted-foreground">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="hidden lg:block lg:ml-[220px]">
          <div className="max-w-4xl mx-auto px-8 py-4">
            <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
            <p className="text-sm text-muted-foreground">
              Manage your reservations
            </p>
          </div>
        </div>
      </header>

      <div className="lg:ml-[220px]">
        <div className="max-w-lg lg:max-w-4xl mx-auto px-4 lg:px-8 py-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={cn(
                "flex-1 py-2 px-4 rounded-lg font-medium transition-all",
                activeTab === "upcoming"
                  ? "bg-primary text-white"
                  : "bg-surface-secondary text-muted-foreground hover:bg-muted"
              )}
            >
              Upcoming ({upcomingBookings.length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={cn(
                "flex-1 py-2 px-4 rounded-lg font-medium transition-all",
                activeTab === "past"
                  ? "bg-primary text-white"
                  : "bg-surface-secondary text-muted-foreground hover:bg-muted"
              )}
            >
              Past ({pastBookings.length})
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-muted rounded-xl h-32" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-primary underline"
              >
                Try again
              </button>
            </div>
          ) : displayedBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {activeTab === "upcoming" ? "No upcoming bookings" : "No past bookings"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {activeTab === "upcoming"
                  ? "Start exploring and book your next stay"
                  : "Your completed stays will appear here"}
              </p>
              {activeTab === "upcoming" && (
                <button
                  onClick={() => router.push("/")}
                  className="btn-primary"
                >
                  Find Hotels
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {displayedBookings.map((booking, index) => {
                const statusBadge = getStatusBadge(booking.status, booking.timing);

                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => router.push(`/bookings/${booking.id}`)}
                      className="w-full bg-white rounded-xl border border-border/50 overflow-hidden hover:shadow-md transition-shadow text-left"
                    >
                      <div className="flex">
                        {/* Image */}
                        <div
                          className="w-28 h-32 lg:w-36 lg:h-36 bg-cover bg-center flex-shrink-0"
                          style={{
                            backgroundImage: booking.mainImage
                              ? `url(${booking.mainImage})`
                              : "url(/images/hotel-placeholder.jpg)",
                          }}
                        />

                        {/* Content */}
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-foreground line-clamp-1">
                                {booking.hotelName}
                              </h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                {booking.city}
                              </p>
                            </div>
                            <span className={cn("text-xs px-2 py-1 rounded-full font-medium", statusBadge.className)}>
                              {statusBadge.label}
                            </span>
                          </div>

                          <div className="mt-3 space-y-1">
                            <p className="text-sm text-foreground">
                              {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {booking.nights} night{booking.nights !== 1 ? "s" : ""} • {booking.guestName}
                            </p>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <p className="font-semibold text-foreground">
                              ${booking.totalPrice.toFixed(2)}
                            </p>
                            {booking.canContribute && (
                              <span className="text-xs text-primary font-medium">
                                Leave a review →
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <BottomNav activeId={activeNav} onSelect={setActiveNav} />
    </main>
  );
}
