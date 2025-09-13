"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  isValid?: boolean;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  description?: string;
}

export function FormField({
  label,
  htmlFor,
  error,
  isValid,
  required,
  children,
  className,
  description,
}: FormFieldProps) {
  const generatedId = React.useId();
  const fieldId = htmlFor || generatedId;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={fieldId}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          error && "text-destructive",
          isValid && !error && "text-green-700",
        )}
      >
        {label}
        {required && (
          <span className="text-destructive ml-1" aria-label="obrigatório">
            *
          </span>
        )}
        {isValid && !error && (
          <CheckCircle2 className="inline h-4 w-4 ml-2 text-green-600" />
        )}
      </Label>

      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}

      <div className="relative">
        {React.cloneElement(
          children as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
          {
            id: fieldId,
            "aria-describedby":
              [descriptionId, errorId].filter(Boolean).join(" ") || undefined,
            "aria-invalid": error ? "true" : undefined,
            className: cn(
              (
                children as React.ReactElement<
                  React.HTMLAttributes<HTMLElement>
                >
              ).props?.className,
              error && "border-destructive focus-visible:ring-destructive",
              isValid &&
                !error &&
                "border-green-500 focus-visible:ring-green-500",
            ),
          },
        )}
      </div>

      {error && (
        <div
          id={errorId}
          className="flex items-center space-x-2 text-sm text-destructive"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
