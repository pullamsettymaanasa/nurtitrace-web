"use client";

import { useState } from "react";
import { Plus, ScanLine, Clock, X } from "lucide-react";
import { RiskBadge } from "@/components/ui/risk-badge";
import { getScoreColor, getScoreRiskLevel } from "@/lib/risk-helpers";
import type { ScanListItem } from "@/types";

interface ProductSlotProps {
  label: string;
  scan: ScanListItem | null;
  imageUrl: string | null;
  onScanNew: () => void;
  onChooseHistory: () => void;
  onRemove: () => void;
}

export function ProductSlot({
  label,
  scan,
  imageUrl,
  onScanNew,
  onChooseHistory,
  onRemove,
}: ProductSlotProps) {
  const [showOptions, setShowOptions] = useState(false);

  // Filled state
  if (scan) {
    const scoreColors = getScoreColor(scan.score);
    const riskLevel = scan.risk_level || getScoreRiskLevel(scan.score);

    return (
      <div className="relative bg-white rounded-2xl border border-[var(--nt-primary)] p-4 flex flex-col items-center gap-3">
        {/* Remove button */}
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-[var(--text-subtitle)]" />
        </button>

        {/* Thumbnail */}
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-[var(--bg-light-green)] flex-shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={scan.product_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ScanLine className="w-7 h-7 text-[var(--nt-primary)]" />
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="text-center min-w-0 w-full">
          <p className="font-semibold text-sm text-[var(--text-title)] truncate">
            {scan.product_name}
          </p>
          <p className="text-xs text-[var(--text-subtitle)] truncate">
            {scan.brand_name || "Unknown"}
          </p>
        </div>

        {/* Score + Badge */}
        <div className="flex items-center gap-2">
          <span
            className="text-xl font-bold"
            style={{ color: scoreColors.primary }}
          >
            {scan.score}
          </span>
          <RiskBadge riskLevel={riskLevel} size="sm" />
        </div>
      </div>
    );
  }

  // Empty state
  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="w-full border-2 border-dashed border-[var(--nt-border)] rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-[var(--nt-primary)] hover:bg-[var(--bg-very-light-green)] transition-colors min-h-[200px] cursor-pointer"
      >
        <div className="w-12 h-12 rounded-full bg-[var(--bg-light-green)] flex items-center justify-center">
          <Plus className="w-6 h-6 text-[var(--nt-primary)]" />
        </div>
        <span className="text-sm font-medium text-[var(--text-subtitle)]">
          {label}
        </span>
      </button>

      {/* Source options popover */}
      {showOptions && (
        <>
          {/* Backdrop to close */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowOptions(false)}
          />
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20 bg-white rounded-xl border border-[var(--nt-border)] shadow-lg p-2 min-w-[200px]">
            <button
              onClick={() => {
                setShowOptions(false);
                onScanNew();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg-light-green)] transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-[var(--bg-light-green)] flex items-center justify-center flex-shrink-0">
                <ScanLine className="w-5 h-5 text-[var(--nt-primary)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-title)]">
                  Scan New Product
                </p>
                <p className="text-xs text-[var(--text-subtitle)]">
                  Use camera or upload
                </p>
              </div>
            </button>
            <button
              onClick={() => {
                setShowOptions(false);
                onChooseHistory();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg-light-green)] transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-[var(--bg-light-green)] flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-[var(--nt-primary)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-title)]">
                  Choose from History
                </p>
                <p className="text-xs text-[var(--text-subtitle)]">
                  Select a past scan
                </p>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
