"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Baby, GraduationCap, User, Heart } from "lucide-react";

const AGE_GROUPS = [
  {
    value: "Child" as const,
    label: "Child",
    description: "Under 12 Years",
    icon: Baby,
  },
  {
    value: "Teen" as const,
    label: "Teen",
    description: "13-18 Years",
    icon: GraduationCap,
  },
  {
    value: "Adult" as const,
    label: "Adult",
    description: "19-59 Years",
    icon: User,
  },
  {
    value: "Senior" as const,
    label: "Senior",
    description: "60+ Years",
    icon: Heart,
  },
];

export default function AgeSelectionPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("onboarding_age") || "";
    }
    return "";
  });

  function handleContinue() {
    if (!selected) return;
    sessionStorage.setItem("onboarding_age", selected);
    router.push("/onboarding/health");
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
          STEP 1 OF 3
        </span>
      </div>

      {/* Progress Bar */}
      <div className="px-4 md:px-6 mb-6">
        <div className="w-full h-2 bg-[var(--nt-border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--nt-primary)] rounded-full transition-all duration-500"
            style={{ width: "33%" }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 md:px-6 max-w-lg mx-auto w-full">
        <h1 className="text-2xl font-bold text-[var(--text-title)] mb-1">
          Select Your Age Group
        </h1>
        <p className="text-sm text-[var(--text-subtitle)] mb-6">
          This helps us personalize ingredient analysis for your age group.
        </p>

        {/* Age Group Cards */}
        <div className="space-y-3">
          {AGE_GROUPS.map((group) => {
            const isSelected = selected === group.value;
            const Icon = group.icon;
            return (
              <button
                key={group.value}
                onClick={() => setSelected(group.value)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                  isSelected
                    ? "border-[var(--nt-accent)] bg-[var(--accent-light)]"
                    : "border-[var(--nt-border)] bg-white hover:border-[var(--text-subtitle)]"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isSelected
                      ? "bg-[var(--nt-accent)]/20"
                      : "bg-[var(--bg-main)]"
                  }`}
                >
                  <Icon
                    size={24}
                    className={
                      isSelected
                        ? "text-[var(--nt-primary)]"
                        : "text-[var(--text-subtitle)]"
                    }
                  />
                </div>

                {/* Text */}
                <div className="flex-1">
                  <p className="font-semibold text-[var(--text-title)]">
                    {group.label}
                  </p>
                  <p className="text-sm text-[var(--text-subtitle)]">
                    {group.description}
                  </p>
                </div>

                {/* Radio indicator */}
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? "border-[var(--nt-accent)]"
                      : "border-[var(--nt-border)]"
                  }`}
                >
                  {isSelected && (
                    <div className="w-3 h-3 rounded-full bg-[var(--nt-accent)]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="px-4 md:px-6 py-6 max-w-lg mx-auto w-full">
        <button
          onClick={handleContinue}
          disabled={!selected}
          className="w-full h-12 rounded-xl bg-[var(--nt-primary)] hover:bg-[var(--primary-hover)] text-white font-semibold text-base transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Continue
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
