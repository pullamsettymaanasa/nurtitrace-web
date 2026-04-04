// ============ AUTH ============

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: number;
    fullname: string;
    email: string;
    phone: string;
    has_health_profile: boolean;
  };
}

export interface SignupOtpRequest {
  fullname: string;
  phone: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface SignupRequest extends SignupOtpRequest {
  otp: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  user_id: number;
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  reset_token: string;
}

export interface ResetPasswordRequest {
  email: string;
  reset_token: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

// ============ USER ============

export interface User {
  id: number;
  fullname: string;
  phone: string;
  email: string;
}

export interface HealthProfile {
  age_group: "Child" | "Teen" | "Adult" | "Senior";
  conditions: string[];
  sensitivities: string[];
}

export interface UserProfileResponse {
  success: boolean;
  user: User;
  health_profile: HealthProfile | null;
}

export interface UpdateProfileRequest {
  fullname?: string;
  phone?: string;
  email?: string;
}

export interface HealthProfileRequest {
  age_group: "Child" | "Teen" | "Adult" | "Senior";
  conditions: string[];
  sensitivities: string[];
  custom_sensitivities: string[];
}

export interface DeleteAccountRequest {
  password: string;
}

// ============ SCAN ============

export interface Ingredient {
  ingredient_name: string;
  status: "SAFE" | "CAUTION" | "AVOID";
  reason: string;
}

export interface RiskBreakdown {
  avoid_count: number;
  caution_count: number;
  safe_count: number;
}

export interface ScanResult {
  id: number;
  product_name: string;
  brand_name: string;
  score: number;
  risk_level: "LOW" | "MODERATE" | "HIGH";
  scanned_at: string;
  image_path: string;
  overview: string;
  sugar_estimate: string;
  additives_count: number;
  allergens_found: string[];
  ingredients: Ingredient[];
  risk_breakdown: RiskBreakdown;
  guidance: string[];
}

export interface ScanListItem {
  id: number;
  product_name: string;
  brand_name: string;
  score: number;
  risk_level: "LOW" | "MODERATE" | "HIGH";
  scanned_at: string;
  image_path: string;
}

export interface ScanAnalyzeResponse {
  success: boolean;
  scan: ScanResult;
}

export interface ScanHistoryResponse {
  success: boolean;
  scans: ScanListItem[];
}

export interface ScanDetailResponse {
  success: boolean;
  scan: ScanResult;
}

// ============ COMPARE ============

export interface CompareRequest {
  scan_id_a: number;
  scan_id_b: number;
}

export interface CompareProduct {
  id: number;
  name: string;
  brand: string;
  score: number;
  risk_level: "LOW" | "MODERATE" | "HIGH";
}

export interface CompareResult {
  id: number;
  product_a: CompareProduct;
  product_b: CompareProduct;
  recommendation: "A" | "B" | "EQUAL" | "NEITHER";
  summary: string;
  detailed_comparison: {
    ingredients_of_concern: string;
    overall: string;
  };
}

export interface CompareResponse {
  success: boolean;
  comparison: CompareResult;
}

// ============ DASHBOARD ============

export interface DashboardResponse {
  success: boolean;
  user: {
    fullname: string;
    has_health_profile: boolean;
  };
  latest_scans: ScanListItem[];
  total_scans: number;
  average_score: number;
}

// ============ GENERIC ============

export interface ApiResponse {
  success: boolean;
  message: string;
}

// ============ RISK HELPERS ============

export type RiskLevel = "LOW" | "MODERATE" | "HIGH";
export type IngredientStatus = "SAFE" | "CAUTION" | "AVOID";
export type AgeGroup = "Child" | "Teen" | "Adult" | "Senior";
