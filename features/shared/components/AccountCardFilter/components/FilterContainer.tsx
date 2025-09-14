"use client";

import * as React from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/features/shared/components/ui";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/features/shared/components/ui/popover";

import { FilterContainerProps } from "../types";

export const FilterContainer = React.memo(({
  children,
  triggerButton,
  isMobile,
  title,
  description,
}: FilterContainerProps) => {
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          {triggerButton}
        </SheetTrigger>
        <SheetContent className="h-[85vh] flex flex-col" side="bottom">
          <SheetHeader className="flex-shrink-0">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>
              {description}
            </SheetDescription>
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        {triggerButton}
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[min(480px,calc(100vw-2rem))] p-0">
        <div className="p-4 border-b">
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        {children}
      </PopoverContent>
    </Popover>
  );
});

FilterContainer.displayName = "FilterContainer";