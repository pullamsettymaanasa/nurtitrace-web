"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForgotPassword } from "@/hooks/use-auth";
import { isValidEmail } from "@/lib/validators";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const forgotPassword = useForgotPassword();

  const [email, setEmail] = useState("");

  const emailValid = isValidEmail(email);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!emailValid) {
      toast.error("Please enter a valid email address");
      return;
    }

    forgotPassword.mutate(
      { email },
      {
        onSuccess: () => {
          router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
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
            Reset Password
          </h2>
          <p className="text-sm text-[var(--text-subtitle)] mb-6">
            Enter your email address and we&apos;ll send you a verification code
            to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-[var(--nt-border)] bg-white text-[var(--text-title)] placeholder:text-[var(--text-subtitle)] focus:border-[var(--nt-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--nt-primary)]/20 transition-colors"
                />
              </div>
              {email.length > 0 && !emailValid && (
                <p className="text-xs text-[var(--high-risk-text)] mt-1">
                  Please enter a valid email address
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!emailValid || forgotPassword.isPending}
              className="w-full h-12 rounded-xl bg-[var(--nt-primary)] hover:bg-[var(--primary-hover)] text-white font-semibold text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {forgotPassword.isPending ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
