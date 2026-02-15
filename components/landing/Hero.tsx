"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import SwipePreview from "./SwipePreview";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 lg:pt-24 pb-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left">
            {/* Logo on mobile */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:hidden flex justify-center mb-8"
            >
              <Image
                src="/staymatch_logo_upscaled.png"
                alt="StayMatch"
                width={180}
                height={45}
                priority
                className="h-10 w-auto"
              />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.1] tracking-tight"
            >
              Your Perfect Stay
              <br />
              <span className="text-primary">is Already Waiting</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-6 text-lg sm:text-xl text-primary font-medium"
            >
              Stop searching. Start matching.
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-4 text-base sm:text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Swipe through hotels to train your AI. Get curated matches from 2M+ properties
              with verified data from real travelers.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/onboarding">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Start Matching
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  See How It Works
                </Button>
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-10 flex items-center gap-6 justify-center lg:justify-start text-sm text-text-tertiary"
            >
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-accent-success">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-accent-success">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span>No account needed</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 }}
            className="hidden md:flex justify-center lg:justify-end"
          >
            <SwipePreview />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="text-xs text-text-tertiary">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-tertiary">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
