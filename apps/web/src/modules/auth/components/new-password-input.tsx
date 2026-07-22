"use client";

import * as React from "react";
import { Check, X } from "lucide-react";

import { passwordRules } from "@/modules/auth/lib/password";
import { PasswordInput } from "@/shared/components/ui/password-input";
import { cn } from "@/shared/lib/utils";

function NewPasswordInput({
  value,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  const password = typeof value === "string" ? value : "";

  return (
    <div className="flex flex-col gap-2">
      <PasswordInput value={value} {...props} />
      {password.length > 0 && (
        <ul className="grid gap-1 text-xs">
          {passwordRules.map((rule) => {
            const passed = rule.validate(password);
            return (
              <li
                key={rule.id}
                className={cn(
                  "flex items-center gap-1.5 transition-colors",
                  passed
                    ? "text-emerald-600 dark:text-emerald-500"
                    : "text-muted-foreground",
                )}
              >
                {passed ? (
                  <Check className="size-3.5 shrink-0" aria-hidden />
                ) : (
                  <X className="size-3.5 shrink-0" aria-hidden />
                )}
                {rule.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export { NewPasswordInput };
