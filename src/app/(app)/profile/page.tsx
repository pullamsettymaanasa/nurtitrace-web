"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  ChevronRight,
  Key,
  FileText,
  HelpCircle,
  LogOut,
  Trash2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useUserProfile, useDeleteAccount } from "@/hooks/use-user";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// ─── Menu Row ────────────────────────────────────────────────────────
function MenuRow({
  icon: Icon,
  label,
  onClick,
  danger,
  showDivider = true,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  danger?: boolean;
  showDivider?: boolean;
}) {
  return (
    <>
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors"
      >
        <Icon
          size={20}
          className={danger ? "text-red-500" : "text-[var(--text-subtitle)]"}
        />
        <span
          className={`flex-1 text-left text-sm font-medium ${
            danger ? "text-red-500" : "text-[var(--text-title)]"
          }`}
        >
          {label}
        </span>
        {!danger && (
          <ChevronRight size={18} className="text-[var(--text-subtitle)]" />
        )}
      </button>
      {showDivider && <div className="h-px bg-[var(--border-light)] mx-4" />}
    </>
  );
}

// ─── Profile Page ────────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const { data: profileData } = useUserProfile();
  const deleteAccount = useDeleteAccount();

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const displayName =
    profileData?.user?.fullname || user?.fullname || "User";
  const displayEmail =
    profileData?.user?.email || user?.email || "";

  function handleLogout() {
    clearAuth();
    router.push("/login");
  }

  function handleDeleteAccount() {
    if (deletePassword.length < 8) return;

    deleteAccount.mutate(
      { password: deletePassword },
      {
        onSuccess: () => {
          clearAuth();
          router.push("/login");
        },
        onError: (error: any) => {
          const msg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to delete account. Please try again.";
          toast.error(msg);
        },
      }
    );
  }

  return (
    <div className="pb-20 md:pb-6 max-w-2xl mx-auto">
      {/* ── Gradient Header ── */}
      <div
        className="rounded-b-3xl px-6 pt-10 pb-8"
        style={{
          background:
            "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
        }}
      >
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3">
            <User size={36} className="text-gray-400" />
          </div>

          {/* Name & Email */}
          <h1 className="text-xl font-bold text-white">{displayName}</h1>
          <p className="text-sm text-white/80 mt-0.5">{displayEmail}</p>

          {/* Label */}
          <span className="inline-block mt-4 px-3 py-1 text-[10px] font-bold text-white/70 tracking-widest uppercase bg-white/15 rounded-full">
            Account Settings
          </span>
        </div>
      </div>

      <div className="px-4 md:px-6 space-y-4 mt-5">
        {/* ── Account Settings Card ── */}
        <div className="bg-white rounded-xl shadow-sm border border-[var(--nt-border)] overflow-hidden">
          <MenuRow
            icon={User}
            label="Personal Details"
            onClick={() => router.push("/profile/details")}
            showDivider={false}
          />
        </div>

        {/* ── Security & Legal Card ── */}
        <div className="bg-white rounded-xl shadow-sm border border-[var(--nt-border)] overflow-hidden">
          <MenuRow
            icon={Key}
            label="Change Password"
            onClick={() => router.push("/profile/change-password")}
          />
          <MenuRow
            icon={FileText}
            label="Privacy Policy"
            onClick={() => router.push("/privacy-policy")}
          />
          <MenuRow
            icon={FileText}
            label="Terms of Service"
            onClick={() => router.push("/terms-of-service")}
          />
          <MenuRow
            icon={HelpCircle}
            label="Help & App Guide"
            onClick={() => router.push("/help")}
            showDivider={false}
          />
        </div>

        {/* ── Logout Row ── */}
        <div className="bg-white rounded-xl shadow-sm border border-[var(--nt-border)] overflow-hidden">
          <MenuRow
            icon={LogOut}
            label="Log Out"
            onClick={() => setLogoutDialogOpen(true)}
            danger
            showDivider={false}
          />
        </div>

        {/* ── Delete Account Button ── */}
        <button
          onClick={() => setDeleteDialogOpen(true)}
          className="w-full py-3.5 rounded-xl border-2 border-red-500 text-red-500 font-semibold text-sm hover:bg-red-50 transition-colors"
        >
          Delete Account
        </button>

        {/* ── Version Footer ── */}
        <p className="text-center text-xs text-[var(--text-subtitle)] py-4">
          NutriTrace Web v1.0
        </p>
      </div>

      {/* ── Logout Dialog ── */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent showCloseButton={false}>
          {/* Amber Header */}
          <div className="flex flex-col items-center py-4">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-3">
              <AlertTriangle size={28} className="text-amber-500" />
            </div>
            <DialogTitle className="text-lg font-bold text-[var(--text-title)]">
              Log Out
            </DialogTitle>
            <DialogDescription className="text-center mt-1">
              Are you sure you want to log out?
            </DialogDescription>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setLogoutDialogOpen(false)}
              className="flex-1 py-3 rounded-xl bg-gray-100 text-[var(--text-body)] font-semibold text-sm hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors"
            >
              Log Out
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Account Dialog ── */}
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setDeletePassword("");
        }}
      >
        <DialogContent showCloseButton={false}>
          {/* Red Header */}
          <div className="flex flex-col items-center py-4">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-3">
              <Trash2 size={28} className="text-red-500" />
            </div>
            <DialogTitle className="text-lg font-bold text-[var(--text-title)]">
              Delete Account
            </DialogTitle>
          </div>

          {/* Warning Box */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-1.5">
            <p className="text-sm text-red-700 font-medium">
              All your scans and health data will be permanently deleted.
            </p>
            <p className="text-xs text-red-600">
              This action cannot be undone.
            </p>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-body)] mb-1.5">
              Enter your password to confirm
            </label>
            <input
              type="password"
              placeholder="Your password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-[var(--nt-border)] bg-white text-[var(--text-title)] placeholder:text-[var(--text-subtitle)] focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeletePassword("");
              }}
              className="flex-1 py-3 rounded-xl bg-gray-100 text-[var(--text-body)] font-semibold text-sm hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deletePassword.length < 8 || deleteAccount.isPending}
              className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {deleteAccount.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Forever"
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
