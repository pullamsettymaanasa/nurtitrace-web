"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GitCompareArrows } from "lucide-react";
import { toast } from "sonner";
import { ProductSlot } from "@/components/compare/product-slot";
import { ComparisonResult } from "@/components/compare/comparison-result";
import { HistoryPickerDialog } from "@/components/compare/history-picker-dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useCompareProducts } from "@/hooks/use-compare";
import { useAnalyzeScan, useDeleteScan } from "@/hooks/use-scan";
import { useScanFlowStore } from "@/stores/scan-store";
import { getImageUrl } from "@/lib/config";
import type { ScanListItem, CompareResult } from "@/types";

function ComparePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [scanA, setScanA] = useState<ScanListItem | null>(null);
  const [scanB, setScanB] = useState<ScanListItem | null>(null);
  const [imageUriA, setImageUriA] = useState<string | null>(null);
  const [imageUriB, setImageUriB] = useState<string | null>(null);
  const [comparisonResult, setComparisonResult] =
    useState<CompareResult | null>(null);
  const [historyPickerOpen, setHistoryPickerOpen] = useState(false);
  const [historyPickerSlot, setHistoryPickerSlot] = useState<"A" | "B">("A");

  // Mutations
  const compareMutation = useCompareProducts();
  const analyzeMutation = useAnalyzeScan();
  const deleteMutation = useDeleteScan();

  // Scan flow store
  const capturedImage = useScanFlowStore((s) => s.capturedImage);
  const imagePreviewUrl = useScanFlowStore((s) => s.imagePreviewUrl);
  const returnTo = useScanFlowStore((s) => s.returnTo);
  const compareSlot = useScanFlowStore((s) => s.compareSlot);
  const clearScanFlow = useScanFlowStore((s) => s.clearScanFlow);
  const setReturnTo = useScanFlowStore((s) => s.setReturnTo);

  // Prevent duplicate processing
  const hasProcessedReturn = useRef(false);

  // Handle return from scan flow
  useEffect(() => {
    const returnParam = searchParams.get("returnTo");
    if (
      returnParam === "compare" &&
      capturedImage &&
      returnTo === "compare" &&
      !hasProcessedReturn.current
    ) {
      hasProcessedReturn.current = true;
      const slot = compareSlot || (searchParams.get("slot") as "A" | "B") || "A";
      const previewUrl = imagePreviewUrl;

      // Upload the captured image
      analyzeMutation
        .mutateAsync({ file: capturedImage })
        .then((result) => {
          const scan = result.scan;
          const scanListItem: ScanListItem = {
            id: scan.id,
            product_name: scan.product_name,
            brand_name: scan.brand_name,
            score: scan.score,
            risk_level: scan.risk_level,
            scanned_at: scan.scanned_at,
            image_path: scan.image_path,
          };

          if (slot === "A") {
            setScanA(scanListItem);
            setImageUriA(
              scan.image_path
                ? getImageUrl(scan.image_path)
                : previewUrl || null
            );
          } else {
            setScanB(scanListItem);
            setImageUriB(
              scan.image_path
                ? getImageUrl(scan.image_path)
                : previewUrl || null
            );
          }

          clearScanFlow();
        })
        .catch((err) => {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to analyze image. Please try again.";
          toast.error(message);
          clearScanFlow();
          hasProcessedReturn.current = false;
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capturedImage, returnTo, searchParams]);

  // Auto-compare when both scans are set
  const hasTriggeredCompare = useRef(false);
  useEffect(() => {
    if (
      scanA &&
      scanB &&
      !comparisonResult &&
      !compareMutation.isPending &&
      !hasTriggeredCompare.current
    ) {
      hasTriggeredCompare.current = true;
      compareMutation
        .mutateAsync({ scan_id_a: scanA.id, scan_id_b: scanB.id })
        .then((result) => {
          setComparisonResult(result.comparison);
        })
        .catch((err) => {
          const message =
            err instanceof Error
              ? err.message
              : "Comparison failed. Please try again.";
          toast.error(message);
          hasTriggeredCompare.current = false;
        });
    }
  }, [scanA, scanB, comparisonResult, compareMutation]);

  // Handlers
  const handleScanNew = useCallback(
    (slot: "A" | "B") => {
      setReturnTo("compare", slot);
      router.push(`/scan?returnTo=compare&slot=${slot}`);
    },
    [setReturnTo, router]
  );

  const handleChooseHistory = useCallback((slot: "A" | "B") => {
    setHistoryPickerSlot(slot);
    setHistoryPickerOpen(true);
  }, []);

  const handleHistorySelect = useCallback(
    (scan: ScanListItem) => {
      const imgUrl = scan.image_path ? getImageUrl(scan.image_path) : null;

      if (historyPickerSlot === "A") {
        setScanA(scan);
        setImageUriA(imgUrl);
      } else {
        setScanB(scan);
        setImageUriB(imgUrl);
      }

      // Reset comparison if we're replacing a product
      setComparisonResult(null);
      hasTriggeredCompare.current = false;
    },
    [historyPickerSlot]
  );

  const handleRemove = useCallback(
    (slot: "A" | "B") => {
      if (slot === "A") {
        setScanA(null);
        setImageUriA(null);
      } else {
        setScanB(null);
        setImageUriB(null);
      }
      setComparisonResult(null);
      hasTriggeredCompare.current = false;
    },
    []
  );

  const handleChoice = useCallback(
    (choice: "A" | "B") => {
      // Delete non-preferred scan
      const scanToDelete = choice === "A" ? scanB : scanA;
      if (scanToDelete) {
        deleteMutation.mutate(scanToDelete.id);
      }

      // Navigate to history after 1s delay
      setTimeout(() => {
        router.push("/history");
      }, 1000);
    },
    [scanA, scanB, deleteMutation, router]
  );

  const isAnalyzing = analyzeMutation.isPending;
  const isComparing = compareMutation.isPending;

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <GitCompareArrows className="w-6 h-6 text-[var(--nt-primary)]" />
          <h1 className="text-2xl font-bold text-[var(--text-title)]">
            Compare Products
          </h1>
        </div>
        <p className="text-sm text-[var(--text-subtitle)]">
          Add two products to compare their health scores side-by-side
        </p>
      </div>

      {/* Product slots */}
      <div className="grid grid-cols-2 gap-4">
        <ProductSlot
          label="Product A"
          scan={scanA}
          imageUrl={imageUriA}
          onScanNew={() => handleScanNew("A")}
          onChooseHistory={() => handleChooseHistory("A")}
          onRemove={() => handleRemove("A")}
        />
        <ProductSlot
          label="Product B"
          scan={scanB}
          imageUrl={imageUriB}
          onScanNew={() => handleScanNew("B")}
          onChooseHistory={() => handleChooseHistory("B")}
          onRemove={() => handleRemove("B")}
        />
      </div>

      {/* Analyzing state */}
      {isAnalyzing && (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner
            size="md"
            text="Analyzing product ingredients..."
          />
        </div>
      )}

      {/* Comparing state */}
      {isComparing && !isAnalyzing && (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner
            size="md"
            text="Comparing products with AI..."
          />
        </div>
      )}

      {/* Placeholder when not both products are set */}
      {!scanA && !scanB && !isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 rounded-full bg-[var(--bg-light-green)] flex items-center justify-center mb-3">
            <GitCompareArrows className="w-8 h-8 text-[var(--nt-primary)]" />
          </div>
          <p className="text-sm text-[var(--text-subtitle)] text-center">
            Add two products above to start comparing
          </p>
        </div>
      )}

      {/* Comparison results */}
      {comparisonResult && !isComparing && !isAnalyzing && (
        <ComparisonResult
          comparison={comparisonResult}
          onChoose={handleChoice}
        />
      )}

      {/* History picker dialog (shared) */}
      <HistoryPickerDialog
        open={historyPickerOpen}
        onOpenChange={setHistoryPickerOpen}
        onSelect={handleHistorySelect}
      />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 md:p-6 pb-20 md:pb-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="md" text="Loading..." />
          </div>
        </div>
      }
    >
      <ComparePageInner />
    </Suspense>
  );
}
