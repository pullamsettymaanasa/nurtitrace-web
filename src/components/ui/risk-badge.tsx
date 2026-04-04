import { cn } from "@/lib/utils";
import { getRiskLabel } from "@/lib/risk-helpers";
import type { RiskLevel } from "@/types";

const riskStyles: Record<string, string> = {
  LOW: "bg-[var(--safe-bg)] text-[var(--safe-text)] border-[var(--safe-border)]",
  MODERATE: "bg-[var(--moderate-bg)] text-[var(--moderate-text)] border-[var(--moderate-border)]",
  HIGH: "bg-[var(--high-risk-bg)] text-[var(--high-risk-text)] border-[var(--high-risk-border)]",
};

interface RiskBadgeProps {
  riskLevel: RiskLevel | string;
  className?: string;
  size?: "sm" | "md";
}

export function RiskBadge({ riskLevel, className, size = "sm" }: RiskBadgeProps) {
  const level = riskLevel?.toUpperCase() || "LOW";
  return (
    <span
      className={cn(
        "inline-flex items-center font-bold rounded-full border",
        size === "sm" ? "px-2.5 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        riskStyles[level] || riskStyles.LOW,
        className
      )}
    >
      {getRiskLabel(level)}
    </span>
  );
}
