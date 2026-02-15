"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import BottomNav from "@/components/ui/BottomNav";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SwipeStats from "@/components/profile/SwipeStats";
import PreferencesSection from "@/components/profile/PreferencesSection";
import TagPicker from "@/components/ui/TagPicker";
import Button from "@/components/ui/Button";
import {
  DEAL_BREAKER_OPTIONS,
  DELIGHT_FACTOR_OPTIONS,
  type UserPreferences,
} from "@/lib/constants/preferences";

interface ProfileData {
  user: {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    preferences: UserPreferences | null;
    dealBreakers: string[];
    delightFactors: string[];
    memberSince: string;
  };
  stats: {
    totalSwipes: number;
    likes: number;
    dislikes: number;
    likeRatio: number;
    topLikedAmenities: string[];
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("account");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch profile data
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/profile");

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch profile");
        }

        setProfile(data);
      } catch (err) {
        console.error("Fetch profile error:", err);
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  // Show save message temporarily
  const showSaveMessage = useCallback((message: string) => {
    setSaveMessage(message);
    setTimeout(() => setSaveMessage(null), 2000);
  }, []);

  // Update profile helper
  const updateProfile = useCallback(async (updates: Record<string, unknown>) => {
    if (!profile) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      // Update local state
      setProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          user: { ...prev.user, ...data.user },
        };
      });

      showSaveMessage("Saved!");
    } catch (err) {
      console.error("Update profile error:", err);
      showSaveMessage("Failed to save");
    } finally {
      setIsSaving(false);
    }
  }, [profile, showSaveMessage]);

  // Handle name update
  const handleUpdateName = useCallback(async (name: string) => {
    await updateProfile({ name });
  }, [updateProfile]);

  // Handle deal-breakers update
  const handleUpdateDealBreakers = useCallback((dealBreakers: string[]) => {
    if (!profile) return;
    // Optimistic update
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        user: { ...prev.user, dealBreakers },
      };
    });
    updateProfile({ dealBreakers });
  }, [profile, updateProfile]);

  // Handle delight factors update
  const handleUpdateDelightFactors = useCallback((delightFactors: string[]) => {
    if (!profile) return;
    // Optimistic update
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        user: { ...prev.user, delightFactors },
      };
    });
    updateProfile({ delightFactors });
  }, [profile, updateProfile]);

  // Handle budget update
  const handleUpdateBudget = useCallback((budgetRange: string) => {
    if (!profile) return;
    const currentPrefs = profile.user.preferences || {};
    const newPrefs = { ...currentPrefs, budgetRange };

    // Optimistic update
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        user: { ...prev.user, preferences: newPrefs },
      };
    });
    updateProfile({ preferences: newPrefs });
  }, [profile, updateProfile]);

  // Handle star rating update
  const handleUpdateStarRating = useCallback((minStarRating: number) => {
    if (!profile) return;
    const currentPrefs = profile.user.preferences || {};
    const newPrefs = { ...currentPrefs, minStarRating };

    // Optimistic update
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        user: { ...prev.user, preferences: newPrefs },
      };
    });
    updateProfile({ preferences: newPrefs });
  }, [profile, updateProfile]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    if (!confirm("Are you sure you want to log out?")) return;

    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      setIsLoggingOut(false);
    }
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background pb-24 lg:pb-0">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-border/50">
          <div className="lg:hidden px-4 py-4">
            <div className="h-7 w-32 bg-muted animate-pulse rounded" />
          </div>
          <div className="hidden lg:block lg:ml-[220px]">
            <div className="max-w-2xl mx-auto px-8 py-4">
              <div className="h-8 w-40 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </header>
        <div className="lg:ml-[220px]">
          <div className="max-w-lg lg:max-w-2xl mx-auto px-4 lg:px-8 py-6 space-y-6">
            <div className="h-24 bg-muted animate-pulse rounded-xl" />
            <div className="h-48 bg-muted animate-pulse rounded-xl" />
            <div className="h-32 bg-muted animate-pulse rounded-xl" />
          </div>
        </div>
        <BottomNav activeId="account" onSelect={setActiveNav} />
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-background pb-24 lg:pb-0 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-red-500 mb-4">{error || "Something went wrong"}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary underline"
          >
            Try again
          </button>
        </div>
        <BottomNav activeId="account" onSelect={setActiveNav} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-24 lg:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-border/50">
        <div className="lg:hidden px-4 py-4">
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
        </div>
        <div className="hidden lg:block lg:ml-[220px]">
          <div className="max-w-2xl mx-auto px-8 py-4">
            <h1 className="text-2xl font-bold text-foreground">Profile</h1>
            <p className="text-sm text-muted-foreground">
              Manage your preferences
            </p>
          </div>
        </div>
      </header>

      {/* Save indicator */}
      {saveMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-foreground text-white text-sm font-medium rounded-full shadow-lg"
        >
          {saveMessage}
        </motion.div>
      )}

      <div className="lg:ml-[220px]">
        <div className="max-w-lg lg:max-w-2xl mx-auto px-4 lg:px-8 py-6 space-y-6">
          {/* Profile Header */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ProfileHeader
              name={profile.user.name}
              email={profile.user.email}
              avatarUrl={profile.user.avatarUrl}
              memberSince={profile.user.memberSince}
              onUpdateName={handleUpdateName}
            />
          </motion.section>

          {/* Match Insights */}
          <section>
            <SwipeStats
              totalSwipes={profile.stats.totalSwipes}
              likes={profile.stats.likes}
              dislikes={profile.stats.dislikes}
              likeRatio={profile.stats.likeRatio}
              topLikedAmenities={profile.stats.topLikedAmenities}
            />
          </section>

          {/* Deal-breakers */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-5 border border-border/50"
          >
            <TagPicker
              label="Deal-breakers"
              options={DEAL_BREAKER_OPTIONS}
              selected={profile.user.dealBreakers}
              onChange={handleUpdateDealBreakers}
              maxSelections={5}
            />
            <p className="text-xs text-text-tertiary mt-3">
              We&apos;ll avoid hotels with these issues
            </p>
          </motion.section>

          {/* Delight Factors */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 border border-border/50"
          >
            <TagPicker
              label="Delight factors"
              options={DELIGHT_FACTOR_OPTIONS}
              selected={profile.user.delightFactors}
              onChange={handleUpdateDelightFactors}
              maxSelections={5}
            />
            <p className="text-xs text-text-tertiary mt-3">
              We&apos;ll prioritize hotels with these features
            </p>
          </motion.section>

          {/* Travel Preferences */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl p-5 border border-border/50"
          >
            <h2 className="font-semibold text-foreground mb-4">Travel Preferences</h2>
            <PreferencesSection
              budgetRange={profile.user.preferences?.budgetRange}
              minStarRating={profile.user.preferences?.minStarRating}
              onUpdateBudget={handleUpdateBudget}
              onUpdateStarRating={handleUpdateStarRating}
              isSaving={isSaving}
            />
          </motion.section>

          {/* Account Actions */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3 pt-4"
          >
            <Button
              variant="secondary"
              fullWidth
              onClick={handleLogout}
              loading={isLoggingOut}
            >
              Log Out
            </Button>
            <p className="text-xs text-text-tertiary text-center">
              Version 1.0 • Made with ❤️ by StayMatch
            </p>
          </motion.section>
        </div>
      </div>

      <BottomNav activeId={activeNav} onSelect={setActiveNav} />
    </main>
  );
}
