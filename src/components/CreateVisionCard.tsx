"use client";

import { useState } from "react";
import { insforge } from "@/lib/insforge";
import {
  DOMAIN_INTERESTS,
  type DomainInterestId,
  ARCHETYPES,
  type ArchetypeType,
  PROJECT_STATUS,
  type ProjectStatusId,
} from "@/lib/archetypes";
import { Sparkles, Plus, X } from "lucide-react";

interface CreateVisionCardProps {
  userId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateVisionCard({ userId, onSuccess, onCancel }: CreateVisionCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    domainTags: [] as DomainInterestId[],
    lookingForArchetypes: [] as ArchetypeType[],
    status: "has-idea" as ProjectStatusId,
  });

  const toggleDomainTag = (id: DomainInterestId) => {
    setFormData((prev) => ({
      ...prev,
      domainTags: prev.domainTags.includes(id)
        ? prev.domainTags.filter((t) => t !== id)
        : [...prev.domainTags, id],
    }));
  };

  const toggleArchetype = (type: ArchetypeType) => {
    setFormData((prev) => ({
      ...prev,
      lookingForArchetypes: prev.lookingForArchetypes.includes(type)
        ? prev.lookingForArchetypes.filter((t) => t !== type)
        : [...prev.lookingForArchetypes, type],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description.length < 20) {
      alert("Please write a bit more about your vision (at least 20 characters)");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await insforge.database.from("project_visions").insert({
        user_id: userId,
        title: formData.title || null,
        description: formData.description,
        domain_tags: formData.domainTags,
        looking_for_archetypes: formData.lookingForArchetypes,
        status: formData.status,
      });

      if (error) throw error;

      onSuccess?.();
    } catch (err) {
      console.error("Failed to create vision:", err);
      alert("Failed to create vision. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          <h2 className="text-xl font-bold">Share Your Vision</h2>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Title <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., AI-Powered Running Art Generator"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0"
            maxLength={100}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe Your Vision *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="What do you want to build? Why does it matter? What would make it magical?"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 resize-none"
            rows={4}
            maxLength={280}
            required
          />
          <p className="text-xs text-gray-400 mt-1 text-right">
            {formData.description.length}/280 characters
          </p>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Status
          </label>
          <div className="grid grid-cols-2 gap-3">
            {PROJECT_STATUS.map((status) => (
              <button
                key={status.id}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, status: status.id }))}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  formData.status === status.id
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-medium text-gray-900 text-sm">{status.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{status.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Domain Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Domain / Interest Areas
          </label>
          <div className="flex flex-wrap gap-2">
            {DOMAIN_INTERESTS.map((interest) => (
              <button
                key={interest.id}
                type="button"
                onClick={() => toggleDomainTag(interest.id)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  formData.domainTags.includes(interest.id)
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {interest.label}
              </button>
            ))}
          </div>
        </div>

        {/* Looking For */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Who are you looking for?
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Select the creative archetypes that would complement your vision
          </p>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(ARCHETYPES).map((archetype) => (
              <button
                key={archetype.type}
                type="button"
                onClick={() => toggleArchetype(archetype.type)}
                className={`p-3 rounded-xl border-2 text-left transition-all flex items-center gap-2 ${
                  formData.lookingForArchetypes.includes(archetype.type)
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-xl">{archetype.emoji}</span>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{archetype.title}</div>
                  <div className="text-xs text-gray-500">{archetype.superpower}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || formData.description.length < 20}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              "Sharing..."
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Share Vision
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
