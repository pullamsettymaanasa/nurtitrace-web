import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scanService } from "@/services/scan-service";

export function useScanHistory(search?: string) {
  return useQuery({
    queryKey: ["scans", "history", search],
    queryFn: () => scanService.getHistory(search),
    staleTime: 2 * 60 * 1000,
  });
}

export function useLatestScans() {
  return useQuery({
    queryKey: ["scans", "latest"],
    queryFn: () => scanService.getLatest(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useScanDetail(scanId: number | null) {
  return useQuery({
    queryKey: ["scans", "detail", scanId],
    queryFn: () => scanService.getDetail(scanId!),
    enabled: !!scanId,
  });
}

export function useAnalyzeScan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      file,
      productName,
      brandName,
    }: {
      file: File;
      productName?: string;
      brandName?: string;
    }) => scanService.analyze(file, productName, brandName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scans"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateScan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      scanId,
      data,
    }: {
      scanId: number;
      data: { product_name?: string; brand_name?: string };
    }) => scanService.updateScan(scanId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scans"] });
    },
  });
}

export function useDeleteScan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (scanId: number) => scanService.deleteScan(scanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scans"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
