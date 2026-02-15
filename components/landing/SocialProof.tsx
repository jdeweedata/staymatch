"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface StatProps {
  value: number;
  suffix: string;
  label: string;
}

function AnimatedStat({ value, suffix, label }: StatProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-2">
        {count.toLocaleString()}
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="text-text-secondary text-sm sm:text-base">{label}</div>
    </div>
  );
}

const stats = [
  { value: 50, suffix: "K+", label: "Matches Made" },
  { value: 2, suffix: "M+", label: "Properties" },
  { value: 98, suffix: "%", label: "Satisfaction Rate" },
];

const testimonials = [
  {
    id: 1,
    quote:
      "Finally, a booking app that gets my style. Found the perfect coworking-friendly hotel in Lisbon within minutes.",
    author: "Sarah K.",
    role: "Digital Nomad",
    avatar: "S",
  },
  {
    id: 2,
    quote:
      "The Truth Engine is a game-changer. No more surprises about WiFi speed or noise levels. Everything is verified.",
    author: "Marcus T.",
    role: "Remote Developer",
    avatar: "M",
  },
  {
    id: 3,
    quote:
      "We used StayMatch for our anniversary trip to Bali. The AI matched us with a villa we never would have found on our own.",
    author: "Emily & James",
    role: "Couple Travelers",
    avatar: "E",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export default function SocialProof() {
  return (
    <section className="py-20 lg:py-32 bg-surface-secondary">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-3 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <AnimatedStat
              key={index}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </motion.div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Loved by Travelers
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Join thousands who found their perfect match
          </p>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              {/* Quote */}
              <div className="mb-6">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-primary/20 mb-3"
                >
                  <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                </svg>
                <p className="text-foreground leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">
                    {testimonial.author}
                  </div>
                  <div className="text-text-tertiary text-xs">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
