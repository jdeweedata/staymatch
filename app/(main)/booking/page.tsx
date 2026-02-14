"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "@/components/booking/DatePicker";
import GuestSelector, { GuestCount } from "@/components/booking/GuestSelector";
import BookingSummary from "@/components/booking/BookingSummary";
import BookingConfirmation, { BookingDetails } from "@/components/booking/BookingConfirmation";
import BottomNav from "@/components/ui/BottomNav";
import { cn } from "@/lib/utils";

// Sample hotel data - in production this comes from API/URL params
const SAMPLE_HOTEL = {
  id: "1",
  name: "Boutique Ocean Villa",
  location: "Bali, Indonesia",
  image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  pricePerNight: 245,
  rating: 4.8,
  address: "Jl. Pantai Berawa No.99, Canggu, Bali 80361",
};

type BookingStep = "dates" | "guests" | "summary" | "confirmed";

export default function BookingPage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("booking");

  // Booking state
  const [step, setStep] = useState<BookingStep>("dates");
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState<GuestCount>({
    adults: 2,
    children: 0,
    rooms: 1,
  });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  // Handle date changes
  const handleDateChange = useCallback((newCheckIn: Date | null, newCheckOut: Date | null) => {
    setCheckIn(newCheckIn);
    setCheckOut(newCheckOut);
  }, []);

  // Handle guest changes
  const handleGuestChange = useCallback((newGuests: GuestCount) => {
    setGuests(newGuests);
  }, []);

  // Navigate steps
  const goToNext = useCallback(() => {
    if (step === "dates" && checkIn && checkOut) {
      setStep("guests");
    } else if (step === "guests") {
      setStep("summary");
    }
  }, [step, checkIn, checkOut]);

  const goToPrev = useCallback(() => {
    if (step === "guests") {
      setStep("dates");
    } else if (step === "summary") {
      setStep("guests");
    }
  }, [step]);

  // Calculate total price
  const calculateTotal = useCallback(() => {
    if (!checkIn || !checkOut) return 0;
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const subtotal = SAMPLE_HOTEL.pricePerNight * nights * guests.rooms;
    const serviceFee = subtotal * 0.1;
    const taxes = (subtotal + serviceFee) * 0.08;
    return subtotal + serviceFee + taxes;
  }, [checkIn, checkOut, guests.rooms]);

  // Handle booking
  const handleBook = useCallback(async () => {
    if (!checkIn || !checkOut) return;

    setIsBooking(true);

    try {
      // Simulate API call - in production, call /api/booking/create
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate confirmation
      const confirmationCode = `SM${Date.now().toString(36).toUpperCase()}`;
      const total = calculateTotal();

      setBookingDetails({
        confirmationCode,
        hotelName: SAMPLE_HOTEL.name,
        hotelImage: SAMPLE_HOTEL.image,
        hotelAddress: SAMPLE_HOTEL.address,
        checkIn,
        checkOut,
        guests: {
          adults: guests.adults,
          children: guests.children,
        },
        rooms: guests.rooms,
        totalPrice: total.toFixed(2),
      });

      setStep("confirmed");
    } catch (error) {
      console.error("Booking failed:", error);
      // Handle error - show toast, etc.
    } finally {
      setIsBooking(false);
    }
  }, [checkIn, checkOut, guests, calculateTotal]);

  // Step indicator
  const steps = [
    { key: "dates", label: "Dates" },
    { key: "guests", label: "Guests" },
    { key: "summary", label: "Confirm" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

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
                {step === "summary" && "Confirm Booking"}
              </h1>
            </div>

            <div className="w-10" /> {/* Spacer for alignment */}
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
                    {index < steps.length - 1 && (
                      <div className="w-8 h-0.5 bg-border mx-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content (offset for sidebar on desktop) */}
      <div className="lg:ml-[220px]">
        <div className="max-w-lg lg:max-w-4xl mx-auto px-4 lg:px-8 py-6">
          {/* Hotel Preview */}
          <div className="flex items-center gap-3 mb-6 p-3 lg:p-4 bg-surface-secondary rounded-xl lg:rounded-2xl">
            <div
              className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg lg:rounded-xl bg-cover bg-center flex-shrink-0"
              style={{ backgroundImage: `url(${SAMPLE_HOTEL.image})` }}
            />
            <div className="flex-1 min-w-0">
              <h2 className="font-medium lg:font-semibold text-foreground truncate">{SAMPLE_HOTEL.name}</h2>
              <p className="text-sm text-text-secondary flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {SAMPLE_HOTEL.location}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-accent-warning">★</span>
                <span className="text-sm text-foreground">{SAMPLE_HOTEL.rating}</span>
                <span className="text-sm text-text-secondary">•</span>
                <span className="text-sm font-medium text-foreground">${SAMPLE_HOTEL.pricePerNight}/night</span>
              </div>
            </div>
          </div>

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
                <DatePicker
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onChange={handleDateChange}
                />
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
                <GuestSelector
                  value={guests}
                  onChange={handleGuestChange}
                />
              </motion.div>
            )}

            {step === "summary" && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <BookingSummary
                  hotelName={SAMPLE_HOTEL.name}
                  hotelImage={SAMPLE_HOTEL.image}
                  pricePerNight={SAMPLE_HOTEL.pricePerNight}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  guests={guests}
                  isLoading={isBooking}
                  onBook={handleBook}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Continue Button (for dates and guests steps) */}
          {step !== "summary" && (
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
