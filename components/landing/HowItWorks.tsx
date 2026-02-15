"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: 1,
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    title: "Swipe",
    description: "Build your taste profile by swiping through hotels you love. Just like dating apps, but for your perfect stay.",
  },
  {
    number: 2,
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    title: "Match",
    description: "Our AI learns your style from your swipes and finds stays that actually fit you. No more endless scrolling.",
  },
  {
    number: 3,
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
      </svg>
    ),
    title: "Book",
    description: "Book with confidence knowing it's your perfect match. Verified data from real travelers backs every recommendation.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-surface-secondary">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Finding your perfect stay is as easy as swiping right
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8 lg:gap-12"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Step Number */}
              <div className="absolute -top-4 left-8 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                {step.number}
              </div>

              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {step.description}
              </p>

              {/* Connector Line (desktop only) */}
              {step.number < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-8 w-12 lg:w-16 border-t-2 border-dashed border-border" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
