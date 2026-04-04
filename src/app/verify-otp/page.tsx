"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Leaf, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useVerifyOtp } from "@/hooks/use-auth";
import { OtpInput } from "@/components/ui/otp-input";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifyOtp = useVerifyOtp();

  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");

  function handleVerify() {
    if (otp.length !== 4) {
      toast.error("Please enter the complete 4-digit code");
      return;
    }

    verifyOtp.mutate(
      { email, otp },
      {
        onSuccess: (data) => {
          const resetToken = data.reset_token;
          router.push(
            `/new-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(resetToken)}`
          );
        },
        onError: (error: any) => {
          const msg =
            error?.response?.data?.message ||
            error?.message ||
            "Invalid or expired code. Please try again.";
          toast.error(msg);
        },
      }
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[var(--bg-light-green)] flex items-center justify-center mx-auto mb-4">
            <Leaf size={32} className="text-[var(--nt-primary)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-title)]">
            <span className="text-[var(--nt-accent)]">Nutri</span>
            <span className="text-[var(--cyan)]">Trace</span>
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-6 shadow-[var(--card-shadow)] border border-[var(--nt-border)]">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-[var(--bg-light-green)] flex items-center justify-center mb-4">
              <Mail size={28} className="text-[var(--nt-primary)]" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--text-title)]">
              Check your email
            </h2>
            <p className="text-sm text-[var(--text-subtitle)] mt-1">
              We sent a verification code to{" "}
              <span className="font-medium text-[var(--text-title)]">
                {email}
              </span>
            </p>
          </div>

          <div className="mb-6">
            <OtpInput length={4} value={otp} onChange={setOtp} />
          </div>

          <button
            onClick={handleVerify}
            disabled={otp.length !== 4 || verifyOtp.isPending}
            className="w-full h-12 rounded-xl bg-[var(--nt-primary)] hover:bg-[var(--primary-hover)] text-white font-semibold text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {verifyOtp.isPending ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-[var(--nt-primary)]" />
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
