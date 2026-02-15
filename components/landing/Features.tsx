"use client";

import { motion } from "framer-motion";
import MatchScoreBadge from "@/components/ui/MatchScoreBadge";
import TruthScoreBadge from "@/components/ui/TruthScoreBadge";

const features = [
  {
    id: "ai-matching",
    title: "AI-Powered Matching",
    description:
      "Our AI learns your style from just a few swipes and finds stays that actually fit you. No more endless scrolling through 500+ results.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3c.46 0 .93.04 1.4.14-1.66 1.86-2.68 4.3-2.68 6.97s1.02 5.11 2.68 6.97c-.47.1-.94.14-1.4.14-4.42 0-8-3.58-8-8s3.58-8 8-8zm0-3C5.37 0 0 5.37 0 12c0 6.08 4.53 11.11 10.4 11.89.68-.42 1.32-.93 1.9-1.52-.55.09-1.1.13-1.65.13-5.52 0-10-4.48-10-10S5.13 2.5 10.65 2.5c.55 0 1.1.04 1.65.13C11.72 1.93 11.08 1.42 10.4.63 10.27.61 10.14.6 10 .6c-.67 0-1.32.05-1.96.15C3.6 1.45.11 6.31.11 12c0 6.63 5.37 12 12 12 .67 0 1.32-.05 1.96-.15C18.51 23.15 22 18.29 22 12.65c0-1.1-.15-2.17-.44-3.18-.68.42-1.32.93-1.9 1.52.21.73.34 1.5.34 2.31 0 4.1-2.72 7.57-6.45 8.7-.37-.35-.72-.73-1.05-1.13 2.86-1.13 4.9-3.91 4.9-7.17 0-3.26-2.04-6.04-4.9-7.17.33-.4.68-.78 1.05-1.13C17.28 5.43 20 8.9 20 13c0 .81-.13 1.58-.34 2.31.58.59 1.22 1.1 1.9 1.52.29-1.01.44-2.08.44-3.18C22 6.98 17.63 1.6 12 .11c-.68-.07-1.36-.11-2.04-.11H10z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    visual: (
      <div className="flex justify-center">
        <MatchScoreBadge score={94} size="lg" />
      </div>
    ),
    accentColor: "bg-primary",
  },
  {
    id: "truth-engine",
    title: "Truth Engine",
    description:
      "Real WiFi speeds, actual noise levels, verified photos. Our Truth Engine uses data from travelers like you to cut through the marketing fluff.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
      </svg>
    ),
    visual: (
      <div className="flex justify-center">
        <TruthScoreBadge score={92} contributionCount={47} size="lg" />
      </div>
    ),
    accentColor: "bg-accent-success",
  },
  {
    id: "properties",
    title: "2M+ Properties",
    description:
      "From boutique hotels in Lisbon to villas in Bali and cozy apartments in Tokyo. All bookable instantly with the best rates guaranteed.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    ),
    visual: (
      <div className="grid grid-cols-2 gap-2">
        <div className="aspect-square rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=200&q=80"
            alt="Lisbon"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-square rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=200&q=80"
            alt="Bali"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-square rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200&q=80"
            alt="Tokyo"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-square rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200&q=80"
            alt="Paris"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    ),
    accentColor: "bg-foreground",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
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

export default function Features() {
  return (
    <section className="py-20 lg:py-32">
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
            Why StayMatch?
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            We&apos;re building the future of travel discovery
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              className="relative bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Accent Bar */}
              <div className={`h-1 ${feature.accentColor}`} />

              <div className="p-8">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-surface-secondary flex items-center justify-center text-foreground mb-6">
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Visual */}
                {feature.visual}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
