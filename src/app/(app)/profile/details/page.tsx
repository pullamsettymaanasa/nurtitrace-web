"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import { useUserProfile, useUpdateProfile } from "@/hooks/use-user";
import { useAuthStore } from "@/stores/auth-store";

// ─── Editable Field ──────────────────────────────────────────────────
function EditableField({
  label,
  value,
  onChange,
  isEditing,
  onEditClick,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  isEditing: boolean;
  onEditClick: () => void;
  type?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Move cursor to end
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  return (
    <div>
      <label className="block text-xs font-medium text-[var(--text-subtitle)] mb-1 uppercase tracking-wide">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <input
            ref={inputRef}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 h-11 px-3 rounded-xl border border-[var(--nt-primary)] bg-white text-[var(--text-title)] focus:outline-none focus:ring-2 focus:ring-[var(--nt-primary)]/20 transition-colors"
          />
        ) : (
          <p className="flex-1 h-11 px-3 flex items-center text-sm text-[var(--text-title)]">
            {value || "Not set"}
          </p>
        )}
        <button
          type="button"
          onClick={onEditClick}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[var(--bg-light-green)] transition-colors"
        >
          <Pencil size={16} className="text-[var(--nt-primary)]" />
        </button>
      </div>
    </div>
  );
}

// ─── Loading Skeleton ────────────────────────────────────────────────
function DetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white rounded-xl p-5 border border-[var(--nt-border)] space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="h-11 bg-gray-100 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Personal Details Page ───────────────────────────────────────────
export default function PersonalDetailsPage() {
  const router = useRouter();
  const { data, isLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const { updateUser } = useAuthStore();

  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Pre-fill fields when data loads
  useEffect(() => {
    if (data?.user && !initialized) {
      setFullname(data.user.fullname || "");
      setPhone(data.user.phone || "");
      setEmail(data.user.email || "");
      setInitialized(true);
    }
  }, [data, initialized]);

  const hasChanges =
    initialized &&
    data?.user &&
    (fullname !== (data.user.fullname || "") ||
      phone !== (data.user.phone || "") ||
      email !== (data.user.email || ""));

  function handleSave() {
    if (!hasChanges || !data?.user) return;

    const updates: Record<string, string> = {};
    if (fullname !== (data.user.fullname || "")) updates.fullname = fullname;
    if (phone !== (data.user.phone || "")) updates.phone = phone;
    if (email !== (data.user.email || "")) updates.email = email;

    updateProfile.mutate(updates, {
      onSuccess: () => {
        updateUser(updates);
        setEditingField(null);
        toast.success("Changes saved successfully");
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to save changes. Please try again.";
        toast.error(msg);
      },
    });
  }

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6 max-w-2xl mx-auto space-y-5">
      <PageHeader
        title="Personal Details"
        subtitle="Manage your account information"
        showBack
      />

      {isLoading ? (
        <DetailsSkeleton />
      ) : (
        <>
          {/* ── Personal Information Card ── */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--nt-border)] p-5 space-y-4">
            <h2 className="text-base font-semibold text-[var(--text-title)]">
              Personal Information
            </h2>

            <EditableField
              label="Full Name"
              value={fullname}
              onChange={setFullname}
              isEditing={editingField === "fullname"}
              onEditClick={() =>
                setEditingField(
                  editingField === "fullname" ? null : "fullname"
                )
              }
            />

            <EditableField
              label="Phone"
              value={phone}
              onChange={setPhone}
              isEditing={editingField === "phone"}
              onEditClick={() =>
                setEditingField(editingField === "phone" ? null : "phone")
              }
              type="tel"
            />

            <EditableField
              label="Email"
              value={email}
              onChange={setEmail}
              isEditing={editingField === "email"}
              onEditClick={() =>
                setEditingField(editingField === "email" ? null : "email")
              }
              type="email"
            />
          </div>

          {/* ── Save Button ── */}
          <button
            onClick={handleSave}
            disabled={!hasChanges || updateProfile.isPending}
            className="w-full h-12 rounded-xl bg-[var(--nt-primary)] hover:bg-[var(--primary-hover)] text-white font-semibold text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {updateProfile.isPending ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save All Changes"
            )}
          </button>

          {/* ── Health Profile Card ── */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--nt-border)] p-5">
            <h2 className="text-base font-semibold text-[var(--text-title)] mb-3">
              Health Preferences
            </h2>
            <button
              onClick={() => router.push("/onboarding/age")}
              className="w-full py-3 rounded-xl border-2 border-[var(--nt-primary)] text-[var(--nt-primary)] font-semibold text-sm hover:bg-[var(--bg-light-green)] transition-colors"
            >
              Edit Health Preferences
            </button>
          </div>
        </>
      )}
    </div>
  );
}
