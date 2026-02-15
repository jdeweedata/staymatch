"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    href: string;
}

interface BottomNavProps {
    activeId?: string;
    onSelect?: (id: string) => void;
}

const navItems: NavItem[] = [
    {
        id: "explore",
        label: "Explore",
        href: "/",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
            </svg>
        ),
    },
    {
        id: "booking",
        label: "Bookings",
        href: "/bookings",
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
        href: "/onboarding",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        ),
    },
    {
        id: "notifications",
        label: "Notification",
        href: "/",
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
        href: "/profile",
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
    const router = useRouter();

    const handleNavClick = (item: NavItem) => {
        onSelect?.(item.id);
        router.push(item.href);
    };
    return (
        <>
            {/* ─── Mobile: Bottom bar ─── */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-nav safe-bottom z-50 lg:hidden">
                <div className="max-w-lg mx-auto flex items-center justify-around py-2">
                    {navItems.map((item) => {
                        const isActive = item.id === activeId;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item)}
                                className={`
                  flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl
                  transition-all duration-200 min-w-[60px]
                  ${isActive ? "text-primary" : "text-text-tertiary hover:text-text-secondary"}
                `}
                            >
                                <div className={`transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
                                    {item.icon}
                                </div>
                                <span className={`text-[10px] font-medium ${isActive ? "font-semibold" : ""}`}>
                                    {item.label}
                                </span>
                                {isActive && <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* ─── Desktop: Left sidebar ─── */}
            <nav className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[220px] bg-white border-r border-border z-50 flex-col py-8 px-4">
                {/* Brand */}
                <div className="mb-10 px-3">
                    <Image
                        src="/staymatch_logo.svg"
                        alt="StayMatch"
                        width={140}
                        height={35}
                        className="h-8 w-auto"
                    />
                    <p className="text-xs text-text-secondary mt-2">Stop searching. Start matching.</p>
                </div>

                {/* Nav items */}
                <div className="flex flex-col gap-1 flex-1">
                    {navItems.map((item) => {
                        const isActive = item.id === activeId;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item)}
                                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl
                  transition-all duration-200 text-left w-full
                  ${isActive
                                        ? "bg-primary/10 text-primary font-semibold"
                                        : "text-text-secondary hover:bg-surface-secondary hover:text-foreground"
                                    }
                `}
                            >
                                {item.icon}
                                <span className="text-sm">{item.label}</span>
                                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                            </button>
                        );
                    })}
                </div>

                {/* Bottom profile */}
                <div className="border-t border-border pt-4 mt-4 px-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            S
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">StayMatch User</p>
                            <p className="text-xs text-text-secondary truncate">Premium Member</p>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
