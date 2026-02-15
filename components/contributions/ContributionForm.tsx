"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ContributionFormData {
    wifiDownload: number | null;
    wifiUpload: number | null;
    wifiPing: number | null;
    wifiFloor: string;
    noiseLevel: number | null;
    hotWaterReliable: boolean | null;
    blackoutCurtains: boolean | null;
    quietAtNight: boolean | null;
    acWorksWell: boolean | null;
    workDeskPresent: boolean | null;
    overallRating: number | null;
    additionalNotes: string;
}

interface ContributionFormProps {
    bookingId: string;
    hotelName: string;
    onSubmit: (data: ContributionFormData) => Promise<void>;
    className?: string;
}

const NOISE_LABELS = [
    { value: 1, label: "Silent", emoji: "🤫" },
    { value: 2, label: "Quiet", emoji: "😌" },
    { value: 3, label: "Moderate", emoji: "😐" },
    { value: 4, label: "Noisy", emoji: "😣" },
    { value: 5, label: "Very Loud", emoji: "🔊" },
];

const RATING_LABELS = [
    { value: 1, label: "Poor" },
    { value: 2, label: "Fair" },
    { value: 3, label: "Good" },
    { value: 4, label: "Great" },
    { value: 5, label: "Excellent" },
];

const AMENITY_CHECKS = [
    { key: "hotWaterReliable" as const, label: "Reliable Hot Water", icon: "🚿" },
    { key: "blackoutCurtains" as const, label: "Blackout Curtains", icon: "🌙" },
    { key: "quietAtNight" as const, label: "Quiet at Night", icon: "🤫" },
    { key: "acWorksWell" as const, label: "AC Works Well", icon: "❄️" },
    { key: "workDeskPresent" as const, label: "Good Work Desk", icon: "💻" },
];

type AmenityKey = typeof AMENITY_CHECKS[number]["key"];

const initialData: ContributionFormData = {
    wifiDownload: null,
    wifiUpload: null,
    wifiPing: null,
    wifiFloor: "",
    noiseLevel: null,
    hotWaterReliable: null,
    blackoutCurtains: null,
    quietAtNight: null,
    acWorksWell: null,
    workDeskPresent: null,
    overallRating: null,
    additionalNotes: "",
};

