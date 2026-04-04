import Link from "next/link";
import { Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[var(--bg-light-green)] flex items-center justify-center">
            <Leaf className="w-8 h-8 text-[var(--nt-primary)]" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[var(--text-title)] mb-2">
          Page Not Found
        </h1>

        <p className="text-[var(--text-body)] mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center bg-[var(--nt-primary)] hover:bg-[var(--primary-hover)] text-white rounded-[var(--nt-radius-md)] px-8 py-3 text-base font-semibold transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
