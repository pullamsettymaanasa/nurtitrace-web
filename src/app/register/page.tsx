"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Leaf,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useSignup, useSendSignupOtp } from "@/hooks/use-auth";
import { useAuthStore } from "@/stores/auth-store";
import {
  isValidEmail,
  isValidPhone,
  isValidFullname,
  isValidPassword,
} from "@/lib/validators";
import { PasswordChecklist } from "@/components/ui/password-checklist";
import { OtpInput } from "@/components/ui/otp-input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function RegisterPage() {
  const router = useRouter();
  const sendOtp = useSendSignupOtp();
  const signup = useSignup();
  const { setAuth, isAuthenticated, loadFromStorage } = useAuthStore();

  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP dialog state
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");

  // Success dialog state
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  // Touched states for real-time validation
  const [touched, setTouched] = useState({
    fullname: false,
    phone: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // Redirect if already authenticated
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const validations = {
    fullname: isValidFullname(fullname),
    phone: isValidPhone(phone),
    email: isValidEmail(email),
    password: isValidPassword(password),
    confirmPassword: confirmPassword === password && confirmPassword.length > 0,
  };

  const allValid = Object.values(validations).every(Boolean);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Mark all as touched
    setTouched({
      fullname: true,
      phone: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!allValid) {
      toast.error("Please fix all validation errors before proceeding");
      return;
    }

    sendOtp.mutate(
      { fullname, phone, email, password, confirm_password: confirmPassword },
      {
        onSuccess: () => {
          setOtp("");
          setOtpDialogOpen(true);
        },
        onError: (error: any) => {
          const msg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to send OTP. Please try again.";
          toast.error(msg);
        },
      }
    );
  }

  function handleVerifyOtp() {
    if (otp.length !== 4) {
      toast.error("Please enter the complete 4-digit OTP");
      return;
    }

    signup.mutate(
      {
        fullname,
        phone,
        email,
        password,
        confirm_password: confirmPassword,
        otp,
      },
      {
        onSuccess: (data) => {
          setOtpDialogOpen(false);
          setAuth(data.token, {
            id: data.user_id,
            fullname,
            email,
            phone,
            has_health_profile: false,
          });
          setSuccessDialogOpen(true);
          setTimeout(() => {
            setSuccessDialogOpen(false);
            router.push("/onboarding/age");
          }, 2000);
        },
        onError: (error: any) => {
          const msg =
            error?.response?.data?.message ||
            error?.message ||
            "Verification failed. Please try again.";
          toast.error(msg);
        },
      }
    );
  }

  function handleResendOtp() {
    sendOtp.mutate(
      { fullname, phone, email, password, confirm_password: confirmPassword },
      {
        onSuccess: () => {
          toast.success("OTP resent to your email");
        },
        onError: (error: any) => {
          const msg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to resend OTP.";
          toast.error(msg);
        },
      }
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[var(--bg-light-green)] flex items-center justify-center mx-auto mb-4">
            <Leaf size={32} className="text-[var(--nt-primary)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-title)]">
            <span className="text-[var(--nt-accent)]">Nutri</span>
            <span className="text-[var(--cyan)]">Trace</span>
          </h1>
          <p className="text-sm text-[var(--text-subtitle)] mt-1">
            Scan. Understand. Choose Better.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-6 shadow-[var(--card-shadow)] border border-[var(--nt-border)]">
          <h2 className="text-xl font-semibold text-[var(--text-title)] mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-body)] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtitle)]"
                />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  onBlur={() =>
                    setTouched((t) => ({ ...t, fullname: true }))
                  }
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-[var(--nt-border)] bg-white text-[var(--text-title)] placeholder:text-[var(--text-subtitle)] focus:border-[var(--nt-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--nt-primary)]/20 transition-colors"
                />
              </div>
              {touched.fullname && !validations.fullname && (
                <p className="text-xs text-[var(--high-risk-text)] mt-1">
                  Name must be at least 3 characters (letters and spaces only)
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-body)] mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtitle)]"
                />
                <input
                  type="tel"
                  placeholder="10-digit phone number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-[var(--nt-border)] bg-white text-[var(--text-title)] placeholder:text-[var(--text-subtitle)] focus:border-[var(--nt-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--nt-primary)]/20 transition-colors"
                />
              </div>
              {touched.phone && !validations.phone && (
                <p className="text-xs text-[var(--high-risk-text)] mt-1">
                  Phone number must be exactly 10 digits
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-body)] mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtitle)]"
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-[var(--nt-border)] bg-white text-[var(--text-title)] placeholder:text-[var(--text-subtitle)] focus:border-[var(--nt-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--nt-primary)]/20 transition-colors"
                />
              </div>
              {touched.email && !validations.email && (
                <p className="text-xs text-[var(--high-risk-text)] mt-1">
                  Please enter a valid email address
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-body)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtitle)]"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() =>
                    setTouched((t) => ({ ...t, password: true }))
                  }
                  className="w-full h-12 pl-10 pr-12 rounded-xl border border-[var(--nt-border)] bg-white text-[var(--text-title)] placeholder:text-[var(--text-subtitle)] focus:border-[var(--nt-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--nt-primary)]/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-subtitle)] hover:text-[var(--text-body)]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password.length > 0 && <PasswordChecklist password={password} />}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-body)] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtitle)]"
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() =>
                    setTouched((t) => ({ ...t, confirmPassword: true }))
                  }
                  className="w-full h-12 pl-10 pr-12 rounded-xl border border-[var(--nt-border)] bg-white text-[var(--text-title)] placeholder:text-[var(--text-subtitle)] focus:border-[var(--nt-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--nt-primary)]/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-subtitle)] hover:text-[var(--text-body)]"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {touched.confirmPassword && !validations.confirmPassword && (
                <p className="text-xs text-[var(--high-risk-text)] mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!allValid || sendOtp.isPending}
              className="w-full h-12 rounded-xl bg-[var(--nt-primary)] hover:bg-[var(--primary-hover)] text-white font-semibold text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {sendOtp.isPending ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-sm text-[var(--text-subtitle)] mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[var(--nt-primary)] font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>

      {/* OTP Verification Dialog */}
      <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-sm">
          <DialogHeader className="items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[var(--bg-light-green)] flex items-center justify-center mx-auto mb-2">
              <Mail size={28} className="text-[var(--nt-primary)]" />
            </div>
            <DialogTitle className="text-lg">Verify Your Email</DialogTitle>
            <DialogDescription className="text-[var(--text-subtitle)]">
              We sent a verification code to{" "}
              <span className="font-medium text-[var(--text-title)]">
                {email}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <OtpInput length={4} value={otp} onChange={setOtp} />
          </div>

          <button
            onClick={handleVerifyOtp}
            disabled={otp.length !== 4 || signup.isPending}
            className="w-full h-12 rounded-xl bg-[var(--nt-primary)] hover:bg-[var(--primary-hover)] text-white font-semibold text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {signup.isPending ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & Create Account"
            )}
          </button>

          <p className="text-center text-sm text-[var(--text-subtitle)] mt-2">
            Didn&apos;t receive the code?{" "}
            <button
              onClick={handleResendOtp}
              disabled={sendOtp.isPending}
              className="text-[var(--nt-primary)] font-semibold hover:underline disabled:opacity-60"
            >
              Resend Code
            </button>
          </p>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-xs">
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-light-green)] flex items-center justify-center mb-4">
              <CheckCircle2 size={40} className="text-[var(--nt-primary)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-title)]">
              Account Created!
            </h3>
            <p className="text-sm text-[var(--text-subtitle)] mt-1">
              Redirecting to setup your profile...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
