"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function FinalCTA() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-primary to-primary-700 rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full" />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            {!isSubmitted ? (
              <>
                {/* Heading */}
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                  Ready to Find Your Perfect Match?
                </h2>
                <p className="text-white/80 text-lg mb-8">
                  Join 50,000+ travelers who stopped searching and started matching.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent backdrop-blur-sm"
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    size="lg"
                    loading={isLoading}
                    className="bg-white text-primary hover:bg-white/90 border-0 whitespace-nowrap"
                  >
                    Get Early Access
                  </Button>
                </form>

                {/* Trust text */}
                <p className="text-white/60 text-sm mt-4">
                  Free forever. No credit card required.
                </p>
              </>
            ) : (
              /* Success state */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
                  You&apos;re on the List!
                </h3>
                <p className="text-white/80">
                  We&apos;ll notify you when StayMatch launches. Get ready to find your perfect stay.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
