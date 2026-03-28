"use client";

import { useState } from "react";
import { insforge } from "@/lib/insforge";
import { Sparkles, ArrowRight, RefreshCw } from "lucide-react";

interface VibeCheckProps {
  userId: string;
  onComplete?: () => void;
}

interface VibeQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    label: string;
    emoji: string;
    reveals: string;
  }[];
}

const VIBE_QUESTIONS: VibeQuestion[] = [
  {
    id: "boring-problem",
    question: "What's one 'boring' problem you think is actually exciting?",
    options: [
      { id: "data-pipeline", label: "Data pipelines and ETL", emoji: "📊", reveals: "Systems thinker" },
      { id: "documentation", label: "Documentation and DX", emoji: "📝", reveals: "Developer advocate" },
      { id: "testing", label: "Testing infrastructure", emoji: "🧪", reveals: "Quality focused" },
      { id: "deployment", label: "Deployment automation", emoji: "🚀", reveals: "DevOps mindset" },
    ],
  },
  {
    id: "team-role",
    question: "In a team, would you rather be the person who...",
    options: [
      { id: "breaks", label: "Breaks things to move fast", emoji: "💥", reveals: "High velocity" },
      { id: "protects", label: "Ensures nothing ever breaks", emoji: "🛡️", reveals: "Risk averse" },
      { id: "designs", label: "Designs the architecture", emoji: "🏗️", reveals: "Systems thinker" },
      { id: "connects", label: "Connects people and ideas", emoji: "🔗", reveals: "Collaborator" },
    ],
  },
  {
    id: "time-horizon",
    question: "If you had to choose:",
    options: [
      { id: "ship-week", label: "Ship something good this week", emoji: "⚡", reveals: "Ship fast" },
      { id: "ship-months", label: "Ship something great in 3 months", emoji: "✨", reveals: "Polish focused" },
      { id: "experiment", label: "Experiment without shipping", emoji: "🔬", reveals: "Explorer" },
      { id: "iterate", label: "Iterate publicly with users", emoji: "🔄", reveals: "User-centric" },
    ],
  },
  {
    id: "overhyped-tech",
    question: "What's a technology you think is overhyped, and why?",
    options: [
      { id: "blockchain", label: "Blockchain (solution looking for problems)", emoji: "⛓️", reveals: "Pragmatic" },
      { id: "ai-everything", label: "AI in everything (not always needed)", emoji: "🤖", reveals: "Skeptical" },
      { id: "microservices", label: "Microservices (overengineering)", emoji: "🔧", reveals: "Simple-first" },
      { id: "new-frameworks", label: "New frameworks (churn fatigue)", emoji: "📦", reveals: "Stability-focused" },
    ],
  },
  {
    id: "collaboration-style",
    question: "Describe your ideal collaboration in 3 words:",
    options: [
      { id: "async-focused", label: "Async, focused, deep", emoji: "🧘", reveals: "Deep worker" },
      { id: "fast-fun", label: "Fast, fun, energetic", emoji: "⚡", reveals: "High energy" },
      { id: "thoughtful-kind", label: "Thoughtful, kind, patient", emoji: "💝", reveals: "Supportive" },
      { id: "ambitious-challenging", label: "Ambitious, challenging, growth", emoji: "🚀", reveals: "Growth mindset" },
    ],
  },
];

export default function VibeCheck({ userId, onComplete }: VibeCheckProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const question = VIBE_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / VIBE_QUESTIONS.length) * 100;

  const handleAnswer = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
  };

  const handleNext = () => {
    if (currentQuestion < VIBE_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      submitAnswers();
    }
  };

  const submitAnswers = async () => {
    setIsSubmitting(true);
    try {
      // Store vibe check responses
      const { error } = await insforge.database.from("vibe_check_responses").upsert({
        user_id: userId,
        responses: answers,
        completed_at: new Date().toISOString(),
      }, {
        onConflict: "user_id",
      });

      if (error) throw error;

      setIsComplete(true);
      onComplete?.();
    } catch (err) {
      console.error("Failed to save vibe check:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 text-center border border-indigo-100">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Vibe Check Complete!</h3>
        <p className="text-gray-600 mb-6">
          Your responses help us find developers who share your mindset and values.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Retake
          </button>
        </div>
      </div>
    );
  }

  const selectedAnswer = answers[question.id];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-6 h-6" />
          <h2 className="text-xl font-bold">Vibe Check</h2>
        </div>
        
        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-medium">
            {currentQuestion + 1}/{VIBE_QUESTIONS.length}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(option.id)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                selectedAnswer === option.id
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{option.emoji}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{option.label}</p>
                  {selectedAnswer === option.id && (
                    <p className="text-xs text-indigo-600 mt-1">
                      Reveals: {option.reveals}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!selectedAnswer || isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {currentQuestion === VIBE_QUESTIONS.length - 1 ? (
              isSubmitting ? "Saving..." : "Complete"
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
