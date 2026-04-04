"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useResetPassword } from "@/hooks/use-auth";
import { isValidPassword } from "@/lib/validators";
import { PasswordChecklist } from "@/components/ui/password-checklist";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

function NewPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPassword = useResetPassword();

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const passwordValid = isValidPassword(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const canSubmit = passwordValid && passwordsMatch;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!canSubmit) return;

    resetPassword.mutate(
      {
        email,
        reset_token: token,
        new_password: password,
        confirm_password: confirmPassword,
      },
      {
        onSuccess: () => {
          setSuccessDialogOpen(true);
          setTimeout(() => {
            setSuccessDialogOpen(false);
            router.push("/login");
          }, 2500);
        },
        onError: (error: any) => {
          const msg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to reset password. Please try again.";
          toast.error(msg);
        },
      }
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[var(--text-body)] hover:text-[var(--text-title)] mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl p-6 shadow-[var(--card-shadow)] border border-[var(--nt-border)]">
          <h2 className="text-xl font-semibold text-[var(--text-title)] mb-2">
            New Password
          </h2>
          <p className="text-sm text-[var(--text-subtitle)] mb-6">
            Create a strong new password for your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-body)] mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtitle)]"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs text-[var(--high-risk-text)] mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit || resetPassword.isPending}
              className="w-full h-12 rounded-xl bg-[var(--nt-primary)] hover:bg-[var(--primary-hover)] text-white font-semibold text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {resetPassword.isPending ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-xs">
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-light-green)] flex items-center justify-center mb-4">
              <CheckCircle2 size={40} className="text-[var(--nt-primary)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-title)]">
              Password Reset Successful!
            </h3>
            <p className="text-sm text-[var(--text-subtitle)] mt-1">
              Redirecting to login...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function NewPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-[var(--nt-primary)]" />
        </div>
      }
    >
      <NewPasswordContent />
    </Suspense>
  );
}
