"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSaveHealthProfile } from "@/hooks/use-user";
import { useAuthStore } from "@/stores/auth-store";
import type { AgeGroup } from "@/types";

const PREDEFINED_SENSITIVITIES = [
  "Dairy",
  "Nuts",
  "Gluten",
  "Sulfites",
  "Artificial Colors",
  "Artificial Sweeteners",
];

export default function SensitivitiesPage() {
  const router = useRouter();
  const saveProfile = useSaveHealthProfile();
  const { updateUser } = useAuthStore();

  const [selectedPredefined, setSelectedPredefined] = useState<string[]>([]);
  const [customSensitivities, setCustomSensitivities] = useState<string[]>([]);
  const [noneSelected, setNoneSelected] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState("");

  function togglePredefined(sensitivity: string) {
    if (noneSelected) {
      setNoneSelected(false);
    }
    setSelectedPredefined((prev) =>
      prev.includes(sensitivity)
        ? prev.filter((s) => s !== sensitivity)
        : [...prev, sensitivity]
    );
  }

  function toggleNone() {
    if (noneSelected) {
      setNoneSelected(false);
    } else {
      setNoneSelected(true);
      setSelectedPredefined([]);
      setCustomSensitivities([]);
    }
  }

  function addCustomSensitivity() {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (
      customSensitivities.includes(trimmed) ||
      PREDEFINED_SENSITIVITIES.includes(trimmed)
    ) {
      toast.error("This sensitivity already exists");
      return;
    }
    if (noneSelected) {
      setNoneSelected(false);
    }
    setCustomSensitivities((prev) => [...prev, trimmed]);
    setCustomInput("");
    setShowCustomInput(false);
  }

  function removeCustom(sensitivity: string) {
    setCustomSensitivities((prev) => prev.filter((s) => s !== sensitivity));
  }

  const hasSelection =
    noneSelected || selectedPredefined.length > 0 || customSensitivities.length > 0;

  async function handleFinish() {
    if (!hasSelection) return;

    // Collect all data from sessionStorage
    const ageGroup = sessionStorage.getItem("onboarding_age") as AgeGroup | null;
    const conditionsStr = sessionStorage.getItem("onboarding_conditions");

    if (!ageGroup) {
      toast.error("Age group not found. Please go back and select one.");
      router.push("/onboarding/age");
      return;
    }

    let conditions: string[] = [];
    if (conditionsStr) {
      try {
        conditions = JSON.parse(conditionsStr);
      } catch {
        conditions = [];
      }
    }

    const sensitivities = noneSelected ? [] : selectedPredefined;
    const custom = noneSelected ? [] : customSensitivities;

    saveProfile.mutate(
      {
        age_group: ageGroup,
        conditions,
        sensitivities,
        custom_sensitivities: custom,
      },
      {
        onSuccess: () => {
          // Save sensitivities to sessionStorage for success page display
          sessionStorage.setItem(
            "onboarding_sensitivities",
            JSON.stringify([...sensitivities, ...custom])
          );
          // Clear onboarding keys
          sessionStorage.removeItem("onboarding_age");
          sessionStorage.removeItem("onboarding_conditions");
          // Store summary for success page
          sessionStorage.setItem(
            "onboarding_summary",
            JSON.stringify({
              age_group: ageGroup,
              conditions,
              sensitivities: [...sensitivities, ...custom],
            })
          );
          router.push("/onboarding/success");
        },
        onError: (error: any) => {
          const msg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to save profile. Please try again.";
          toast.error(msg);
        },
      }
    );
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
          STEP 3 OF 3
        </span>
      </div>

      {/* Progress Bar */}
      <div className="px-4 md:px-6 mb-6">
        <div className="w-full h-2 bg-[var(--nt-border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--nt-primary)] rounded-full transition-all duration-500"
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 md:px-6 max-w-lg mx-auto w-full overflow-y-auto pb-4">
        <h1 className="text-2xl font-bold text-[var(--text-title)] mb-1">
          Food Sensitivities
        </h1>
        <p className="text-sm text-[var(--text-subtitle)] mb-6">
          Select any food sensitivities you have so we can alert you.
        </p>

        {/* Predefined Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {PREDEFINED_SENSITIVITIES.map((sensitivity) => {
            const isActive = selectedPredefined.includes(sensitivity);
            return (
              <button
                key={sensitivity}
                onClick={() => togglePredefined(sensitivity)}
                className={`px-4 py-2.5 rounded-full border text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#E0F8F1] border-[#00E5A0] text-[var(--nt-primary)]"
                    : "bg-white border-[#E2E8F0] text-[var(--text-gray)] hover:border-[var(--text-subtitle)]"
                }`}
              >
                {sensitivity}
              </button>
            );
          })}

          {/* None Chip */}
          <button
            onClick={toggleNone}
            className={`px-4 py-2.5 rounded-full border text-sm font-medium transition-all ${
              noneSelected
                ? "bg-[#E0F8F1] border-[#00E5A0] text-[var(--nt-primary)]"
                : "bg-white border-[#E2E8F0] text-[var(--text-gray)] hover:border-[var(--text-subtitle)]"
            }`}
          >
            None
          </button>
        </div>

        {/* Custom Chips */}
        {customSensitivities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {customSensitivities.map((sensitivity) => (
              <span
                key={sensitivity}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-sm font-medium bg-[#E0F8F1] border-[#00E5A0] text-[var(--nt-primary)]"
              >
                {sensitivity}
                <button
                  onClick={() => removeCustom(sensitivity)}
                  className="hover:text-[var(--high-risk)] transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Add Custom */}
        {!showCustomInput ? (
          <button
            onClick={() => setShowCustomInput(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-dashed border-[var(--nt-border)] text-sm font-medium text-[var(--text-subtitle)] hover:border-[var(--nt-primary)] hover:text-[var(--nt-primary)] transition-colors"
          >
            <Plus size={16} />
            Add Custom Sensitivity
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter sensitivity name..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addCustomSensitivity();
                if (e.key === "Escape") {
                  setShowCustomInput(false);
                  setCustomInput("");
                }
              }}
              autoFocus
              className="flex-1 h-10 px-4 rounded-xl border border-[var(--nt-border)] bg-white text-[var(--text-title)] placeholder:text-[var(--text-subtitle)] focus:border-[var(--nt-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--nt-primary)]/20 transition-colors text-sm"
            />
            <button
              onClick={addCustomSensitivity}
              className="h-10 px-4 rounded-xl bg-[var(--nt-primary)] text-white text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowCustomInput(false);
                setCustomInput("");
              }}
              className="h-10 px-4 rounded-xl border border-[var(--nt-border)] text-[var(--text-subtitle)] text-sm font-semibold hover:bg-[var(--bg-main)] transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div className="px-4 md:px-6 py-6 max-w-lg mx-auto w-full">
        <button
          onClick={handleFinish}
          disabled={!hasSelection || saveProfile.isPending}
          className="w-full h-12 rounded-xl bg-[var(--nt-primary)] hover:bg-[var(--primary-hover)] text-white font-semibold text-base transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saveProfile.isPending ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Finish Setup
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
