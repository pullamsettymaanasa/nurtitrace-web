import { api } from "@/lib/api";
import type { CompareRequest, CompareResponse } from "@/types";

export const compareService = {
  compare: (data: CompareRequest) =>
    api.post<CompareResponse>("/compare", data).then((r) => r.data),
};
