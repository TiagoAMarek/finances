"use client";

import { Filter } from "lucide-react";
import * as React from "react";

import { Badge, Button } from "@/features/shared/components/ui";
import { useIsMobile } from "@/features/shared/hooks";
import { cn } from "@/lib/utils";

interface FilterTriggerButtonProps {
  activeFiltersCount: number;
  totalFiltersCount: number;
  hasActiveFilters: boolean;
  className?: string;
}

export const FilterTriggerButton = React.memo(
  React.forwardRef<HTMLButtonElement, FilterTriggerButtonProps>(
    ({ activeFiltersCount, totalFiltersCount, hasActiveFilters, className, ...props }, ref) => {
      const isMobile = useIsMobile();

      return (
        <Button
          ref={ref}
          aria-label={`Filtros - ${activeFiltersCount} de ${totalFiltersCount} selecionados`}
          className={cn(
            "flex items-center gap-2",
            isMobile ? "min-h-[48px] px-4" : "",
            className
          )}
          size={isMobile ? "default" : "sm"}
          variant="outline"
          {...props}
        >
          <Filter className={cn(isMobile ? "h-5 w-5" : "h-4 w-4")} />
          <span className={cn(isMobile ? "inline" : "hidden xs:inline sm:inline")}>
            Filtros
          </span>
          <Badge
            className={cn("text-xs", isMobile ? "text-sm" : "")}
            variant={hasActiveFilters ? "default" : "secondary"}
          >
            {activeFiltersCount}/{totalFiltersCount}
          </Badge>
        </Button>
      );
    }
  )
);

FilterTriggerButton.displayName = "FilterTriggerButton";