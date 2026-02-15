"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";

interface PreviewCard {
  id: number;
  image: string;
  title: string;
  location: string;
  price: string;
  matchScore: number;
}

const previewCards: PreviewCard[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    title: "Boutique Bairro Alto",
    location: "Lisbon, Portugal",
    price: "$145",
    matchScore: 94,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
    title: "Ocean View Villa",
    location: "Bali, Indonesia",
    price: "$189",
    matchScore: 88,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
    title: "Shibuya Modern Loft",
    location: "Tokyo, Japan",
    price: "$210",
    matchScore: 82,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80",
    title: "Le Marais Apartment",
    location: "Paris, France",
    price: "$175",
    matchScore: 91,
  },
];

function PreviewCardComponent({
  card,
  index,
  onSwipe,
  isTop,
}: {
  card: PreviewCard;
  index: number;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  useEffect(() => {
    if (!isTop) return;

    const timeout = setTimeout(() => {
      const direction = Math.random() > 0.3 ? "right" : "left"; // 70% like
      const targetX = direction === "right" ? 300 : -300;

      animate(x, targetX, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        onComplete: () => onSwipe(direction),
      });
    }, 2500);

    return () => clearTimeout(timeout);
  }, [isTop, onSwipe, x]);

  return (
    <motion.div
      style={{
        x,
        rotate,
        zIndex: 3 - index,
      }}
      initial={{ scale: 1 - index * 0.05, y: index * 8 }}
      animate={{ scale: 1 - index * 0.05, y: index * 8 }}
      exit={{
        x: x.get() > 0 ? 300 : -300,
        opacity: 0,
        transition: { duration: 0.3 },
      }}
      className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl"
    >
      {/* Card Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${card.image})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* LIKE Indicator */}
      {isTop && (
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-6 right-6 bg-accent-success text-white font-bold text-xl px-4 py-2 rounded-lg rotate-12 border-4 border-white shadow-lg"
        >
          LIKE
        </motion.div>
      )}

      {/* NOPE Indicator */}
      {isTop && (
        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute top-6 left-6 bg-accent-error text-white font-bold text-xl px-4 py-2 rounded-lg -rotate-12 border-4 border-white shadow-lg"
        >
          NOPE
        </motion.div>
      )}

      {/* Match Score Badge */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-accent-success" />
        <span className="text-xs font-semibold text-foreground">
          {card.matchScore}% Match
        </span>
      </div>

      {/* Card Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-white font-bold text-xl mb-1">{card.title}</h3>
        <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          {card.location}
        </div>
        <div className="text-white font-semibold text-lg">
          {card.price}
          <span className="text-white/70 font-normal text-sm"> /night</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function SwipePreview() {
  const [cards, setCards] = useState(previewCards);

  const handleSwipe = () => {
    // Rotate cards
    setCards((prev) => {
      const newCards = [...prev];
      const swiped = newCards.shift();
      if (swiped) newCards.push(swiped);
      return newCards;
    });
  };

  const visibleCards = cards.slice(0, 3);

  return (
    <div className="relative w-full max-w-[280px] mx-auto">
      {/* Phone Frame */}
      <div className="relative bg-foreground rounded-[40px] p-3 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground rounded-b-2xl z-10" />

        {/* Screen */}
        <div className="relative bg-surface-secondary rounded-[32px] overflow-hidden aspect-[9/16]">
          {/* Card Stack */}
          <div className="absolute inset-4">
            <AnimatePresence mode="popLayout">
              {visibleCards.map((card, index) => (
                <PreviewCardComponent
                  key={card.id}
                  card={card}
                  index={index}
                  isTop={index === 0}
                  onSwipe={handleSwipe}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Action Buttons (decorative) */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-10">
            <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-accent-error/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C13515" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <div className="w-14 h-14 rounded-full bg-primary shadow-lg flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-accent-success/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00A699" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -z-10 -top-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
      <div className="absolute -z-10 -bottom-4 -left-4 w-24 h-24 bg-primary/5 rounded-full blur-xl" />
    </div>
  );
}
