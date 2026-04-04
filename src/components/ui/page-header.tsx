"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightContent?: React.ReactNode;
}

export function PageHeader({ title, subtitle, showBack = false, onBack, rightContent }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 px-4 py-4 md:px-6">
      {showBack && (
        <button
          onClick={onBack || (() => router.back())}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[var(--bg-main)] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      )}
      <div className="flex-1">
        <h1 className="text-xl font-bold text-[var(--text-title)]">{title}</h1>
        {subtitle && (
          <p className="text-sm text-[var(--text-subtitle)] mt-0.5">{subtitle}</p>
        )}
      </div>
      {rightContent}
    </div>
  );
}
