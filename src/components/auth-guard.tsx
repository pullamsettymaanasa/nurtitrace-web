"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check localStorage directly for SSR hydration race
    const storedToken = localStorage.getItem("auth_token");
    if (!storedToken) {
      router.replace("/login");
    }
  }, [router]);

  // Show nothing while checking auth
  if (!isAuthenticated && typeof window !== "undefined" && !localStorage.getItem("auth_token")) {
    return null;
  }

  return <>{children}</>;
}
