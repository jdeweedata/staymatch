"use client";

import React from "react";

interface Category {
    id: string;
    label: string;
    image: string;
}

interface CategoryPillProps {
    categories: Category[];
    activeId?: string;
    onSelect?: (id: string) => void;
}

export default function CategoryPill({
    categories,
    activeId,
    onSelect,
}: CategoryPillProps) {
    return (
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onSelect?.(cat.id)}
                    className={`
            flex flex-col items-center gap-2 flex-shrink-0
            transition-all duration-200 group
          `}
                >
                    <div
                        className={`
              w-16 h-16 rounded-2xl overflow-hidden ring-2 transition-all duration-200
              ${activeId === cat.id
                                ? "ring-primary ring-offset-2"
                                : "ring-transparent hover:ring-border"
                            }
            `}
                    >
                        <img
                            src={cat.image}
                            alt={cat.label}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span
                        className={`
              text-xs font-medium transition-colors
              ${activeId === cat.id ? "text-primary" : "text-text-secondary"}
            `}
                    >
                        {cat.label}
                    </span>
                </button>
            ))}
        </div>
    );
}
