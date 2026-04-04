import { api } from "@/lib/api";
import type { DashboardResponse } from "@/types";

export const dashboardService = {
  getDashboard: () =>
    api.get<DashboardResponse>("/dashboard").then((r) => r.data),
};
