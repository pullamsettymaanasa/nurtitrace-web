"use client";

import Link from "next/link";
import { ScanLine, GitCompareArrows, ArrowRight } from "lucide-react";
import { useDashboard } from "@/hooks/use-dashboard";
import { useAuthStore } from "@/stores/auth-store";
import { getGreeting } from "@/lib/utils";
import { getImageUrl } from "@/lib/config";
import { getScoreRiskLevel, getScoreColor } from "@/lib/risk-helpers";
import { ScoreDial } from "@/components/ui/score-dial";
import { RiskBadge } from "@/components/ui/risk-badge";
import type { ScanListItem } from "@/types";

// ─── Loading Skeleton ────────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Greeting skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-48 bg-gray-200 rounded-lg" />
        <div className="h-4 w-64 bg-gray-200 rounded-lg" />
      </div>

      {/* Risk status card skeleton */}
      <div className="h-52 rounded-3xl bg-gray-200" />

      {/* Quick action cards skeleton */}
      <div className="grid grid-cols-2 gap-4">
        <div className="h-32 rounded-2xl bg-gray-200" />
        <div className="h-32 rounded-2xl bg-gray-200" />
      </div>

      {/* Latest scans skeleton */}
      <div className="space-y-3">
        <div className="h-5 w-32 bg-gray-200 rounded-lg" />
        <div className="h-20 rounded-2xl bg-gray-200" />
        <div className="h-20 rounded-2xl bg-gray-200" />
        <div className="h-20 rounded-2xl bg-gray-200" />
      </div>
    </div>
  );
}

// ─── Scan Card ───────────────────────────────────────────────────────
function ScanCard({ scan }: { scan: ScanListItem }) {
  const scoreColors = getScoreColor(scan.score);
  const riskLevel = scan.risk_level || getScoreRiskLevel(scan.score);

  return (
    <Link
      href={`/scan/${scan.id}`}
      className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[var(--nt-border)] hover:shadow-md transition-shadow min-w-[280px] md:min-w-0"
    >
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[var(--bg-light-green)] flex-shrink-0">
        {scan.image_path ? (
          <img
            src={getImageUrl(scan.image_path)}
            alt={scan.product_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ScanLine className="w-6 h-6 text-[var(--nt-primary)]" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-[var(--text-title)] truncate">
          {scan.product_name}
        </p>
        <p className="text-xs text-[var(--text-subtitle)] truncate">
          {scan.brand_name}
        </p>
      </div>

      {/* Score + Badge */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span
          className="text-lg font-bold"
          style={{ color: scoreColors.primary }}
        >
          {scan.score}
        </span>
        <RiskBadge riskLevel={riskLevel} size="sm" />
      </div>
    </Link>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="w-20 h-20 rounded-full bg-[var(--bg-light-green)] flex items-center justify-center mb-4">
        <ScanLine className="w-10 h-10 text-[var(--nt-primary)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-title)] mb-1">
        No scans yet
      </h3>
      <p className="text-sm text-[var(--text-subtitle)] text-center mb-6">
        Start by scanning your first food product
      </p>
      <Link
        href="/scan"
        className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[var(--nt-primary)] text-white font-semibold text-sm hover:bg-[var(--primary-hover)] transition-colors"
      >
        Scan Your First Product
      </Link>
    </div>
  );
}

// ─── Dashboard Page ──────────────────────────────────────────────────
export default function DashboardPage() {
  const { data, isLoading } = useDashboard();
  const user = useAuthStore((s) => s.user);

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 pb-20 md:pb-6 max-w-2xl mx-auto">
        <DashboardSkeleton />
      </div>
    );
  }

  const firstName =
    data?.user?.fullname?.split(" ")[0] ||
    user?.fullname?.split(" ")[0] ||
    "there";
  const averageScore = data?.average_score ?? 0;
  const totalScans = data?.total_scans ?? 0;
  const latestScans = data?.latest_scans ?? [];
  const riskLevel = getScoreRiskLevel(averageScore);
  const hasScans = totalScans > 0 && latestScans.length > 0;

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6 max-w-2xl mx-auto space-y-6">
      {/* ── Greeting Section ── */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-title)]">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-sm text-[var(--text-subtitle)] mt-0.5">
          Here&apos;s your food safety overview
        </p>
      </div>

      {/* ── Risk Status Card ── */}
      <div
        className="rounded-3xl p-5 md:p-6"
        style={{
          background: `linear-gradient(135deg, var(--gradient-start), var(--gradient-end))`,
        }}
      >
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex-1">
            <h2 className="text-white text-lg font-bold">Food Risk Status</h2>
            <p className="text-white/70 text-sm mt-0.5">
              Average Safety Score
            </p>
            <div className="mt-4">
              <RiskBadge riskLevel={riskLevel} size="md" />
            </div>
          </div>

          {/* Right side - Score Dial */}
          <div className="flex-shrink-0">
            <ScoreDial score={averageScore} size={130} />
          </div>
        </div>
      </div>

      {/* ── Quick Action Cards ── */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/scan"
          className="flex flex-col items-start p-4 bg-white rounded-2xl border border-[var(--nt-border)] hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-light-green)] flex items-center justify-center mb-3">
            <ScanLine className="w-5 h-5 text-[var(--nt-primary)]" />
          </div>
          <span className="font-semibold text-sm text-[var(--text-title)]">
            Scan Product
          </span>
          <span className="text-xs text-[var(--text-subtitle)] mt-0.5">
            Analyze ingredients
          </span>
        </Link>

        <Link
          href="/compare"
          className="flex flex-col items-start p-4 bg-white rounded-2xl border border-[var(--nt-border)] hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-light-green)] flex items-center justify-center mb-3">
            <GitCompareArrows className="w-5 h-5 text-[var(--nt-primary)]" />
          </div>
          <span className="font-semibold text-sm text-[var(--text-title)]">
            Compare Products
          </span>
          <span className="text-xs text-[var(--text-subtitle)] mt-0.5">
            Compare two products
          </span>
        </Link>
      </div>

      {/* ── Latest Scans / Empty State ── */}
      {hasScans ? (
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-[var(--text-title)]">
              Last Scanned
            </h2>
            <Link
              href="/history"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--nt-primary)] hover:underline"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Scan list — horizontal scroll on mobile, vertical on desktop */}
          <div className="flex gap-3 overflow-x-auto pb-2 md:flex-col md:overflow-x-visible md:pb-0 snap-x snap-mandatory md:snap-none">
            {latestScans.map((scan) => (
              <div key={scan.id} className="snap-start">
                <ScanCard scan={scan} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
