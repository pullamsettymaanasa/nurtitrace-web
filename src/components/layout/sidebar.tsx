"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  GitCompareArrows,
  ScanLine,
  Clock,
  User,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/compare", icon: GitCompareArrows, label: "Compare" },
  { href: "/scan", icon: ScanLine, label: "Scan" },
  { href: "/history", icon: Clock, label: "History" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-[var(--nt-border)] fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[var(--nt-border)]">
        <div className="w-10 h-10 rounded-xl bg-[var(--nt-primary)] flex items-center justify-center">
          <Leaf size={20} className="text-white" />
        </div>
        <div>
          <span className="text-lg font-bold text-[var(--nt-accent)]">Nutri</span>
          <span className="text-lg font-bold text-[var(--cyan)]">Trace</span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-[var(--accent-light)] text-[var(--nt-primary)]"
                  : "text-[var(--text-subtitle)] hover:bg-[var(--bg-main)]"
              )}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Version footer */}
      <div className="px-6 py-4 border-t border-[var(--nt-border)]">
        <p className="text-xs text-[var(--text-subtitle)]">NutriTrace Web v1.0</p>
      </div>
    </aside>
  );
}
