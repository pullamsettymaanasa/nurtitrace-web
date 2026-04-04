import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className="relative">
        <div
          className={cn(
            "rounded-full border-2 border-[var(--nt-border)]",
            sizeClasses[size]
          )}
        />
        <div
          className={cn(
            "absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--nt-primary)] animate-spin",
            sizeClasses[size]
          )}
        />
      </div>
      {text && <p className="text-sm text-[var(--text-subtitle)]">{text}</p>}
    </div>
  );
}
