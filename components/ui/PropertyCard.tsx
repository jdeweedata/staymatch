"use client";

import React, { useState } from "react";

interface PropertyCardProps {
    image: string;
    title: string;
    location: string;
    rating: number;
    price: number;
    currency?: string;
    period?: string;
    badge?: string;
    compact?: boolean;
}

export default function PropertyCard({
    image,
    title,
    location,
    rating,
    price,
    currency = "$",
    period = "night",
    badge,
    compact = false,
}: PropertyCardProps) {
    const [liked, setLiked] = useState(false);

    if (compact) {
        return (
            <div className="flex gap-4 bg-white rounded-2xl p-3 shadow-card hover:shadow-card-hover transition-shadow duration-200 group">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {badge && (
                        <div className="absolute top-1.5 left-1.5 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {badge}
                        </div>
                    )}
                </div>
                <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
                    <div>
                        <h3 className="font-semibold text-foreground text-sm truncate">
                            {title}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5">
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="#FF3859"
                                stroke="none"
                            >
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" fill="white" />
                            </svg>
                            <span className="text-xs text-text-secondary truncate">
                                {location}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="#272823"
                            >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            <span className="text-xs font-semibold">{rating}</span>
                        </div>
                        <div>
                            <span className="text-sm font-bold text-foreground">
                                {currency}{price}
                            </span>
                            <span className="text-xs text-text-secondary">/{period}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-shrink-0 w-60 lg:w-full group">
            <div className="relative rounded-2xl overflow-hidden mb-2.5 aspect-[4/3]">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Rating badge */}
                <div className="absolute top-3 left-3 badge-rating">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#272823">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span className="text-xs font-bold">{rating}</span>
                </div>
                {/* Favorite button */}
                <button
                    onClick={() => setLiked(!liked)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full
                     flex items-center justify-center hover:bg-white transition-all duration-200
                     hover:scale-110 active:scale-95"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={liked ? "#FF3859" : "none"}
                        stroke={liked ? "#FF3859" : "#272823"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>
                {/* Location badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-md rounded-full px-2.5 py-1">
                    <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="#FF3859"
                        stroke="none"
                    >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" fill="white" />
                    </svg>
                    <span className="text-[11px] font-medium text-foreground">
                        {location}
                    </span>
                </div>
            </div>
            <div className="px-0.5">
                <h3 className="font-semibold text-foreground text-sm truncate">
                    {title}
                </h3>
                <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xs text-text-secondary">Start from</span>
                    <span className="text-sm font-bold text-primary">
                        {currency}{price}
                    </span>
                    <span className="text-xs text-text-secondary">per {period}</span>
                </div>
            </div>
        </div>
    );
}
