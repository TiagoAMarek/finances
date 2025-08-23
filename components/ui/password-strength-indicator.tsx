"use client";

import * as React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    id: "length",
    label: "Pelo menos 8 caracteres",
    test: (password) => password.length >= 8,
  },
  {
    id: "uppercase",
    label: "Uma letra maiúscula",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "Uma letra minúscula",
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "Um número",
    test: (password) => /[0-9]/.test(password),
  },
  {
    id: "special",
    label: "Um caractere especial",
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

const getPasswordStrength = (password: string): number => {
  return passwordRequirements.reduce((score, requirement) => {
    return score + (requirement.test(password) ? 1 : 0);
  }, 0);
};

const getStrengthLabel = (strength: number): string => {
  if (strength === 0) return "";
  if (strength <= 1) return "Muito fraca";
  if (strength <= 2) return "Fraca";
  if (strength <= 3) return "Regular";
  if (strength <= 4) return "Forte";
  return "Muito forte";
};

const getStrengthColor = (strength: number): string => {
  if (strength === 0) return "bg-gray-200";
  if (strength <= 1) return "bg-red-500";
  if (strength <= 2) return "bg-orange-500";
  if (strength <= 3) return "bg-yellow-500";
  if (strength <= 4) return "bg-blue-500";
  return "bg-green-500";
};

export const PasswordStrengthIndicator: React.FC<
  PasswordStrengthIndicatorProps
> = ({ password, className }) => {
  const strength = getPasswordStrength(password);
  const strengthLabel = getStrengthLabel(strength);
  const strengthColor = getStrengthColor(strength);

  if (!password) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Strength bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Força da senha:</span>
          {strengthLabel && (
            <span
              className={cn(
                "font-medium",
                strength <= 1 && "text-red-600",
                strength === 2 && "text-orange-600",
                strength === 3 && "text-yellow-600",
                strength === 4 && "text-blue-600",
                strength === 5 && "text-green-600",
              )}
            >
              {strengthLabel}
            </span>
          )}
        </div>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={cn(
                "h-2 flex-1 rounded-full transition-colors duration-300",
                level <= strength ? strengthColor : "bg-gray-200",
              )}
            />
          ))}
        </div>
      </div>

      {/* Requirements checklist */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Sua senha deve conter:</p>
        <ul className="space-y-1">
          {passwordRequirements.map((requirement) => {
            const isValid = requirement.test(password);
            return (
              <li
                key={requirement.id}
                className="flex items-center space-x-2 text-sm"
              >
                {isValid ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                )}
                <span
                  className={cn(
                    "transition-colors",
                    isValid ? "text-green-700" : "text-muted-foreground",
                  )}
                >
                  {requirement.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
