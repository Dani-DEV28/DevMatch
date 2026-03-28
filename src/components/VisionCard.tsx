"use client";

import { useState } from "react";
import Link from "next/link";
import { insforge, type User } from "@/lib/insforge";
import {
  DOMAIN_INTERESTS,
  PROJECT_STATUS,
} from "@/lib/archetypes";
import { Heart, MessageCircle, ExternalLink, Sparkles } from "lucide-react";

interface VisionCardData {
  id: string;
  userId: string;
  title: string;
  description: string;
  domainTags: string[];

  status: string;
  createdAt: string;
  user: User;
  resonanceCount?: number;
  hasResonated?: boolean;
}

interface VisionCardProps {
  vision: VisionCardData;
  currentUserId?: string;
  onResonanceChange?: () => void;
}

export default function VisionCard({
  vision,
  currentUserId,
  onResonanceChange,
}: VisionCardProps) {
  const [hasResonated, setHasResonated] = useState(vision.hasResonated || false);
  const [resonanceCount, setResonanceCount] = useState(vision.resonanceCount || 0);
  const [isLoading, setIsLoading] = useState(false);

  const handleResonance = async () => {
    if (!currentUserId || isLoading) return;
    
    setIsLoading(true);
    try {
      if (hasResonated) {
        // Remove resonance
        await insforge.database
          .from("vision_resonances")
          .delete()
          .eq("vision_id", vision.id)
          .eq("user_id", currentUserId);
        setHasResonated(false);
        setResonanceCount((c) => c - 1);
      } else {
        // Add resonance
        await insforge.database.from("vision_resonances").insert({
          vision_id: vision.id,
          user_id: currentUserId,
        });
        setHasResonated(true);
        setResonanceCount((c) => c + 1);
      }
      onResonanceChange?.();
    } catch (err) {
      console.error("Failed to toggle resonance:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getDomainLabel = (id: string) => {
    const domain = DOMAIN_INTERESTS.find((d) => d.id === id);
    return domain?.label || id;
  };

  const getStatusLabel = (id: string) => {
    const status = PROJECT_STATUS.find((s) => s.id === id);
    return status?.label || id;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
      {/* Header with user info */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${vision.userId}`}>
              <img
                src={vision.user.avatar_url || "/default-avatar.png"}
                alt={vision.user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 hover:border-indigo-300 transition-colors"
              />
            </Link>
            <div>
              <Link
                href={`/profile/${vision.userId}`}
                className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
              >
                {vision.user.name}
              </Link>
            </div>
          </div>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
            {getStatusLabel(vision.status)}
          </span>
        </div>
      </div>

      {/* Vision content */}
      <div className="p-5">
        <div className="flex items-start gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
            {vision.title || "Untitled Vision"}
          </h3>
        </div>
        
        <p className="text-gray-600 mb-4 leading-relaxed">
          &ldquo;{vision.description}&rdquo;
        </p>

        {/* Domain tags */}
        {vision.domainTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {vision.domainTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg"
              >
                {getDomainLabel(tag)}
              </span>
            ))}
          </div>
        )}


      </div>

      {/* Actions */}
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleResonance}
            disabled={!currentUserId || isLoading}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              hasResonated
                ? "text-rose-600"
                : "text-gray-500 hover:text-rose-600"
            } ${!currentUserId ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Heart
              className={`w-4 h-4 ${hasResonated ? "fill-current" : ""}`}
            />
            <span>{resonanceCount}</span>
            <span className="hidden sm:inline">Resonates</span>
          </button>
          
          <button className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span>Connect</span>
          </button>
        </div>

        <Link
          href={`/profile/${vision.userId}`}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <span>View Profile</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
