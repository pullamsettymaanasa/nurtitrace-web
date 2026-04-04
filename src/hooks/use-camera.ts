"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  capturePhoto: () => File | null;
  toggleCamera: () => Promise<void>;
  toggleTorch: () => Promise<void>;
  isCameraAvailable: boolean;
  isStreaming: boolean;
  isTorchOn: boolean;
  facingMode: "user" | "environment";
  error: string | null;
}

export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isCameraAvailable, setIsCameraAvailable] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [error, setError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setIsTorchOn(false);
  }, []);

  const startCamera = useCallback(
    async (mode?: "user" | "environment") => {
      try {
        setError(null);
        stopCamera();

        const currentMode = mode || facingMode;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: currentMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setIsStreaming(true);
        setIsCameraAvailable(true);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Camera access denied";
        setError(message);
        setIsCameraAvailable(false);
        setIsStreaming(false);
      }
    },
    [facingMode, stopCamera]
  );

  const capturePhoto = useCallback((): File | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    const byteString = atob(dataUrl.split(",")[1]);
    const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeString });
    const file = new File([blob], `scan-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });

    return file;
  }, []);

  const toggleCamera = useCallback(async () => {
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);
    await startCamera(newMode);
  }, [facingMode, startCamera]);

  const toggleTorch = useCallback(async () => {
    if (!streamRef.current) return;

    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      const capabilities = track.getCapabilities() as MediaTrackCapabilities & {
        torch?: boolean;
      };
      if (!capabilities.torch) return;

      const newTorchState = !isTorchOn;
      await track.applyConstraints({
        advanced: [{ torch: newTorchState } as MediaTrackConstraintSet],
      });
      setIsTorchOn(newTorchState);
    } catch {
      // Torch not supported on this device
    }
  }, [isTorchOn]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return {
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    capturePhoto,
    toggleCamera,
    toggleTorch,
    isCameraAvailable,
    isStreaming,
    isTorchOn,
    facingMode,
    error,
  };
}
