"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Shield, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import { PasswordChecklist } from "@/components/ui/password-checklist";
import { useChangePassword } from "@/hooks/use-auth";
import { isValidPassword } from "@/lib/validators";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function ChangePasswordPage() {
  const router = useRouter();
  const changePassword = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const newPasswordValid = isValidPassword(newPassword);
  const canSubmit =
    currentPassword.length > 0 && newPasswordValid && passwordsMatch;

  function handleSubmit() {
    if (!canSubmit) return;

    changePassword.mutate(
      {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      },
      {
        onSuccess: () => {
          setSuccessDialogOpen(true);
          // Auto-dismiss after 2s
          setTimeout(() => {
            setSuccessDialogOpen(false);
            router.back();
          }, 2000);
        },
        onError: (error: any) => {
          const msg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to change password. Please try again.";
          toast.error(msg);
        },
      }
    );
  }

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6 max-w-2xl mx-auto space-y-5">
      <PageHeader
        title="Change Password"
        subtitle="Update your account security"
        showBack
      />

      {/* ── Security Tip ── */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
        <Shield size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          Use a strong, unique password that you don&apos;t use on other sites.
        </p>
      </div>

      {/* ── Form Card ── */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--nt-border)] p-5 space-y-5">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-body)] mb-1.5">
            Current Password
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtitle)]"
            />
            <input
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full h-12 pl-10 pr-12 rounded-xl border border-[var(--nt-border)] bg-white text-[var(--text-title)] placeholder:text-[var(--text-subtitle)] focus:border-[var(--nt-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--nt-primary)]/20 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-subtitle)] hover:text-[var(--text-body)]"
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

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
              type={showNew ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-12 pl-10 pr-12 rounded-xl border border-[var(--nt-border)] bg-white text-[var(--text-title)] placeholder:text-[var(--text-subtitle)] focus:border-[var(--nt-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--nt-primary)]/20 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-subtitle)] hover:text-[var(--text-body)]"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <PasswordChecklist password={newPassword} />
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-body)] mb-1.5">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtitle)]"
            />
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-12 pl-10 pr-12 rounded-xl border border-[var(--nt-border)] bg-white text-[var(--text-title)] placeholder:text-[var(--text-subtitle)] focus:border-[var(--nt-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--nt-primary)]/20 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-subtitle)] hover:text-[var(--text-body)]"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="text-xs text-[var(--high-risk-text)] mt-1.5">
              Passwords do not match
            </p>
          )}
        </div>
      </div>

      {/* ── Button Row ── */}
      <div className="flex gap-3">
        <button
          onClick={() => router.back()}
          className="flex-1 h-12 rounded-xl bg-gray-100 text-[var(--text-body)] font-semibold text-sm hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || changePassword.isPending}
          className="flex-1 h-12 rounded-xl bg-[var(--nt-primary)] hover:bg-[var(--primary-hover)] text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {changePassword.isPending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Changing...
            </>
          ) : (
            "Change Password"
          )}
        </button>
      </div>

      {/* ── Success Dialog ── */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent showCloseButton={false}>
          <div className="flex flex-col items-center py-6">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-light-green)] flex items-center justify-center mb-4">
              <CheckCircle2
                size={36}
                className="text-[var(--nt-primary)]"
              />
            </div>
            <DialogTitle className="text-lg font-bold text-[var(--text-title)]">
              Password Changed Successfully!
            </DialogTitle>
            <DialogDescription className="text-center mt-2">
              Your password has been updated. You will be redirected shortly.
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
