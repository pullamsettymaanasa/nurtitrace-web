"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ArrowLeft, AlertTriangle, Trash2, Mail, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { config } from "@/lib/config";

export default function DeleteAccountPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Step 1: Login to get token
      const loginRes = await axios.post(`${config.apiUrl}/auth/login`, {
        email,
        password,
      });

      const token = loginRes.data.token;

      // Step 2: Delete account with token
      await axios.delete(`${config.apiUrl}/user/account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { password },
      });

      setSuccess(true);
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to delete account. Please check your credentials and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--safe-bg)] flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-[var(--safe-text)]" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-title)] mb-2">Account Deleted</h2>
          <p className="text-sm text-[var(--text-subtitle)] mb-6">
            Your account and all associated data have been permanently deleted.
          </p>
          <Link href="/">
            <Button className="bg-[var(--nt-primary)] hover:bg-[var(--primary-hover)] w-full">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--nt-border)] px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-[var(--text-title)] hover:opacity-70 transition-opacity">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[var(--text-title)]">Delete Account</h1>
            <p className="text-xs text-[var(--text-subtitle)]">Permanently remove your data</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 py-8">
        {/* Warning Box */}
        <div className="bg-[var(--high-risk-bg)] border border-[var(--high-risk-border)] rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-[var(--high-risk-text)] flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold text-[var(--high-risk-text)] mb-2">
                This action is irreversible
              </h2>
              <ul className="text-[13px] text-[var(--high-risk-text)] space-y-1">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--high-risk-text)] flex-shrink-0" />
                  All your scans and health data will be permanently deleted
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--high-risk-text)] flex-shrink-0" />
                  This action cannot be undone
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleDelete} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--high-risk-bg)] flex items-center justify-center">
              <Trash2 size={20} className="text-[var(--high-risk)]" />
            </div>
            <h3 className="text-base font-semibold text-[var(--text-title)]">Confirm Deletion</h3>
          </div>

          <p className="text-sm text-[var(--text-subtitle)]">
            Enter your account credentials to permanently delete your account.
          </p>

          {error && (
            <div className="bg-[var(--high-risk-bg)] text-[var(--high-risk-text)] text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-[var(--text-title)] mb-1.5 block">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtitle)]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-[var(--nt-border)] bg-white text-sm text-[var(--text-title)] placeholder:text-[var(--text-subtitle)] focus:outline-none focus:ring-2 focus:ring-[var(--nt-primary)] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text-title)] mb-1.5 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtitle)]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-[var(--nt-border)] bg-white text-sm text-[var(--text-title)] placeholder:text-[var(--text-subtitle)] focus:outline-none focus:ring-2 focus:ring-[var(--nt-primary)] focus:border-transparent"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-[var(--high-risk)] hover:bg-[var(--high-risk-text)] text-white"
          >
            {loading ? "Deleting Account..." : "Delete My Account"}
          </Button>
        </form>
      </main>
    </div>
  );
}
