"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, Pencil, User, HeartPulse, ShieldAlert } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

interface ProfileSummary {
  age_group: string;
  conditions: string[];
  sensitivities: string[];
}

// Map condition keys to display labels
const CONDITION_LABELS: Record<string, string> = {
  blood_sugar: "Blood Sugar Regulation",
  cardiovascular: "Cardiovascular & Circulatory Health",
  hormonal: "Hormonal & Metabolic Health",
  digestive: "Digestive & Organ Health",
  allergy_immune: "Allergy & Immune Sensitivity",
  no_specific: "No Specific Condition",
  not_sure: "Not Sure",
};

export default function SuccessPage() {
  const router = useRouter();
  const { updateUser } = useAuthStore();
  const [summary, setSummary] = useState<ProfileSummary | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("onboarding_summary");
    if (stored) {
      try {
        setSummary(JSON.parse(stored));
      } catch {
        // No summary available
      }
    }
  }, []);

  function handleContinue() {
    updateUser({ has_health_profile: true });
    sessionStorage.removeItem("onboarding_summary");
    sessionStorage.removeItem("onboarding_sensitivities");
    router.push("/dashboard");
  }

  function handleEdit() {
    sessionStorage.removeItem("onboarding_summary");
    sessionStorage.removeItem("onboarding_sensitivities");
    router.push("/onboarding/age");
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[var(--nt-accent)] flex items-center justify-center animate-in zoom-in-50 duration-500">
            <Check size={40} className="text-white" strokeWidth={3} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-[var(--text-title)] mb-2">
          Profile Successfully Created!
        </h1>
        <p className="text-sm text-[var(--text-subtitle)] mb-8">
          Your health profile is all set. We&apos;ll use this to personalize your ingredient analysis.
        </p>

        {/* Profile Summary Card */}
        {summary && (
          <div className="bg-white rounded-2xl p-5 shadow-[var(--card-shadow)] border border-[var(--nt-border)] text-left mb-8">
            <h2 className="text-sm font-semibold text-[var(--text-subtitle)] tracking-wider mb-4">
              PROFILE SUMMARY
            </h2>

            {/* Age Group */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[var(--bg-light-green)] flex items-center justify-center shrink-0">
                <User size={18} className="text-[var(--nt-primary)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--text-subtitle)] mb-0.5">Age Group</p>
                <p className="text-sm font-semibold text-[var(--text-title)]">
                  {summary.age_group}
                </p>
              </div>
            </div>

            {/* Conditions */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[var(--bg-light-green)] flex items-center justify-center shrink-0">
                <HeartPulse size={18} className="text-[var(--nt-primary)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--text-subtitle)] mb-0.5">
                  Health Conditions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {summary.conditions.length > 0 ? (
                    summary.conditions.map((c) => (
                      <span
                        key={c}
                        className="inline-block px-2.5 py-1 rounded-full bg-[var(--accent-light)] text-[var(--nt-primary)] text-xs font-medium"
                      >
                        {CONDITION_LABELS[c] || c}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-[var(--text-subtitle)]">None</span>
                  )}
                </div>
              </div>
            </div>

            {/* Sensitivities */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--bg-light-green)] flex items-center justify-center shrink-0">
                <ShieldAlert size={18} className="text-[var(--nt-primary)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--text-subtitle)] mb-0.5">
                  Sensitivities
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {summary.sensitivities.length > 0 ? (
                    summary.sensitivities.map((s) => (
                      <span
                        key={s}
                        className="inline-block px-2.5 py-1 rounded-full bg-[var(--accent-light)] text-[var(--nt-primary)] text-xs font-medium"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-[var(--text-subtitle)]">None</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleContinue}
            className="w-full h-12 rounded-xl bg-[var(--nt-primary)] hover:bg-[var(--primary-hover)] text-white font-semibold text-base transition-colors flex items-center justify-center gap-2"
          >
            Continue to Dashboard
            <ArrowRight size={18} />
          </button>
          <button
            onClick={handleEdit}
            className="w-full h-12 rounded-xl border-2 border-[var(--nt-border)] bg-white hover:bg-[var(--bg-main)] text-[var(--text-title)] font-semibold text-base transition-colors flex items-center justify-center gap-2"
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
