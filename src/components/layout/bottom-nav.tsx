"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, GitCompareArrows, ScanLine, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/compare", icon: GitCompareArrows, label: "Compare" },
  { href: "/scan", icon: ScanLine, label: "Scan", isCenter: true },
  { href: "/history", icon: Clock, label: "History" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[var(--nt-border)] md:hidden">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className="flex items-center justify-center w-14 h-14 -mt-5 rounded-full bg-[var(--nt-primary)] text-white shadow-lg hover:bg-[var(--primary-hover)] transition-colors"
              >
                <Icon size={24} />
              </button>
            );
          }

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors",
                isActive
                  ? "text-[var(--nav-active)]"
                  : "text-[var(--nav-inactive)]"
              )}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
