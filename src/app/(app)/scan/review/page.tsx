"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useScanFlowStore } from "@/stores/scan-store";

export default function ReviewPage() {
  const router = useRouter();
  const imagePreviewUrl = useScanFlowStore((s) => s.imagePreviewUrl);
  const clearScanFlow = useScanFlowStore((s) => s.clearScanFlow);

  // Redirect to /scan if no image
  useEffect(() => {
    if (!imagePreviewUrl) {
      router.replace("/scan");
    }
  }, [imagePreviewUrl, router]);

  if (!imagePreviewUrl) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={() => {
            clearScanFlow();
            router.push("/scan");
          }}
          className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <span className="text-white text-sm font-bold tracking-wider uppercase">
          Review Image
        </span>
        <div className="w-10" />
      </div>

      {/* Image preview */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <img
          src={imagePreviewUrl}
          alt="Captured scan"
          className="max-w-full max-h-full object-contain rounded-lg"
        />
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 px-6 pb-8 pt-4 flex items-center justify-center gap-4">
        <button
          onClick={() => {
            clearScanFlow();
            router.push("/scan");
          }}
          className="flex-1 max-w-[160px] py-3.5 rounded-full bg-gray-600 text-white font-semibold text-sm text-center hover:bg-gray-700 transition-colors"
        >
          Retake
        </button>
        <button
          onClick={() => router.push("/scan/analyzing")}
          className="flex-1 max-w-[160px] py-3.5 rounded-full text-white font-semibold text-sm text-center hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "var(--nt-primary)" }}
        >
          Analyze Text
        </button>
      </div>
    </div>
  );
}
