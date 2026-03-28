"use client";

import { useEffect, useState } from "react";
import { insforge } from "@/lib/insforge";
import { Zap, BookOpen, Users, Hammer, Brain, CheckCircle } from "lucide-react";

interface TasteProfile {
  builder_archetype: string;
  velocity_style: string;
  documentation_taste: string;
  collaboration_style: string;
  code_aesthetic: string;
  taste_signals: {
    velocity_score: number;
    readme_score: number;
    collaboration_score: number;
    builder_score: number;
    curiosity_score: number;
    completion_score: number;
    curiosity_areas: string[];
  };
}

interface DigitalDNAProps {
  userId: string;
}

const SIGNAL_CONFIG = {
  velocity: {
    icon: Zap,
    label: "Velocity",
    description: {
      sprinter: "Bursts of intense activity",
      marathoner: "Steady, long-term focus",
      consistent: "Regular, predictable pace",
      sporadic: "Variable activity patterns",
    },
    color: "from-amber-400 to-orange-500",
  },
  readme: {
    icon: BookOpen,
    label: "Documentation",
    description: {
      minimal: "Just the essentials",
      functional: "Clear and practical",
      polished: "Well-crafted docs",
      visionary: "Inspiring narratives",
    },
    color: "from-blue-400 to-indigo-500",
  },
  collaboration: {
    icon: Users,
    label: "Collaboration",
    description: {
      solo: "Independent worker",
      responsive: "Team-friendly",
      mentor: "Guides others",
      leader: "Drives collaboration",
    },
    color: "from-emerald-400 to-teal-500",
  },
  builder: {
    icon: Hammer,
    label: "Builder Style",
    description: {
      hacker: "Move fast, break things",
      craftsman: "Quality-focused",
      architect: "Systems thinker",
      perfectionist: "Polish everything",
    },
    color: "from-purple-400 to-pink-500",
  },
  completion: {
    icon: CheckCircle,
    label: "Completion",
    description: {
      abandoner: "Many experiments",
      "mvp-shipper": "Ships MVPs",
      maintainer: "Keeps projects alive",
      polisher: "Perfects releases",
    },
    color: "from-rose-400 to-red-500",
  },
  curiosity: {
    icon: Brain,
    label: "Curiosity",
    description: {},
    color: "from-cyan-400 to-blue-500",
  },
};

export default function DigitalDNA({ userId }: DigitalDNAProps) {
  const [profile, setProfile] = useState<TasteProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const { data } = await insforge.database
        .from("user_taste_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.error("Failed to load taste profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeBehavior = async () => {
    setLoading(true);
    try {
      // Get user's github_id first
      const { data: user } = await insforge.database
        .from("users")
        .select("github_id")
        .eq("id", userId)
        .single();

      if (user?.github_id) {
        const res = await fetch("/api/analyze-github-behavior", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ github_id: user.github_id }),
        });

        if (res.ok) {
          await loadProfile();
        }
      }
    } catch (err) {
      console.error("Failed to analyze behavior:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital DNA</h3>
        <p className="text-sm text-gray-500 mb-4">
          Analyze your GitHub behavior to reveal your builder archetype and working style.
        </p>
        <button
          onClick={analyzeBehavior}
          className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Analyze My GitHub Behavior
        </button>
      </div>
    );
  }

  const signals = profile.taste_signals;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Digital DNA</h3>
          <p className="text-xs text-gray-500">Behavioral signals from your GitHub activity</p>
        </div>
        <button
          onClick={analyzeBehavior}
          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Refresh
        </button>
      </div>

      {/* Signal Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Velocity */}
        <SignalCard
          config={SIGNAL_CONFIG.velocity}
          value={profile.velocity_style}
          score={signals.velocity_score}
        />

        {/* README Quality */}
        <SignalCard
          config={SIGNAL_CONFIG.readme}
          value={profile.documentation_taste}
          score={signals.readme_score}
        />

        {/* Collaboration */}
        <SignalCard
          config={SIGNAL_CONFIG.collaboration}
          value={profile.collaboration_style}
          score={signals.collaboration_score}
        />

        {/* Builder Philosophy */}
        <SignalCard
          config={SIGNAL_CONFIG.builder}
          value={profile.builder_archetype}
          score={signals.builder_score}
        />
      </div>

      {/* Completion Tendency */}
      <div className="mb-4">
        <SignalCard
          config={SIGNAL_CONFIG.completion}
          value={profile.code_aesthetic}
          score={signals.completion_score}
          fullWidth
        />
      </div>

      {/* Curiosity Areas */}
      {signals.curiosity_areas.length > 0 && (
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-cyan-500" />
            <span className="text-sm font-medium text-gray-700">Curiosity Areas</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {signals.curiosity_areas.map((area) => (
              <span
                key={area}
                className="px-2 py-0.5 bg-cyan-50 text-cyan-700 text-xs rounded-full"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface SignalCardProps {
  config: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    description: Record<string, string>;
    color: string;
  };
  value: string;
  score: number;
  fullWidth?: boolean;
}

function SignalCard({ config, value, score, fullWidth }: SignalCardProps) {
  const Icon = config.icon;
  const description = config.description[value as keyof typeof config.description] || value;

  return (
    <div
      className={`p-3 rounded-xl border border-gray-100 bg-gray-50 ${
        fullWidth ? "col-span-2" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        <div className={`p-1.5 rounded-lg bg-gradient-to-br ${config.color}`}>
          <Icon className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">{config.label}</span>
            <span className="text-xs font-bold text-gray-700">{Math.round(score)}%</span>
          </div>
          <p className="text-sm font-semibold text-gray-900 capitalize mt-0.5 truncate">
            {value.replace(/-/g, " ")}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
      {/* Progress bar */}
      <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${config.color} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
