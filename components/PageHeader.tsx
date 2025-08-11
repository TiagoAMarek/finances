import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "bg-background/90 sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear",
        className
      )}
    >
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-base font-medium">{title}</h1>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {action && (
          <div className="ml-auto flex items-center gap-2">
            {action}
          </div>
        )}
      </div>
    </header>
  );
}