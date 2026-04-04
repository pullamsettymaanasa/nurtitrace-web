"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLogin } from "@/hooks/use-auth";
import { useAuthStore } from "@/stores/auth-store";
import { isValidEmail } from "@/lib/validators";

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const { setAuth, isAuthenticated, loadFromStorage } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    login.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          setAuth(data.token, data.user);
          if (data.user.has_health_profile) {
            router.push("/dashboard");
          } else {
            router.push("/onboarding/age");
          }
        },
        onError: (error: any) => {
          const msg =
            error?.response?.data?.message ||
            error?.message ||
            "Login failed. Please try again.";
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
            Welcome Back
          </h2>

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
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-[var(--text-body)]">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[var(--nt-primary)] hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtitle)]"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={login.isPending}
              className="w-full h-12 rounded-xl bg-[var(--nt-primary)] hover:bg-[var(--primary-hover)] text-white font-semibold text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {login.isPending ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-[var(--text-subtitle)] mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-[var(--nt-primary)] font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
