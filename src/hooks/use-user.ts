import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user-service";
import type {
  UpdateProfileRequest,
  HealthProfileRequest,
  DeleteAccountRequest,
} from "@/types";

export function useUserProfile() {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => userService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => userService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
  });
}

export function useSaveHealthProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: HealthProfileRequest) =>
      userService.saveHealthProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: (data: DeleteAccountRequest) => userService.deleteAccount(data),
  });
}
