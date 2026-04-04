"use client";

import { useState } from "react";
import { ArrowRight, Scale, CheckCircle2, Circle } from "lucide-react";
import { RiskBadge } from "@/components/ui/risk-badge";
import { getScoreColor } from "@/lib/risk-helpers";
import type { CompareResult } from "@/types";

interface ComparisonResultProps {
  comparison: CompareResult;
  onChoose: (choice: "A" | "B") => void;
}

export function ComparisonResult({
  comparison,
  onChoose,
}: ComparisonResultProps) {
  const [selected, setSelected] = useState<"A" | "B" | null>(null);

  const { product_a, product_b, recommendation, summary } = comparison;
  const scoreA = product_a.score;
  const scoreB = product_b.score;

  // Override recommendation logic matching mobile app exactly
  const scoreDiff = Math.abs(scoreA - scoreB);
  const effectiveRecommendation =
    scoreDiff > 5 &&
    (recommendation === "EQUAL" || recommendation === "NEITHER")
      ? scoreA > scoreB
        ? "A"
        : "B"
      : recommendation;

  const isEqual =
    effectiveRecommendation === "EQUAL" ||
    effectiveRecommendation === "NEITHER";
  const winnerIsA = effectiveRecommendation === "A";

  // Recommendation title
  const recommendationTitle = isEqual
    ? "Similar Products"
    : effectiveRecommendation === "A"
      ? `Choose ${product_a.name}`
      : `Choose ${product_b.name}`;

  // Recommendation subtitle
  const recommendationSubtitle = isEqual
    ? "Both products have similar health impact"
    : effectiveRecommendation === "A"
      ? `${product_a.name} is the better choice`
      : `${product_b.name} is the better choice`;

  const scoreColorsA = getScoreColor(scoreA);
  const scoreColorsB = getScoreColor(scoreB);

  // Card styling
  const winnerCardStyle = "bg-[#EFF6FF] border-[#0EA5E9]";
  const loserCardStyle = "bg-white border-[var(--nt-border)]";
  const neutralCardStyle = "bg-white border-[var(--nt-border)]";

  const cardStyleA = isEqual
    ? neutralCardStyle
    : winnerIsA
      ? winnerCardStyle
      : loserCardStyle;
  const cardStyleB = isEqual
    ? neutralCardStyle
    : !winnerIsA
      ? winnerCardStyle
      : loserCardStyle;

  const handleChoose = (choice: "A" | "B") => {
    setSelected(choice);
    onChoose(choice);
  };

  return (
    <div className="space-y-5">
      {/* Recommendation header */}
      <div
        className={`rounded-2xl p-4 flex items-center gap-3 ${
          isEqual
            ? "bg-gray-50 border border-[var(--nt-border)]"
            : "bg-[#EFF6FF] border border-[#0EA5E9]"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isEqual ? "bg-gray-200" : "bg-[#0EA5E9]"
          }`}
        >
          {isEqual ? (
            <Scale className="w-5 h-5 text-gray-600" />
          ) : (
            <ArrowRight className="w-5 h-5 text-white" />
          )}
        </div>
        <div>
          <h3 className="font-bold text-sm text-[var(--text-title)]">
            {recommendationTitle}
          </h3>
          <p className="text-xs text-[var(--text-subtitle)] mt-0.5">
            {recommendationSubtitle}
          </p>
        </div>
      </div>

      {/* Product cards with VS badge */}
      <div className="flex items-stretch gap-3">
        {/* Product A card */}
        <div
          className={`flex-1 rounded-2xl border p-4 flex flex-col items-center gap-2 ${cardStyleA}`}
        >
          <span className="text-[10px] font-bold text-[var(--text-subtitle)] uppercase tracking-wider">
            Product A
          </span>
          <p className="font-semibold text-sm text-[var(--text-title)] text-center truncate w-full">
            {product_a.name}
          </p>
          <p className="text-xs text-[var(--text-subtitle)] truncate w-full text-center">
            {product_a.brand || "--"}
          </p>
          <span
            className="text-2xl font-bold"
            style={{ color: scoreColorsA.primary }}
          >
            {scoreA}
            <span className="text-xs font-medium" style={{ color: scoreColorsA.dark }}>
              /100
            </span>
          </span>
          <RiskBadge riskLevel={product_a.risk_level} size="sm" />
        </div>

        {/* VS badge */}
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-[var(--text-subtitle)]">
              VS
            </span>
          </div>
        </div>

        {/* Product B card */}
        <div
          className={`flex-1 rounded-2xl border p-4 flex flex-col items-center gap-2 ${cardStyleB}`}
        >
          <span className="text-[10px] font-bold text-[var(--text-subtitle)] uppercase tracking-wider">
            Product B
          </span>
          <p className="font-semibold text-sm text-[var(--text-title)] text-center truncate w-full">
            {product_b.name}
          </p>
          <p className="text-xs text-[var(--text-subtitle)] truncate w-full text-center">
            {product_b.brand || "--"}
          </p>
          <span
            className="text-2xl font-bold"
            style={{ color: scoreColorsB.primary }}
          >
            {scoreB}
            <span className="text-xs font-medium" style={{ color: scoreColorsB.dark }}>
              /100
            </span>
          </span>
          <RiskBadge riskLevel={product_b.risk_level} size="sm" />
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="bg-white rounded-2xl border border-[var(--nt-border)] p-4">
          <h4 className="text-sm font-semibold text-[var(--text-title)] mb-2">
            Summary
          </h4>
          <p className="text-sm text-[var(--text-body)] leading-relaxed">
            {summary}
          </p>
        </div>
      )}

      {/* Choice section */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-[var(--text-title)]">
          Which do you prefer?
        </h4>
        <div className="flex gap-3">
          {/* Choose A */}
          <button
            onClick={() => handleChoose("A")}
            disabled={selected !== null}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border transition-colors ${
              selected === "A"
                ? "bg-[var(--bg-light-green)] border-[var(--safe-border)]"
                : "bg-white border-[var(--nt-border)] hover:bg-gray-50"
            } ${selected !== null && selected !== "A" ? "opacity-50" : ""}`}
          >
            {selected === "A" ? (
              <CheckCircle2 className="w-5 h-5 text-[var(--safe-text)]" />
            ) : (
              <Circle className="w-5 h-5 text-[var(--text-subtitle)]" />
            )}
            <span
              className={`text-sm font-medium ${
                selected === "A"
                  ? "text-[var(--safe-text)]"
                  : "text-[var(--text-subtitle)]"
              }`}
            >
              {selected === "A" ? "Saved!" : product_a.name}
            </span>
          </button>

          {/* Choose B */}
          <button
            onClick={() => handleChoose("B")}
            disabled={selected !== null}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border transition-colors ${
              selected === "B"
                ? "bg-[var(--bg-light-green)] border-[var(--safe-border)]"
                : "bg-white border-[var(--nt-border)] hover:bg-gray-50"
            } ${selected !== null && selected !== "B" ? "opacity-50" : ""}`}
          >
            {selected === "B" ? (
              <CheckCircle2 className="w-5 h-5 text-[var(--safe-text)]" />
            ) : (
              <Circle className="w-5 h-5 text-[var(--text-subtitle)]" />
            )}
            <span
              className={`text-sm font-medium ${
                selected === "B"
                  ? "text-[var(--safe-text)]"
                  : "text-[var(--text-subtitle)]"
              }`}
            >
              {selected === "B" ? "Saved!" : product_b.name}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
