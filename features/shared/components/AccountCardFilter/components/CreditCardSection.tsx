"use client";

import { CreditCard as CreditCardIcon } from "lucide-react";
import * as React from "react";

import { Toggle } from "@/features/shared/components/ui";
import { cn } from "@/lib/utils";

import { CreditCardSectionProps } from "../types";
import { getFilterAriaLabel, getToggleAllAriaLabel } from "../utils";

export const CreditCardSection = React.memo(({
  creditCards,
  selectedCreditCardIds,
  allCreditCardsSelected,
  isMobile = false,
  onToggleCreditCard,
  onToggleAllCreditCards,
}: CreditCardSectionProps) => {
  if (creditCards.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCardIcon className={cn("text-purple-500", isMobile ? "h-5 w-5" : "h-4 w-4")} />
          <span className={cn("font-medium", isMobile ? "text-base" : "text-sm")}>
            Cartões de Crédito
          </span>
        </div>
        <Toggle
          aria-label={getToggleAllAriaLabel("creditCards")}
          className={cn("text-xs", isMobile ? "min-h-[48px] px-4" : "")}
          pressed={allCreditCardsSelected}
          size={isMobile ? "default" : "sm"}
          onPressedChange={onToggleAllCreditCards}
        >
          Todos
        </Toggle>
      </div>

      <div className={cn("grid gap-2", isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2")}>
        {creditCards.map((card) => (
          <Toggle
            key={card.id}
            aria-label={getFilterAriaLabel("creditCard", card.name, selectedCreditCardIds.includes(card.id))}
            className={cn(
              "justify-start h-auto p-3 text-left",
              isMobile ? "min-h-[48px] p-4" : "min-h-[44px]"
            )}
            pressed={selectedCreditCardIds.includes(card.id)}
            variant="outline"
            onPressedChange={() => onToggleCreditCard(card.id)}
          >
            <div className="flex items-center gap-2 min-w-0 w-full">
              <CreditCardIcon className={cn("flex-shrink-0", isMobile ? "h-5 w-5" : "h-4 w-4")} />
              <span className={cn("truncate", isMobile ? "text-base" : "text-sm")}>
                {card.name}
              </span>
            </div>
          </Toggle>
        ))}
      </div>
    </div>
  );
});

CreditCardSection.displayName = "CreditCardSection";