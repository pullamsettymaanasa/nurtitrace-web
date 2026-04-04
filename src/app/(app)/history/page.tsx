"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ScanLine } from "lucide-react";
import { useScanHistory } from "@/hooks/use-scan";
import { getImageUrl } from "@/lib/config";
import { formatDate } from "@/lib/utils";
import { RiskBadge } from "@/components/ui/risk-badge";
import type { ScanListItem } from "@/types";

// ─── Loading Skeleton ────────────────────────────────────────────────
function HistorySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-sm border border-[var(--nt-border)] p-4 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-gray-200 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-28 bg-gray-200 rounded" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-5 w-16 bg-gray-200 rounded-full" />
            </div>
          </div>
          <div className="mt-3 h-3 w-24 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────
function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-20 h-20 rounded-full bg-[var(--bg-light-green)] flex items-center justify-center mb-4">
        <ScanLine className="w-10 h-10 text-[var(--nt-primary)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-title)] mb-1">
        No scans found
      </h3>
      <p className="text-sm text-[var(--text-subtitle)] text-center">
        {hasSearch
          ? "Try a different search term"
          : "Start scanning products to see them here"}
      </p>
    </div>
  );
}

// ─── Scan Card ───────────────────────────────────────────────────────
function ScanCard({ scan }: { scan: ScanListItem }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/scan/${scan.id}`)}
      className="w-full text-left bg-white rounded-xl shadow-sm border border-[var(--nt-border)] p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3">
        {/* Thumbnail */}
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          {scan.image_path ? (
            <img
              src={getImageUrl(scan.image_path)}
              alt={scan.product_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ScanLine className="w-6 h-6 text-[var(--text-subtitle)]" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[var(--text-title)] truncate">
            {scan.product_name}
          </p>
          <p className="text-xs text-[var(--text-subtitle)] truncate mt-0.5">
            {scan.brand_name}
          </p>
          <div className="mt-1.5">
            <RiskBadge riskLevel={scan.risk_level} size="sm" />
          </div>
        </div>
      </div>

      {/* Date */}
      <p className="text-xs text-[var(--text-subtitle)] mt-3">
        {formatDate(scan.scanned_at)}
      </p>
    </button>
  );
}

// ─── History Page ────────────────────────────────────────────────────
export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading } = useScanHistory(debouncedSearch || undefined);
  const scans = data?.scans ?? [];

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6 max-w-4xl mx-auto space-y-5">
      {/* Title */}
      <h1 className="text-2xl font-bold text-[var(--text-title)]">
        Scan History
      </h1>

      {/* Search Bar */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtitle)]"
        />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 pl-10 pr-4 rounded-xl border border-[var(--nt-border)] bg-white text-[var(--text-title)] placeholder:text-[var(--text-subtitle)] focus:border-[var(--nt-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--nt-primary)]/20 transition-colors"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <HistorySkeleton />
      ) : scans.length === 0 ? (
        <EmptyState hasSearch={debouncedSearch.length > 0} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scans.map((scan) => (
            <ScanCard key={scan.id} scan={scan} />
          ))}
        </div>
      )}
    </div>
  );
}
