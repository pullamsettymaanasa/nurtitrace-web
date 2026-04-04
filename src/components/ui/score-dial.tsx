"use client";

import { useEffect, useState } from "react";
import { getScoreColor, getScoreRiskLevel } from "@/lib/risk-helpers";

interface ScoreDialProps {
  score: number;
  size?: number;
}

export function ScoreDial({ score, size = 160 }: ScoreDialProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const colors = getScoreColor(score);
  const circumference = 2 * Math.PI * 65;
  const progress = (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 160 160" className="-rotate-90">
        {/* Background circle (dashed) */}
        <circle
          cx="80"
          cy="80"
          r="65"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="8"
          strokeDasharray="12 8"
        />
        {/* Progress circle */}
        <circle
          cx="80"
          cy="80"
          r="65"
          fill="none"
          stroke={colors.primary}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold" style={{ color: colors.dark }}>
          {animatedScore}
        </span>
        <span className="text-xs text-[var(--text-subtitle)] font-medium">/100</span>
      </div>
    </div>
  );
}
