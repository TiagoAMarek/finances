import * as React from "react";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
}

export function PageHeader({
  title,
  description,
  action,
  className,
  icon: Icon,
  iconColor,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 p-4 lg:p-6", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-3">
            {Icon && (
              <Icon className={`h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 ${iconColor ?? "text-orange-500"}`} />
            )}
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">{title}</h1>
          </div>
          {description && (
            <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
          )}
        </div>
        {action && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
