import { useMutation } from "@tanstack/react-query";
import { compareService } from "@/services/compare-service";
import type { CompareRequest } from "@/types";

export function useCompareProducts() {
  return useMutation({
    mutationFn: (data: CompareRequest) => compareService.compare(data),
  });
}
