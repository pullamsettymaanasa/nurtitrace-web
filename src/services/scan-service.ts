import { api, uploadApi } from "@/lib/api";
import type {
  ScanAnalyzeResponse,
  ScanHistoryResponse,
  ScanDetailResponse,
  ApiResponse,
} from "@/types";

export const scanService = {
  analyze: (imageFile: File, productName?: string, brandName?: string) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    if (productName) formData.append("product_name", productName);
    if (brandName) formData.append("brand_name", brandName);
    return uploadApi
      .post<ScanAnalyzeResponse>("/scan/analyze", formData)
      .then((r) => r.data);
  },

  getHistory: (search?: string) => {
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    return api
      .get<ScanHistoryResponse>(`/scan/history${params}`)
      .then((r) => r.data);
  },

  getLatest: () =>
    api.get<ScanHistoryResponse>("/scan/latest").then((r) => r.data),

  getDetail: (scanId: number) =>
    api.get<ScanDetailResponse>(`/scan/${scanId}`).then((r) => r.data),

  updateScan: (scanId: number, data: { product_name?: string; brand_name?: string }) =>
    api.put<ApiResponse>(`/scan/${scanId}`, data).then((r) => r.data),

  deleteScan: (scanId: number) =>
    api.delete<ApiResponse>(`/scan/${scanId}`).then((r) => r.data),
};