export function ContributionForm({
    hotelName,
    onSubmit,
    className,
}: ContributionFormProps) {
    const [formData, setFormData] = useState<ContributionFormData>(initialData);
    const [step, setStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const steps = [
        { title: "WiFi Speed", subtitle: "Help remote workers find reliable internet" },
        { title: "Noise & Comfort", subtitle: "Rate the sleeping environment" },
        { title: "Amenities", subtitle: "Verify what's actually there" },
        { title: "Overall Rating", subtitle: "Your final verdict" },
    ];

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } finally {
            setIsSubmitting(false);
        }
    };

    const setAmenity = (key: AmenityKey, value: boolean | null) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const canProceed = () => {
        switch (step) {
            case 0: return true; // WiFi is optional
            case 1: return true; // Noise is optional
            case 2: return true; // Amenities are optional
            case 3: return formData.overallRating !== null;
            default: return true;
        }
    };

    return (
        <div className={cn("max-w-lg mx-auto", className)}>
            {/* Progress bar */}
            <div className="flex gap-1.5 mb-8">
                {steps.map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-1 rounded-full flex-1 transition-colors duration-300",
                            i <= step ? "bg-primary" : "bg-muted"
                        )}
                    />
                ))}
            </div>

            {/* Step header */}
            <motion.div
                key={`header-${step}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">
                    Step {step + 1} of {steps.length}
                </p>
                <h2 className="font-display text-2xl font-bold text-foreground">
                    {steps[step].title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    {steps[step].subtitle}
                </p>
            </motion.div>

            {/* Step content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`step-${step}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="min-h-[280px]"
                >
                    {step === 0 && (
                        <div className="space-y-5">
                            <p className="text-sm text-muted-foreground">
                                Run a speed test at{" "}
                                <a
                                    href="https://fast.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline"
                                >
                                    fast.com
                                </a>
                                {" "}and enter your results:
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-foreground mb-1.5">
                                        Download (Mbps)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        placeholder="e.g. 50"
                                        value={formData.wifiDownload ?? ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                wifiDownload: e.target.value ? parseFloat(e.target.value) : null,
                                            }))
                                        }
                                        className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-foreground mb-1.5">
                                        Upload (Mbps)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        placeholder="e.g. 20"
                                        value={formData.wifiUpload ?? ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                wifiUpload: e.target.value ? parseFloat(e.target.value) : null,
                                            }))
                                        }
                                        className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-foreground mb-1.5">
                                    Which floor were you on? (optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. 3rd floor"
                                    value={formData.wifiFloor}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, wifiFloor: e.target.value }))
                                    }
                                    className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-medium text-foreground mb-3">
                                    How noisy was it at night?
                                </label>
                                <div className="flex gap-2">
                                    {NOISE_LABELS.map((level) => (
                                        <button
                                            key={level.value}
                                            onClick={() =>
                                                setFormData((prev) => ({ ...prev, noiseLevel: level.value }))
                                            }
                                            className={cn(
                                                "flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200",
                                                formData.noiseLevel === level.value
                                                    ? "border-primary bg-primary/5 scale-105"
                                                    : "border-border bg-muted hover:border-primary/30"
                                            )}
                                        >
                                            <span className="text-xl">{level.emoji}</span>
                                            <span className="text-[10px] font-medium text-foreground">
                                                {level.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-3">
                            {AMENITY_CHECKS.map((amenity) => {
                                const value = formData[amenity.key];
                                return (
                                    <div
                                        key={amenity.key}
                                        className="flex items-center justify-between bg-muted rounded-xl p-3.5"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-lg">{amenity.icon}</span>
                                            <span className="text-sm font-medium text-foreground">
                                                {amenity.label}
                                            </span>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <button
                                                onClick={() => setAmenity(amenity.key, value === true ? null : true)}
                                                className={cn(
                                                    "px-3 py-1 rounded-lg text-xs font-semibold transition-all",
                                                    value === true
                                                        ? "bg-emerald-500 text-white"
                                                        : "bg-background border border-border text-muted-foreground hover:border-emerald-300"
                                                )}
                                            >
                                                Yes
                                            </button>
                                            <button
                                                onClick={() => setAmenity(amenity.key, value === false ? null : false)}
                                                className={cn(
                                                    "px-3 py-1 rounded-lg text-xs font-semibold transition-all",
                                                    value === false
                                                        ? "bg-red-500 text-white"
                                                        : "bg-background border border-border text-muted-foreground hover:border-red-300"
                                                )}
                                            >
                                                No
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-medium text-foreground mb-3">
                                    Overall, how was your stay at {hotelName}?
                                </label>
                                <div className="flex gap-2 justify-center">
                                    {RATING_LABELS.map((rating) => (
                                        <button
                                            key={rating.value}
                                            onClick={() =>
                                                setFormData((prev) => ({ ...prev, overallRating: rating.value }))
                                            }
                                            className={cn(
                                                "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 min-w-[60px]",
                                                formData.overallRating === rating.value
                                                    ? "border-primary bg-primary/5 scale-105"
                                                    : "border-border bg-muted hover:border-primary/30"
                                            )}
                                        >
                                            <span className="text-2xl font-bold text-foreground">
                                                {rating.value}
                                            </span>
                                            <span className="text-[10px] font-medium text-muted-foreground">
                                                {rating.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-foreground mb-1.5">
                                    Anything else? (optional)
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Share any tips for future guests..."
                                    value={formData.additionalNotes}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, additionalNotes: e.target.value }))
                                    }
                                    className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                                />
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex gap-3 mt-8">
                {step > 0 && (
                    <button
                        onClick={() => setStep((s) => s - 1)}
                        className="flex-1 py-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                    >
                        Back
                    </button>
                )}

                {step < steps.length - 1 ? (
                    <button
                        onClick={() => setStep((s) => s + 1)}
                        disabled={!canProceed()}
                        className={cn(
                            "flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all",
                            canProceed()
                                ? "bg-primary hover:bg-primary/90 active:scale-[0.98]"
                                : "bg-primary/40 cursor-not-allowed"
                        )}
                    >
                        Continue
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={!canProceed() || isSubmitting}
                        className={cn(
                            "flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all",
                            canProceed() && !isSubmitting
                                ? "bg-primary hover:bg-primary/90 active:scale-[0.98]"
                                : "bg-primary/40 cursor-not-allowed"
                        )}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                                </svg>
                                Submitting...
                            </span>
                        ) : (
                            "Submit & Earn Discount"
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

export default ContributionForm;
