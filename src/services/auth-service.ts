import { api } from "@/lib/api";
import type {
  LoginRequest,
  LoginResponse,
  SignupOtpRequest,
  SignupRequest,
  SignupResponse,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ApiResponse,
} from "@/types";

export const authService = {
  sendSignupOtp: (data: SignupOtpRequest) =>
    api.post<ApiResponse>("/auth/send-signup-otp", data).then((r) => r.data),

  signup: (data: SignupRequest) =>
    api.post<SignupResponse>("/auth/signup", data).then((r) => r.data),

  login: (data: LoginRequest) =>
    api.post<LoginResponse>("/auth/login", data).then((r) => r.data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    api.post<ApiResponse>("/auth/forgot-password", data).then((r) => r.data),

  verifyOtp: (data: VerifyOtpRequest) =>
    api.post<VerifyOtpResponse>("/auth/verify-otp", data).then((r) => r.data),

  resetPassword: (data: ResetPasswordRequest) =>
    api.post<ApiResponse>("/auth/reset-password", data).then((r) => r.data),

  changePassword: (data: ChangePasswordRequest) =>
    api.post<ApiResponse>("/auth/change-password", data).then((r) => r.data),
};
