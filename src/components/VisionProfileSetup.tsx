"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { insforge } from "@/lib/insforge";
import {
  DOMAIN_INTERESTS,
  BUILDER_PHILOSOPHIES,
  AI_WORKFLOWS,
  PROJECT_STATUS,
  ARCHETYPES,
  type DomainInterestId,
  type BuilderPhilosophyId,
  type AIWorkflowId,
  type ProjectStatusId,
  type ArchetypeType,
} from "@/lib/archetypes";
import { Sparkles, ArrowRight, ArrowLeft, Check } from "lucide-react";

interface VisionProfileSetupProps {
  userId: string;
  onComplete?: () => void;
}

export default function VisionProfileSetup({ userId, onComplete }: VisionProfileSetupProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    domainInterests: [] as DomainInterestId[],
    builderPhilosophy: "" as BuilderPhilosophyId | "",
    aiWorkflow: "" as AIWorkflowId | "",
    archetype: "" as ArchetypeType | "",
    dreamProject: "",
    projectStatus: "" as ProjectStatusId | "",
    lookingForRoles: [] as ArchetypeType[],
    experienceLevel: "" as "first-timer" | "intermediate" | "veteran" | "",
  });

  const toggleDomainInterest = (id: DomainInterestId) => {
    setFormData((prev) => ({
      ...prev,
      domainInterests: prev.domainInterests.includes(id)
        ? prev.domainInterests.filter((i) => i !== id)
        : [...prev.domainInterests, id],
    }));
  };

  const toggleLookingForRole = (role: ArchetypeType) => {
    setFormData((prev) => ({
      ...prev,
      lookingForRoles: prev.lookingForRoles.includes(role)
        ? prev.lookingForRoles.filter((r) => r !== role)
        : [...prev.lookingForRoles, role],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await insforge.database
        .from("users")
        .update({
          domain_interests: formData.domainInterests,
          builder_philosophy: formData.builderPhilosophy,
          ai_workflow: formData.aiWorkflow,
          archetype: formData.archetype,
          dream_project: formData.dreamProject,
          project_status: formData.projectStatus,
          looking_for_roles: formData.lookingForRoles,
          experience_level: formData.experienceLevel,
        })
        .eq("id", userId);

      if (error) throw error;

      onComplete?.();
      router.refresh();
    } catch (err) {
      console.error("Failed to save vision profile:", err);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.domainInterests.length > 0;
      case 2:
        return formData.builderPhilosophy && formData.aiWorkflow;
      case 3:
        return formData.archetype;
      case 4:
        return formData.dreamProject.length >= 20 && formData.projectStatus;
      case 5:
        return formData.experienceLevel;
      default:
        return true;
    }
  };

  const totalSteps = 5;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Define Your Vision</h2>
        </div>
        <p className="text-indigo-100">
          Help us find your perfect creative partner for the Agentic Era
        </p>
        
        {/* Progress */}
        <div className="mt-4 flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i < step ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-indigo-200 mt-2">Step {step} of {totalSteps}</p>
      </div>

      {/* Content */}
      <div className="p-6">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              What domains excite you?
            </h3>
            <p className="text-sm text-gray-500">
              Select the areas where you want to build. This helps us match you with people who share your passions.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {DOMAIN_INTERESTS.map((interest) => (
                <button
                  key={interest.id}
                  onClick={() => toggleDomainInterest(interest.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    formData.domainInterests.includes(interest.id)
                      ? "border-indigo-500 bg-indigo-50 text-indigo-900"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <span className="text-lg mr-2">{interest.label.split(" ")[0]}</span>
                  <span className="text-sm font-medium">
                    {interest.label.split(" ").slice(1).join(" ")}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                What&apos;s your builder philosophy?
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                How do you approach creating things?
              </p>
              <div className="space-y-3">
                {BUILDER_PHILOSOPHIES.map((philosophy) => (
                  <button
                    key={philosophy.id}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        builderPhilosophy: philosophy.id,
                      }))
                    }
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.builderPhilosophy === philosophy.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-gray-900">{philosophy.label}</div>
                    <div className="text-sm text-gray-500 mt-1">{philosophy.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                How do you work with AI?
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                In the Agentic Era, this matters more than your tech stack.
              </p>
              <div className="space-y-3">
                {AI_WORKFLOWS.map((workflow) => (
                  <button
                    key={workflow.id}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        aiWorkflow: workflow.id,
                      }))
                    }
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.aiWorkflow === workflow.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      <span className="mr-2">{workflow.icon}</span>
                      {workflow.label}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{workflow.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              What&apos;s your creative archetype?
            </h3>
            <p className="text-sm text-gray-500">
              This describes how you contribute to a team, not just what technologies you know.
            </p>
            <div className="grid gap-3">
              {Object.values(ARCHETYPES).map((archetype) => (
                <button
                  key={archetype.type}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      archetype: archetype.type,
                    }))
                  }
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.archetype === archetype.type
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${archetype.color} flex items-center justify-center text-2xl flex-shrink-0`}
                    >
                      {archetype.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{archetype.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{archetype.description}</div>
                      <div className="text-xs text-indigo-600 mt-2 font-medium">
                        💪 {archetype.superpower}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                What&apos;s your dream project?
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                If you had 48 hours and unlimited AI assistance, what would you build?
              </p>
              <textarea
                value={formData.dreamProject}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, dreamProject: e.target.value }))
                }
                placeholder="An AI-powered app that turns your running data into generative art - because fitness should feel creative..."
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 resize-none"
                rows={4}
                maxLength={280}
              />
              <p className="text-xs text-gray-400 mt-2 text-right">
                {formData.dreamProject.length}/280 characters
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                What&apos;s your current status?
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Help others understand how you want to collaborate.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {PROJECT_STATUS.map((status) => (
                  <button
                    key={status.id}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        projectStatus: status.id,
                      }))
                    }
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.projectStatus === status.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-gray-900">{status.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{status.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                What roles are you looking for?
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Select the archetypes that would complement your vision.
              </p>
              <div className="grid gap-2">
                {Object.values(ARCHETYPES).map((archetype) => (
                  <button
                    key={archetype.type}
                    onClick={() => toggleLookingForRole(archetype.type)}
                    className={`p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                      formData.lookingForRoles.includes(archetype.type)
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-xl">{archetype.emoji}</span>
                    <span className="font-medium text-gray-900">{archetype.title}</span>
                    {formData.lookingForRoles.includes(archetype.type) && (
                      <Check className="w-5 h-5 text-indigo-600 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                What&apos;s your experience level?
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "first-timer", label: "🌱 First-timer", desc: "New to hackathons" },
                  { id: "intermediate", label: "⚡ Intermediate", desc: "Some experience" },
                  { id: "veteran", label: "🏆 Veteran", desc: "Done this many times" },
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        experienceLevel: level.id as typeof formData.experienceLevel,
                      }))
                    }
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      formData.experienceLevel === level.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-gray-900">{level.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{level.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-100 flex justify-between">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {step < totalSteps ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed() || isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? "Saving..." : "Complete Profile"}
            <Sparkles className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
