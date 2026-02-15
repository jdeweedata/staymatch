"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BottomSheet } from "@/components/ui/BottomSheet";
import Button from "@/components/ui/Button";

interface ProfileHeaderProps {
  name: string | null;
  email: string;
  avatarUrl: string | null;
  memberSince: string;
  onUpdateName: (name: string) => Promise<void>;
}

export function ProfileHeader({
  name,
  email,
  avatarUrl,
  memberSince,
  onUpdateName,
}: ProfileHeaderProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(name || "");
  const [isSaving, setIsSaving] = useState(false);

  // Generate initials from name or email
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : email[0].toUpperCase();

  const displayName = name || "Traveler";

  // Format member since date
  const memberDate = new Date(memberSince);
  const memberSinceFormatted = memberDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handleSave = async () => {
    if (!editName.trim()) return;
    setIsSaving(true);
    try {
      await onUpdateName(editName.trim());
      setIsEditOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center border-2 border-white shadow-lg">
              <span className="text-2xl font-bold text-white">{initials}</span>
            </div>
          )}
        </motion.div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground truncate">
              {displayName}
            </h1>
            <button
              onClick={() => {
                setEditName(name || "");
                setIsEditOpen(true);
              }}
              className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
              aria-label="Edit name"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          </div>
          <p className="text-sm text-text-secondary truncate">{email}</p>
          <p className="text-xs text-text-tertiary mt-1">
            Member since {memberSinceFormatted}
          </p>
        </div>
      </div>

      {/* Edit Name Sheet */}
      <BottomSheet
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Name"
        snapPoints={[0.35]}
      >
        <div className="px-6 py-4 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Display Name
            </label>
            <input
              id="name"
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              maxLength={100}
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleSave}
              loading={isSaving}
              disabled={!editName.trim() || editName.trim() === name}
            >
              Save
            </Button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}

export default ProfileHeader;
