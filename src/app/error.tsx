"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[var(--high-risk-bg)] flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-[var(--high-risk)]" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[var(--text-title)] mb-2">
          Something went wrong
        </h1>

        <p className="text-[var(--text-body)] mb-8">
          An unexpected error occurred. Please try again or return to the home
          page.
        </p>

        <Button
          onClick={reset}
          className="bg-[var(--nt-primary)] hover:bg-[var(--primary-hover)] text-white rounded-[var(--nt-radius-md)] px-8 py-3 text-base font-semibold"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
