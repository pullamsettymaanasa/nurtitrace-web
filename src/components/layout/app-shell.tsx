"use client";

import { AuthGuard } from "@/components/auth-guard";
import { Sidebar } from "./sidebar";
import { BottomNav } from "./bottom-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen">
        <Sidebar />
        <main className="md:ml-64 pb-20 md:pb-0 min-h-screen">
          {children}
        </main>
        <BottomNav />
      </div>
    </AuthGuard>
  );
}
