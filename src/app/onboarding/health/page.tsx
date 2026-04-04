"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Droplets,
  HeartPulse,
  Zap,
  Stethoscope,
  ShieldAlert,
  CircleSlash,
  HelpCircle,
  Search,
  Check,
} from "lucide-react";

interface ConditionItem {
  key: string;
  label: string;
  icon: React.ElementType;
  exclusive?: boolean;
}

const CONDITIONS: ConditionItem[] = [
  { key: "blood_sugar", label: "Blood Sugar Regulation", icon: Droplets },
  { key: "cardiovascular", label: "Cardiovascular & Circulatory Health", icon: HeartPulse },
  { key: "hormonal", label: "Hormonal & Metabolic Health", icon: Zap },
  { key: "digestive", label: "Digestive & Organ Health", icon: Stethoscope },
  { key: "allergy_immune", label: "Allergy & Immune Sensitivity", icon: ShieldAlert },
  { key: "no_specific", label: "No Specific Condition", icon: CircleSlash, exclusive: true },
  { key: "not_sure", label: "Not Sure", icon: HelpCircle, exclusive: true },
];

const SEARCH_MAP: Record<string, string> = {
  diabetes: "blood_sugar",
  sugar: "blood_sugar",
  insulin: "blood_sugar",
  heart: "cardiovascular",
  "blood pressure": "cardiovascular",
  cholesterol: "cardiovascular",
  thyroid: "hormonal",
  pcos: "hormonal",
  hormone: "hormonal",
  kidney: "digestive",
  liver: "digestive",
  stomach: "digestive",
  ibs: "digestive",
  celiac: "allergy_immune",
  lactose: "allergy_immune",
  allergy: "allergy_immune",
};

export default function HealthConditionsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("onboarding_conditions");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return [];
        }
      }
    }
    return [];
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Non-exclusive keys (first 5)
  const normalKeys = CONDITIONS.filter((c) => !c.exclusive).map((c) => c.key);
  const exclusiveKeys = CONDITIONS.filter((c) => c.exclusive).map((c) => c.key);

  function toggleCondition(key: string) {
    setSelected((prev) => {
      const isExclusive = exclusiveKeys.includes(key);
      const isCurrentlySelected = prev.includes(key);

      if (isCurrentlySelected) {
        // Uncheck it
        return prev.filter((k) => k !== key);
      }

      if (isExclusive) {
        // Checking exclusive: remove all others, set only this one
        return [key];
      }

      // Checking a normal condition: remove any exclusive selections
      const withoutExclusive = prev.filter((k) => !exclusiveKeys.includes(k));
      return [...withoutExclusive, key];
    });
  }

  // Search suggestion
  const suggestion = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return null;

    for (const [keyword, condKey] of Object.entries(SEARCH_MAP)) {
      if (keyword.includes(q) || q.includes(keyword)) {
        const condition = CONDITIONS.find((c) => c.key === condKey);
        if (condition) {
          return { key: condKey, label: condition.label };
        }
      }
    }
    return null;
  }, [searchQuery]);

  function applySuggestion(key: string) {
    setSelected((prev) => {
      const withoutExclusive = prev.filter((k) => !exclusiveKeys.includes(k));
      if (withoutExclusive.includes(key)) return withoutExclusive;
      return [...withoutExclusive, key];
    });
    setSearchQuery("");
  }

  function handleContinue() {
    if (selected.length === 0) return;
    sessionStorage.setItem("onboarding_conditions", JSON.stringify(selected));
    router.push("/onboarding/sensitivities");
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center gap-3 px-4 py-4 md:px-6">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white transition-colors"
        >
          <ArrowLeft size={20} className="text-[var(--text-title)]" />
        </button>
        <span className="text-sm font-semibold text-[var(--text-subtitle)] tracking-wide">
          STEP 2 OF 3
        </span>
      </div>

      {/* Progress Bar */}
      <div className="px-4 md:px-6 mb-6">
        <div className="w-full h-2 bg-[var(--nt-border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--nt-primary)] rounded-full transition-all duration-500"
            style={{ width: "66%" }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 md:px-6 max-w-lg mx-auto w-full overflow-y-auto pb-4">
        <h1 className="text-2xl font-bold text-[var(--text-title)] mb-1">
          Select Health Conditions
        </h1>
        <p className="text-sm text-[var(--text-subtitle)] mb-6">
          Select any conditions that apply so we can flag risky ingredients.
        </p>

        {/* Condition Cards */}
        <div className="space-y-3 mb-8">
          {CONDITIONS.map((condition) => {
            const isChecked = selected.includes(condition.key);
            const Icon = condition.icon;
            return (
              <button
                key={condition.key}
                onClick={() => toggleCondition(condition.key)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                  isChecked
                    ? "border-[var(--nt-accent)] bg-[var(--accent-light)]"
                    : "border-[var(--nt-border)] bg-white hover:border-[var(--text-subtitle)]"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isChecked
                      ? "bg-[var(--nt-accent)]/20"
                      : "bg-[var(--bg-main)]"
                  }`}
                >
                  <Icon
                    size={20}
                    className={
                      isChecked
                        ? "text-[var(--nt-primary)]"
                        : "text-[var(--text-subtitle)]"
                    }
                  />
                </div>

                {/* Text */}
                <p className="flex-1 font-medium text-[var(--text-title)] text-sm">
                  {condition.label}
                </p>

                {/* Checkbox indicator */}
                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                    isChecked
                      ? "border-[var(--nt-accent)] bg-[var(--nt-accent)]"
                      : "border-[var(--nt-border)] bg-white"
                  }`}
                >
                  {isChecked && <Check size={14} className="text-white" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Search Section */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-[var(--text-subtitle)] tracking-wider mb-3">
            FIND MY CATEGORY
          </p>
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtitle)]"
            />
            <input
              type="text"
              placeholder="e.g., diabetes, thyroid, lactose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-[var(--nt-border)] bg-white text-[var(--text-title)] placeholder:text-[var(--text-subtitle)] focus:border-[var(--nt-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--nt-primary)]/20 transition-colors text-sm"
            />
          </div>

          {/* Suggestion Card */}
          {suggestion && (
            <div className="mt-3 flex items-center justify-between p-3 rounded-xl border border-[var(--nt-accent)] bg-[var(--accent-light)]">
              <div>
                <p className="text-xs text-[var(--text-subtitle)] mb-0.5">
                  Suggested category
                </p>
                <p className="text-sm font-semibold text-[var(--text-title)]">
                  {suggestion.label}
                </p>
              </div>
              <button
                onClick={() => applySuggestion(suggestion.key)}
                className="px-4 py-2 rounded-lg bg-[var(--nt-primary)] text-white text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="px-4 md:px-6 py-6 max-w-lg mx-auto w-full">
        <button
          onClick={handleContinue}
          disabled={selected.length === 0}
          className="w-full h-12 rounded-xl bg-[var(--nt-primary)] hover:bg-[var(--primary-hover)] text-white font-semibold text-base transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Continue
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
