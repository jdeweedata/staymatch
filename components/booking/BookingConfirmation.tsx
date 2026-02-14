"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BookingDetails {
  confirmationCode: string;
  hotelName: string;
  hotelImage?: string;
  hotelAddress?: string;
  checkIn: Date;
  checkOut: Date;
  guests: {
    adults: number;
    children: number;
  };
  rooms: number;
  totalPrice: string;
  currency?: string;
}

export interface BookingConfirmationProps {
  booking: BookingDetails;
  onViewBooking?: () => void;
  onBackToHome?: () => void;
  className?: string;
}

export function BookingConfirmation({
  booking,
  onViewBooking,
  onBackToHome,
  className,
}: BookingConfirmationProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate nights
  const nights = Math.ceil(
    (booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className={cn("min-h-screen bg-background p-6", className)}>
      <div className="max-w-lg mx-auto">
        {/* Success Animation */}
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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-muted-foreground">
            Your stay at {booking.hotelName} is confirmed
          </p>
        </motion.div>

        {/* Confirmation Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center mb-6"
        >
          <p className="text-sm text-primary mb-1">Confirmation Code</p>
          <p className="text-2xl font-mono font-bold text-foreground tracking-wider">
            {booking.confirmationCode}
          </p>
        </motion.div>

        {/* Booking Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-muted rounded-xl overflow-hidden mb-6"
        >
          {/* Hotel Image */}
          {booking.hotelImage && (
            <div className="relative h-40">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${booking.hotelImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="font-display text-xl font-bold text-white">
                  {booking.hotelName}
                </h2>
                {booking.hotelAddress && (
                  <p className="text-white/80 text-sm flex items-center gap-1 mt-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {booking.hotelAddress}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Details */}
          <div className="p-4 space-y-4">
            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Check-in</p>
                <p className="font-medium text-foreground">{formatDate(booking.checkIn)}</p>
                <p className="text-sm text-muted-foreground">After 3:00 PM</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Check-out</p>
                <p className="font-medium text-foreground">{formatDate(booking.checkOut)}</p>
                <p className="text-sm text-muted-foreground">Before 11:00 AM</p>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Duration</span>
                <span className="text-foreground">{nights} night{nights !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Guests</span>
                <span className="text-foreground">
                  {booking.guests.adults} adult{booking.guests.adults !== 1 ? "s" : ""}
                  {booking.guests.children > 0 && `, ${booking.guests.children} child${booking.guests.children !== 1 ? "ren" : ""}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rooms</span>
                <span className="text-foreground">{booking.rooms}</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex justify-between items-center">
              <span className="font-medium text-foreground">Total Paid</span>
              <span className="text-xl font-bold text-foreground">
                {booking.currency || "$"}{booking.totalPrice}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          {onViewBooking && (
            <button onClick={onViewBooking} className="w-full btn-primary">
              View Booking Details
            </button>
          )}
          {onBackToHome && (
            <button onClick={onBackToHome} className="w-full btn-secondary">
              Back to Home
            </button>
          )}
        </motion.div>

        {/* Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          A confirmation email has been sent to your inbox.
          <br />
          Need help? <a href="#" className="text-primary hover:underline">Contact Support</a>
        </motion.p>
      </div>
    </div>
  );
}

export default BookingConfirmation;
