"use client";

import { ScanLine } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { RiskBadge } from "@/components/ui/risk-badge";
import { useScanHistory } from "@/hooks/use-scan";
import { getImageUrl } from "@/lib/config";
import { getScoreColor, getScoreRiskLevel } from "@/lib/risk-helpers";
import type { ScanListItem } from "@/types";

interface HistoryPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (scan: ScanListItem) => void;
}

export function HistoryPickerDialog({
  open,
  onOpenChange,
  onSelect,
}: HistoryPickerDialogProps) {
  const { data, isLoading } = useScanHistory();
  const scans = data?.scans ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose from Scan History</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <LoadingSpinner size="md" text="Loading scans..." />
          </div>
        ) : scans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-14 h-14 rounded-full bg-[var(--bg-light-green)] flex items-center justify-center mb-3">
              <ScanLine className="w-7 h-7 text-[var(--nt-primary)]" />
            </div>
            <p className="text-sm text-[var(--text-subtitle)]">
              No scans available
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto -mx-4 px-4 space-y-2 pb-2">
            {scans.map((scan) => {
              const scoreColors = getScoreColor(scan.score);
              const riskLevel = scan.risk_level || getScoreRiskLevel(scan.score);

              return (
                <button
                  key={scan.id}
                  onClick={() => {
                    onSelect(scan);
                    onOpenChange(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-[var(--nt-border)] hover:bg-[var(--bg-light-green)] transition-colors text-left"
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--bg-light-green)] flex-shrink-0">
                    {scan.image_path ? (
                      <img
                        src={getImageUrl(scan.image_path)}
                        alt={scan.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ScanLine className="w-5 h-5 text-[var(--nt-primary)]" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[var(--text-title)] truncate">
                      {scan.product_name}
                    </p>
                    <p className="text-xs text-[var(--text-subtitle)] truncate">
                      {scan.brand_name || "Unknown"}
                    </p>
                  </div>

                  {/* Score + Badge */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span
                      className="text-base font-bold"
                      style={{ color: scoreColors.primary }}
                    >
                      {scan.score}
                    </span>
                    <RiskBadge riskLevel={riskLevel} size="sm" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
