import { api } from "@/lib/api";
import type {
  UserProfileResponse,
  UpdateProfileRequest,
  HealthProfileRequest,
  DeleteAccountRequest,
  ApiResponse,
} from "@/types";

export const userService = {
  getProfile: () =>
    api.get<UserProfileResponse>("/user/profile").then((r) => r.data),

  updateProfile: (data: UpdateProfileRequest) =>
    api.put<ApiResponse>("/user/profile", data).then((r) => r.data),

  saveHealthProfile: (data: HealthProfileRequest) =>
    api.post<ApiResponse>("/user/health-profile", data).then((r) => r.data),

  deleteAccount: (data: DeleteAccountRequest) =>
    api.delete<ApiResponse>("/user/account", { data }).then((r) => r.data),
};
