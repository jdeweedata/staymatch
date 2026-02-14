"use client";

import React from "react";

interface SearchBarProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
}

export default function SearchBar({
    placeholder = "Where do you want to stay?",
    value,
    onChange,
}: SearchBarProps) {
    return (
        <div className="relative w-full">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#B0B0B0"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
            </div>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className="w-full bg-surface-secondary border border-transparent rounded-2xl
                   pl-12 pr-4 py-4 text-base text-foreground
                   placeholder:text-text-tertiary
                   focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/20
                   transition-all duration-200"
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
                <button className="p-2 bg-primary rounded-xl text-white hover:bg-primary-hover transition-colors">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="4" x2="4" y1="21" y2="14" />
                        <line x1="4" x2="4" y1="10" y2="3" />
                        <line x1="12" x2="12" y1="21" y2="12" />
                        <line x1="12" x2="12" y1="8" y2="3" />
                        <line x1="20" x2="20" y1="21" y2="16" />
                        <line x1="20" x2="20" y1="12" y2="3" />
                        <line x1="2" x2="6" y1="14" y2="14" />
                        <line x1="10" x2="14" y1="8" y2="8" />
                        <line x1="18" x2="22" y1="16" y2="16" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
