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
    <div
      className={cn(
        "flex flex-col gap-4 p-4 lg:p-6",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3 ">
            {Icon && <Icon className={`h-6 w-6 ${iconColor ?? 'text-orange-500'}`} />}
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          </div>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {action && (
          <div className="flex items-center gap-2">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
