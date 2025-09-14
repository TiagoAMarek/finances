"use client";

import { Check, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/features/shared/components/ui";

import { QuickActionsProps } from "../types";

export const QuickActions = React.memo(({ onSelectAll, onClearAll }: QuickActionsProps) => {
  return (
    <div className="flex gap-2 p-4 border-b">
      <Button
        aria-label="Selecionar todos os filtros"
        className="flex-1 min-h-[48px]"
        size="sm"
        variant="outline"
        onClick={onSelectAll}
      >
        <Check className="h-4 w-4 mr-2" />
        Selecionar Todos
      </Button>
      <Button
        aria-label="Limpar todos os filtros"
        className="flex-1 min-h-[48px]"
        size="sm"
        variant="outline"
        onClick={onClearAll}
      >
        <X className="h-4 w-4 mr-2" />
        Limpar Todos
      </Button>
    </div>
  );
});

QuickActions.displayName = "QuickActions";