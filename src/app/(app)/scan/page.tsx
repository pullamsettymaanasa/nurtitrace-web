"use client";

import { useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Image as ImageIcon, Zap, Upload } from "lucide-react";
import { useCamera } from "@/hooks/use-camera";
import { useScanFlowStore } from "@/stores/scan-store";

function ScanPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    capturePhoto,
    toggleTorch,
    isCameraAvailable,
    isStreaming,
    isTorchOn,
    error,
  } = useCamera();
  const { setCapturedImage, setReturnTo } = useScanFlowStore();

  // Handle returnTo search params
  useEffect(() => {
    const returnTo = searchParams.get("returnTo");
    const slot = searchParams.get("slot") as "A" | "B" | null;
    if (returnTo) {
      setReturnTo(returnTo, slot || undefined);
    }
  }, [searchParams, setReturnTo]);

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = useCallback(() => {
    const file = capturePhoto();
    if (file) {
      setCapturedImage(file);
      stopCamera();
      router.push("/scan/review");
    }
  }, [capturePhoto, setCapturedImage, stopCamera, router]);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setCapturedImage(file);
        stopCamera();
        router.push("/scan/review");
      }
    },
    [setCapturedImage, stopCamera, router]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        setCapturedImage(file);
        stopCamera();
        router.push("/scan/review");
      }
    },
    [setCapturedImage, stopCamera, router]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const showFallback = !isCameraAvailable || !!error;

  return (
    <div className="fixed inset-0 z-50 bg-black min-h-screen flex flex-col">
      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={() => router.push("/dashboard")}
          className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <span className="text-white text-sm font-bold tracking-wider uppercase">
          Scan Ingredients
        </span>
        <div className="w-10" />
      </div>

      {showFallback ? (
        /* ── Fallback: Upload Mode ── */
        <div
          className="flex-1 flex items-center justify-center px-6"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-sm p-8 border-2 border-dashed border-white/30 rounded-2xl flex flex-col items-center gap-4 hover:border-white/50 transition-colors cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-white/70" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-base">
                Drop an image here or click to upload
              </p>
              <p className="text-white/50 text-sm mt-1">
                Supports JPEG and PNG
              </p>
            </div>
          </button>
        </div>
      ) : (
        /* ── Camera Mode ── */
        <>
          {/* Camera feed area */}
          <div className="flex-1 relative flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Scan frame overlay */}
            {isStreaming && (
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className="border-2 border-dashed border-white/60 rounded-2xl"
                  style={{ width: "280px", height: "320px" }}
                />
                <p className="text-white/70 text-sm mt-4 text-center px-4">
                  Position ingredients within the frame
                </p>
              </div>
            )}

            {/* Loading indicator when camera is starting */}
            {!isStreaming && !error && (
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <p className="text-white/60 text-sm">Starting camera...</p>
              </div>
            )}
          </div>

          {/* Bottom controls sheet */}
          <div className="relative z-10 bg-white rounded-t-3xl px-6 pt-6 pb-8">
            <div className="flex items-center justify-between">
              {/* Gallery button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <ImageIcon className="w-6 h-6 text-gray-600" />
              </button>

              {/* Capture button */}
              <button
                onClick={handleCapture}
                disabled={!isStreaming}
                className="w-20 h-20 rounded-full flex items-center justify-center disabled:opacity-50 transition-all"
                style={{ backgroundColor: "var(--nt-primary)" }}
              >
                <div className="w-16 h-16 rounded-full bg-white border-4 border-white/50" />
              </button>

              {/* Flash toggle */}
              <button
                onClick={toggleTorch}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isTorchOn
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Zap className={`w-6 h-6 ${isTorchOn ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      <ScanPageInner />
    </Suspense>
  );
}
