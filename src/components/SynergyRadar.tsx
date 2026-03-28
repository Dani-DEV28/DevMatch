"use client";

import { useMemo } from "react";

interface RadarData {
  visionary: number; // 0-100
  pragmatic: number; // 0-100 (inverse of visionary)
  velocity: number; // 0-100 (high velocity)
  polish: number; // 0-100 (high polish)
  collaborative: number; // 0-100
  independent: number; // 0-100 (inverse of collaborative)
}

interface SynergyRadarProps {
  userData: RadarData;
  matchData?: RadarData;
  size?: number;
}

export default function SynergyRadar({
  userData,
  matchData,
  size = 280,
}: SynergyRadarProps) {
  const center = size / 2;
  const radius = (size / 2) - 40;

  // Calculate points for radar polygon
  const getPoint = (value: number, angle: number) => {
    const radian = (angle - 90) * (Math.PI / 180);
    const distance = (value / 100) * radius;
    return {
      x: center + distance * Math.cos(radian),
      y: center + distance * Math.sin(radian),
    };
  };

  // Define axes
  const axes = [
    { key: "visionary" as const, label: "Visionary", angle: 0 },
    { key: "velocity" as const, label: "Velocity", angle: 60 },
    { key: "collaborative" as const, label: "Collaborative", angle: 120 },
    { key: "pragmatic" as const, label: "Pragmatic", angle: 180 },
    { key: "polish" as const, label: "Polish", angle: 240 },
    { key: "independent" as const, label: "Independent", angle: 300 },
  ];

  // Generate polygon points
  const userPoints = axes.map((axis) =>
    getPoint(userData[axis.key], axis.angle)
  );
  const userPath = userPoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ") + " Z";

  const matchPoints = matchData
    ? axes.map((axis) => getPoint(matchData[axis.key], axis.angle))
    : null;
  const matchPath = matchPoints
    ? matchPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z"
    : "";

  // Calculate compatibility score
  const compatibilityScore = useMemo(() => {
    if (!matchData) return null;

    // Complementary scoring
    let score = 0;
    
    // Visionary + Pragmatic = good
    const visionDiff = Math.abs(userData.visionary - matchData.pragmatic);
    if (visionDiff < 30) score += 20;
    
    // High velocity + High polish = conflict
    const velocityMatch = Math.abs(userData.velocity - matchData.velocity);
    if (velocityMatch < 20) score += 15;
    else score -= 10;
    
    // Collaborative match
    const collabMatch = Math.abs(userData.collaborative - matchData.collaborative);
    if (collabMatch < 30) score += 15;
    
    // Overall shape similarity (complementary)
    const differences = axes.map((axis) =>
      Math.abs(userData[axis.key] - matchData[axis.key])
    );
    const avgDiff = differences.reduce((a, b) => a + b, 0) / differences.length;
    score += (100 - avgDiff) * 0.5;

    return Math.round(Math.max(0, Math.min(100, score)));
  }, [userData, matchData]);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background grid */}
        {[20, 40, 60, 80, 100].map((level) => {
          const points = axes.map((axis) =>
            getPoint(level, axis.angle)
          );
          const path = points
            .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
            .join(" ") + " Z";
          return (
            <polygon
              key={level}
              points={path.replace(/M|L|Z/g, "")}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={1}
              strokeDasharray={level === 50 ? "4 4" : undefined}
            />
          );
        })}

        {/* Axis lines */}
        {axes.map((axis) => {
          const end = getPoint(100, axis.angle);
          return (
            <line
              key={axis.key}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
          );
        })}

        {/* Labels */}
        {axes.map((axis) => {
          const pos = getPoint(115, axis.angle);
          return (
            <text
              key={axis.key}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-medium fill-gray-600"
            >
              {axis.label}
            </text>
          );
        })}

        {/* Match data (if present) */}
        {matchData && (
          <polygon
            points={matchPath.replace(/M|L|Z/g, "")}
            fill="rgba(99, 102, 241, 0.1)"
            stroke="#6366f1"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        )}

        {/* User data */}
        <polygon
          points={userPath.replace(/M|L|Z/g, "")}
          fill="rgba(139, 92, 246, 0.2)"
          stroke="#8b5cf6"
          strokeWidth={2}
        />

        {/* Data points */}
        {userPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill="#8b5cf6"
            stroke="white"
            strokeWidth={2}
          />
        ))}

        {/* Match points (if present) */}
        {matchPoints?.map((p, i) => (
          <circle
            key={`match-${i}`}
            cx={p.x}
            cy={p.y}
            r={3}
            fill="#6366f1"
            stroke="white"
            strokeWidth={2}
          />
        ))}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-sm text-gray-600">You</span>
        </div>
        {matchData && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Them</span>
          </div>
        )}
      </div>

      {/* Compatibility Score */}
      {compatibilityScore !== null && (
        <div className="mt-4 text-center">
          <div className="text-3xl font-bold text-indigo-600">
            {compatibilityScore}%
          </div>
          <div className="text-sm text-gray-500">Synergy Score</div>
          <p className="text-xs text-gray-400 mt-1">
            {compatibilityScore >= 80
              ? "Highly complementary!"
              : compatibilityScore >= 60
              ? "Good potential match"
              : "Different approaches"}
          </p>
        </div>
      )}
    </div>
  );
}

// Helper to convert taste profile to radar data
export function tasteProfileToRadarData(tasteProfile: {
  velocity_style: string;
  documentation_taste: string;
  collaboration_style: string;
  builder_archetype: string;
  code_aesthetic: string;
  taste_signals: {
    velocity_score: number;
    readme_score: number;
    collaboration_score: number;
    builder_score: number;
    curiosity_score: number;
    completion_score: number;
  };
}): RadarData {
  const signals = tasteProfile.taste_signals;

  return {
    // Visionary vs Pragmatic based on builder archetype and curiosity
    visionary: tasteProfile.builder_archetype === "hacker" || tasteProfile.builder_archetype === "perfectionist"
      ? 70 + signals.curiosity_score * 0.3
      : 40 + signals.curiosity_score * 0.3,
    pragmatic: tasteProfile.builder_archetype === "architect" || tasteProfile.builder_archetype === "craftsman"
      ? 70 + signals.completion_score * 0.3
      : 40 + signals.completion_score * 0.3,

    // Velocity based on commit patterns
    velocity: signals.velocity_score,
    polish: signals.readme_score,

    // Collaboration based on style
    collaborative: signals.collaboration_score,
    independent: 100 - signals.collaboration_score,
  };
}
