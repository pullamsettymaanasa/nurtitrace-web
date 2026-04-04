import type { RiskLevel, IngredientStatus } from "@/types";

export function getRiskColor(riskLevel: RiskLevel | string): string {
  switch (riskLevel?.toUpperCase()) {
    case "LOW":
      return "var(--safe)";
    case "MODERATE":
      return "var(--moderate)";
    case "HIGH":
      return "var(--high-risk)";
    default:
      return "var(--text-subtitle)";
  }
}

export function getRiskBg(riskLevel: RiskLevel | string): string {
  switch (riskLevel?.toUpperCase()) {
    case "LOW":
      return "var(--safe-bg)";
    case "MODERATE":
      return "var(--moderate-bg)";
    case "HIGH":
      return "var(--high-risk-bg)";
    default:
      return "#F1F5F9";
  }
}

export function getRiskLabel(riskLevel: RiskLevel | string): string {
  switch (riskLevel?.toUpperCase()) {
    case "LOW":
      return "SAFE";
    case "MODERATE":
      return "MODERATE";
    case "HIGH":
      return "HIGH RISK";
    default:
      return riskLevel || "UNKNOWN";
  }
}

export function getScoreColor(score: number): { primary: string; dark: string } {
  if (score >= 70) return { primary: "#16B88A", dark: "#0D9668" };
  if (score >= 40) return { primary: "#E67E22", dark: "#D68910" };
  return { primary: "#E74C3C", dark: "#C0392B" };
}

export function getScoreRiskLevel(score: number): RiskLevel {
  if (score >= 70) return "LOW";
  if (score >= 40) return "MODERATE";
  return "HIGH";
}

export function getIngredientStatusColor(status: IngredientStatus): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case "SAFE":
      return { bg: "#E0F8F1", text: "#059669", border: "#00E5A0" };
    case "CAUTION":
      return { bg: "#FEF3C7", text: "#D97706", border: "#F59E0B" };
    case "AVOID":
      return { bg: "#FEE2E2", text: "#DC2626", border: "#EF4444" };
  }
}
