"use client";

import React from "react";

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface BottomNavProps {
    activeId?: string;
    onSelect?: (id: string) => void;
}

const navItems: NavItem[] = [
    {
        id: "explore",
        label: "Explore",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
            </svg>
        ),
    },
    {
        id: "booking",
        label: "My Booking",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
        ),
    },
    {
        id: "match",
        label: "Match",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        ),
    },
    {
        id: "notifications",
        label: "Notification",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
        ),
    },
    {
        id: "account",
        label: "Account",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
    },
];

export default function BottomNav({
    activeId = "explore",
    onSelect,
}: BottomNavProps) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-nav safe-bottom z-50">
            <div className="max-w-lg mx-auto flex items-center justify-around py-2">
                {navItems.map((item) => {
                    const isActive = item.id === activeId;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelect?.(item.id)}
                            className={`
                flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl
                transition-all duration-200 min-w-[60px]
                ${isActive
                                    ? "text-primary"
                                    : "text-text-tertiary hover:text-text-secondary"
                                }
              `}
                        >
                            <div className={`transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
                                {item.icon}
                            </div>
                            <span className={`text-[10px] font-medium ${isActive ? "font-semibold" : ""}`}>
                                {item.label}
                            </span>
                            {isActive && (
                                <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
