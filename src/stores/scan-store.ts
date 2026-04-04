import { create } from "zustand";

interface ScanFlowState {
  capturedImage: File | null;
  imagePreviewUrl: string | null;
  returnTo: string | null;
  compareSlot: "A" | "B" | null;

  setCapturedImage: (file: File) => void;
  setReturnTo: (route: string | null, slot?: "A" | "B") => void;
  clearScanFlow: () => void;
}

export const useScanFlowStore = create<ScanFlowState>((set, get) => ({
  capturedImage: null,
  imagePreviewUrl: null,
  returnTo: null,
  compareSlot: null,

  setCapturedImage: (file) => {
    const prev = get().imagePreviewUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({
      capturedImage: file,
      imagePreviewUrl: URL.createObjectURL(file),
    });
  },

  setReturnTo: (route, slot) =>
    set({ returnTo: route, compareSlot: slot || null }),

  clearScanFlow: () => {
    const prev = get().imagePreviewUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({
      capturedImage: null,
      imagePreviewUrl: null,
      returnTo: null,
      compareSlot: null,
    });
  },
}));
