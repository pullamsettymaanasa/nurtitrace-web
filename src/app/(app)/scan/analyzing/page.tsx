"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { useAnalyzeScan } from "@/hooks/use-scan";
import { useScanFlowStore } from "@/stores/scan-store";

export default function AnalyzingPage() {
  const router = useRouter();
  const capturedImage = useScanFlowStore((s) => s.capturedImage);
  const clearScanFlow = useScanFlowStore((s) => s.clearScanFlow);
  const analyzeMutation = useAnalyzeScan();
  const hasStarted = useRef(false);

  // Redirect if no image
  useEffect(() => {
    if (!capturedImage) {
      router.replace("/scan");
    }
  }, [capturedImage, router]);

  // Trigger analysis on mount
  useEffect(() => {
    if (!capturedImage || hasStarted.current) return;
    hasStarted.current = true;

    analyzeMutation
      .mutateAsync({ file: capturedImage })
      .then((result) => {
        const scanId = result.scan.id;
        clearScanFlow();
        router.replace(`/scan/${scanId}`);
      })
      .catch((err) => {
        const message =
          err instanceof Error ? err.message : "Analysis failed. Please try again.";
        toast.error(message);
        clearScanFlow();
        router.replace("/scan");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capturedImage]);

  if (!capturedImage) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-white min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 px-6">
        {/* Animated concentric rings */}
        <div className="relative w-[120px] h-[120px] flex items-center justify-center">
          {/* Outer ring - pulse */}
          <div
            className="absolute inset-0 rounded-full border-2 animate-analyzing-pulse"
            style={{ borderColor: "var(--nt-primary)" }}
          />
          {/* Inner ring - spin */}
          <div className="absolute inset-[16px] rounded-full border-2 border-transparent border-t-[var(--nt-primary)] border-r-[var(--nt-primary)] animate-spin" />
          {/* Center icon */}
          <div className="relative z-10">
            <Zap className="w-10 h-10" style={{ color: "var(--nt-primary)" }} />
          </div>
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-[var(--text-title)]">
            Analyzing...
          </h2>
          <p className="text-sm text-[var(--text-subtitle)] mt-1">
            Extracting ingredients and checking risk.
          </p>
        </div>
      </div>

      {/* CSS keyframes */}
      <style jsx>{`
        @keyframes analyzing-pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.08);
          }
        }
        .animate-analyzing-pulse {
          animation: analyzing-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
