"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "@/components/booking/DatePicker";
import GuestSelector, { GuestCount } from "@/components/booking/GuestSelector";
import BookingSummary from "@/components/booking/BookingSummary";
import BookingConfirmation, { BookingDetails } from "@/components/booking/BookingConfirmation";
import BottomNav from "@/components/ui/BottomNav";
import { cn } from "@/lib/utils";

interface HotelInfo {
  id: string;
  name: string;
  city: string;
  image: string;
  starRating: number | null;
  pricePerNight: number;
}

interface RateOption {
  rateId: string;
  roomName: string;
  rateName: string;
  boardType: string;
  price: number;
  currency: string;
  cancellationPolicy: string | null;
}

interface PrebookData {
  prebookId: string;
  hotelId: string;
  hotelName: string;
  roomName: string;
  price: number;
  currency: string;
  cancellationPolicy: string | null;
  transactionId: string | null;
}

type BookingStep = "dates" | "guests" | "rooms" | "summary" | "confirmed";

function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hotelId = searchParams.get("hotelId");
  const hotelName = searchParams.get("name");
  const hotelCity = searchParams.get("city");
  const hotelImage = searchParams.get("image");

  const [activeNav, setActiveNav] = useState("booking");

  // Hotel state
  const [hotel, setHotel] = useState<HotelInfo | null>(null);
  const [hotelLoading, setHotelLoading] = useState(true);

  // Booking state
  const [step, setStep] = useState<BookingStep>("dates");
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState<GuestCount>({
    adults: 2,
    children: 0,
    rooms: 1,
  });

  // Rates and prebook state
  const [rates, setRates] = useState<RateOption[]>([]);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState<string | null>(null);
  const [selectedRate, setSelectedRate] = useState<RateOption | null>(null);
  const [prebookData, setPrebookData] = useState<PrebookData | null>(null);
  const [prebookLoading, setPrebookLoading] = useState(false);

  // Booking state
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  // Initialize hotel from URL params
  useEffect(() => {
    if (hotelId) {
      setHotel({
        id: hotelId,
        name: hotelName || "Hotel",
        city: hotelCity || "Unknown Location",
        image: hotelImage || "/images/hotel-placeholder.jpg",
        starRating: null,
        pricePerNight: 0, // Will be set from rates
      });
      setHotelLoading(false);
    } else {
      // No hotel ID - redirect back
      router.push("/");
    }
  }, [hotelId, hotelName, hotelCity, hotelImage, router]);

  // Get nights count
  const getNights = useCallback(() => {
    if (!checkIn || !checkOut) return 1;
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);

  // Fetch rates when moving to rooms step
  const fetchRates = useCallback(async () => {
    if (!hotel || !checkIn || !checkOut) return;

    setRatesLoading(true);
    setRatesError(null);

    try {
      const response = await fetch("/api/booking/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId: hotel.id,
          checkIn: checkIn.toISOString().split("T")[0],
          checkOut: checkOut.toISOString().split("T")[0],
          adults: guests.adults,
          children: guests.children,
          rooms: guests.rooms,
          currency: "USD",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch rates");
      }

      setRates(data.rates || []);

      if (data.rates && data.rates.length > 0) {
        // Update hotel price with lowest rate
        setHotel((prev) =>
          prev ? { ...prev, pricePerNight: Math.round(data.rates[0].price / getNights()) } : prev
        );
      }
    } catch (error) {
      console.error("Fetch rates error:", error);
      setRatesError(error instanceof Error ? error.message : "Failed to fetch rates");
    } finally {
      setRatesLoading(false);
    }
  }, [hotel, checkIn, checkOut, guests, getNights]);

  // Prebook selected rate
  const handleSelectRate = useCallback(async (rate: RateOption) => {
    setSelectedRate(rate);
    setPrebookLoading(true);
    setPrebookData(null);

    try {
      const response = await fetch("/api/booking/prebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rateId: rate.rateId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to hold booking");
      }

      setPrebookData(data);
      setStep("summary");
    } catch (error) {
      console.error("Prebook error:", error);
      setRatesError(error instanceof Error ? error.message : "Failed to hold booking");
      setSelectedRate(null);
    } finally {
      setPrebookLoading(false);
    }
  }, []);

  // Handle date changes
  const handleDateChange = useCallback((newCheckIn: Date | null, newCheckOut: Date | null) => {
    setCheckIn(newCheckIn);
    setCheckOut(newCheckOut);
    // Reset rates when dates change
    setRates([]);
    setSelectedRate(null);
    setPrebookData(null);
  }, []);

  // Handle guest changes
  const handleGuestChange = useCallback((newGuests: GuestCount) => {
    setGuests(newGuests);
    // Reset rates when guests change
    setRates([]);
    setSelectedRate(null);
    setPrebookData(null);
  }, []);

  // Navigate steps
  const goToNext = useCallback(() => {
    if (step === "dates" && checkIn && checkOut) {
      setStep("guests");
    } else if (step === "guests") {
      setStep("rooms");
      fetchRates();
    }
  }, [step, checkIn, checkOut, fetchRates]);

  const goToPrev = useCallback(() => {
    if (step === "guests") {
      setStep("dates");
    } else if (step === "rooms") {
      setStep("guests");
    } else if (step === "summary") {
      setStep("rooms");
    }
  }, [step]);

  // Handle booking confirmation
  const handleBook = useCallback(async () => {
    if (!prebookData || !hotel || !checkIn || !checkOut) return;

    setIsBooking(true);
    setBookingError(null);

    try {
      // For sandbox, we use ACC_CREDIT_CARD which doesn't require real payment
      // In production with Payment SDK, we'd have transactionId from client-side payment
      const response = await fetch("/api/booking/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prebookId: prebookData.prebookId,
          hotelId: hotel.id,
          hotelName: hotel.name,
          city: hotel.city,
          roomType: prebookData.roomName,
          checkIn: checkIn.toISOString().split("T")[0],
          checkOut: checkOut.toISOString().split("T")[0],
          guestCount: guests.adults + guests.children,
          totalPrice: prebookData.price,
          currency: prebookData.currency,
          guestFirstName: "Test", // TODO: Add guest form
          guestLastName: "Guest",
          guestEmail: "test@example.com",
          transactionId: prebookData.transactionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Booking failed");
      }

      setBookingDetails({
        confirmationCode: data.confirmationCode,
        hotelName: hotel.name,
        hotelImage: hotel.image,
        hotelAddress: hotel.city,
        checkIn,
        checkOut,
        guests: {
          adults: guests.adults,
          children: guests.children,
        },
        rooms: guests.rooms,
        totalPrice: prebookData.price.toFixed(2),
      });

      setStep("confirmed");
    } catch (error) {
      console.error("Booking error:", error);
      setBookingError(error instanceof Error ? error.message : "Booking failed");
    } finally {
      setIsBooking(false);
    }
  }, [prebookData, hotel, checkIn, checkOut, guests]);

  // Step indicator
  const steps = [
    { key: "dates", label: "Dates" },
    { key: "guests", label: "Guests" },
    { key: "rooms", label: "Rooms" },
    { key: "summary", label: "Confirm" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  // Loading state
  if (hotelLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // No hotel
  if (!hotel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No hotel selected</p>
          <button onClick={() => router.push("/")} className="btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Show confirmation screen
  if (step === "confirmed" && bookingDetails) {
    return (
      <>
        <BookingConfirmation
          booking={bookingDetails}
          onViewBooking={() => router.push("/bookings")}
          onBackToHome={() => router.push("/")}
        />
        <BottomNav activeId={activeNav} onSelect={setActiveNav} />
      </>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-24 lg:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-border/50">
        {/* Mobile header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => (step === "dates" ? router.back() : goToPrev())}
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Go back"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="text-center">
              <h1 className="font-display text-lg font-semibold text-foreground">
                {step === "dates" && "Select Dates"}
                {step === "guests" && "Who's Coming?"}
                {step === "rooms" && "Choose a Room"}
                {step === "summary" && "Confirm Booking"}
              </h1>
            </div>

            <div className="w-10" />
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 px-4 pb-3">
            {steps.map((s, index) => (
              <div key={s.key} className="flex items-center flex-1">
                <div
                  className={cn(
                    "flex-1 h-1 rounded-full transition-all",
                    index <= currentStepIndex ? "bg-primary" : "bg-muted"
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden lg:block lg:ml-[220px]">
          <div className="max-w-4xl mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => (step === "dates" ? router.back() : goToPrev())}
                  className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Go back"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    {step === "dates" && "Select Dates"}
                    {step === "guests" && "Who's Coming?"}
                    {step === "rooms" && "Choose a Room"}
                    {step === "summary" && "Confirm Booking"}
                  </h1>
                  <p className="text-sm text-text-secondary">Complete your reservation</p>
                </div>
              </div>

              {/* Desktop step indicator */}
              <div className="flex items-center gap-3">
                {steps.map((s, index) => (
                  <div key={s.key} className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                        index <= currentStepIndex
                          ? "bg-primary text-white"
                          : "bg-surface-secondary text-text-tertiary"
                      )}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={cn(
                        "text-sm hidden xl:block",
                        index <= currentStepIndex ? "text-foreground font-medium" : "text-text-tertiary"
                      )}
                    >
                      {s.label}
                    </span>
                    {index < steps.length - 1 && <div className="w-8 h-0.5 bg-border mx-1" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="lg:ml-[220px]">
        <div className="max-w-lg lg:max-w-4xl mx-auto px-4 lg:px-8 py-6">
          {/* Hotel Preview */}
          <div className="flex items-center gap-3 mb-6 p-3 lg:p-4 bg-surface-secondary rounded-xl lg:rounded-2xl">
            <div
              className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg lg:rounded-xl bg-cover bg-center flex-shrink-0"
              style={{ backgroundImage: `url(${hotel.image})` }}
            />
            <div className="flex-1 min-w-0">
              <h2 className="font-medium lg:font-semibold text-foreground truncate">{hotel.name}</h2>
              <p className="text-sm text-text-secondary flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                {hotel.city}
              </p>
              {hotel.starRating && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-accent-warning">★</span>
                  <span className="text-sm text-foreground">{hotel.starRating}</span>
                </div>
              )}
            </div>
          </div>

          {/* Error display */}
          {(ratesError || bookingError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{ratesError || bookingError}</p>
              <button
                onClick={() => {
                  setRatesError(null);
                  setBookingError(null);
                }}
                className="text-red-600 underline text-sm mt-2"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {step === "dates" && (
              <motion.div
                key="dates"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <DatePicker checkIn={checkIn} checkOut={checkOut} onChange={handleDateChange} />
              </motion.div>
            )}

            {step === "guests" && (
              <motion.div
                key="guests"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <GuestSelector value={guests} onChange={handleGuestChange} />
              </motion.div>
            )}

            {step === "rooms" && (
              <motion.div
                key="rooms"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Available Rooms</h3>

                  {ratesLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse bg-muted rounded-lg h-24" />
                      ))}
                    </div>
                  ) : rates.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No rooms available for selected dates.</p>
                      <button
                        onClick={() => setStep("dates")}
                        className="text-primary underline mt-2"
                      >
                        Change dates
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {rates.map((rate) => (
                        <button
                          key={rate.rateId}
                          onClick={() => handleSelectRate(rate)}
                          disabled={prebookLoading}
                          className={cn(
                            "w-full p-4 rounded-xl border text-left transition-all",
                            selectedRate?.rateId === rate.rateId
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50",
                            prebookLoading && "opacity-50 cursor-wait"
                          )}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-foreground">{rate.roomName}</h4>
                              <p className="text-sm text-muted-foreground">{rate.boardType}</p>
                              {rate.cancellationPolicy && (
                                <p className="text-xs text-green-600 mt-1">
                                  {rate.cancellationPolicy === "FREE_CANCELLATION"
                                    ? "Free cancellation"
                                    : rate.cancellationPolicy}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-lg">
                                ${rate.price.toFixed(2)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                total for {getNights()} night{getNights() > 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          {prebookLoading && selectedRate?.rateId === rate.rateId && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-primary">
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                              </svg>
                              Checking availability...
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === "summary" && prebookData && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <BookingSummary
                  hotelName={hotel.name}
                  hotelImage={hotel.image}
                  pricePerNight={Math.round(prebookData.price / getNights())}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  guests={guests}
                  isLoading={isBooking}
                  onBook={handleBook}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Continue Button */}
          {(step === "dates" || step === "guests") && (
            <div className="mt-6">
              <button
                onClick={goToNext}
                disabled={step === "dates" && (!checkIn || !checkOut)}
                className={cn(
                  "w-full btn-primary",
                  step === "dates" && (!checkIn || !checkOut) && "opacity-50 cursor-not-allowed"
                )}
              >
                Continue
                <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom navigation */}
      <BottomNav activeId={activeNav} onSelect={setActiveNav} />
    </main>
  );
}

// Wrap with Suspense for useSearchParams
export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  );
}
