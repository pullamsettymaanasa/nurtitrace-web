import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth-service";
import type {
  LoginRequest,
  SignupOtpRequest,
  SignupRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from "@/types";

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
  });
}

export function useSendSignupOtp() {
  return useMutation({
    mutationFn: (data: SignupOtpRequest) => authService.sendSignupOtp(data),
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: (data: SignupRequest) => authService.signup(data),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      authService.forgotPassword(data),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (data: VerifyOtpRequest) => authService.verifyOtp(data),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) =>
      authService.resetPassword(data),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      authService.changePassword(data),
  });
}
