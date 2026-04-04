import { Check, X } from "lucide-react";
import { checkPassword } from "@/lib/validators";

interface PasswordChecklistProps {
  password: string;
}

export function PasswordChecklist({ password }: PasswordChecklistProps) {
  const checks = checkPassword(password);

  const items = [
    { label: "Minimum 8 characters", met: checks.minLength },
    { label: "At least 1 uppercase letter", met: checks.hasUpper },
    { label: "At least 1 lowercase letter", met: checks.hasLower },
    { label: "At least 1 number", met: checks.hasDigit },
    { label: "At least 1 special character (!@#$%^&*)", met: checks.hasSpecial },
  ];

  return (
    <div className="space-y-1.5 mt-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2 text-xs">
          {item.met ? (
            <Check size={14} className="text-[var(--safe-text)] shrink-0" />
          ) : (
            <X size={14} className="text-[var(--high-risk-text)] shrink-0" />
          )}
          <span className={item.met ? "text-[var(--safe-text)]" : "text-[var(--text-subtitle)]"}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
