"use client";

import * as React from "react";

import { ScrollArea, Separator } from "@/features/shared/components/ui";
import { cn } from "@/lib/utils";

import { useFilterActions } from "../hooks";
import { FilterContentProps } from "../types";

import { AccountSection } from "./AccountSection";
import { CreditCardSection } from "./CreditCardSection";
import { QuickActions } from "./QuickActions";

export const FilterContent = React.memo(({
  accounts,
  creditCards,
  filters,
  isMobile = false,
  onToggleAccount,
  onToggleCreditCard,
  onToggleAllAccounts,
  onToggleAllCreditCards,
  allAccountsSelected,
  allCreditCardsSelected,
}: FilterContentProps) => {
  const { selectAllFilters, clearAllFilters } = useFilterActions({
    accounts,
    creditCards,
    filters,
    toggleAccount: onToggleAccount,
    toggleCreditCard: onToggleCreditCard,
  });

  return (
    <div className="flex flex-col h-full">
      {/* Quick Actions - Mobile Only */}
      {isMobile && (
        <QuickActions
          onClearAll={clearAllFilters}
          onSelectAll={selectAllFilters}
        />
      )}

      <ScrollArea className={cn("flex-1", isMobile ? "max-h-[calc(100vh-200px)]" : "max-h-96")}>
        <div className={cn("space-y-4", isMobile ? "p-4" : "px-4 pt-4 pb-6")}>
          {/* Accounts Section */}
          <AccountSection
            accounts={accounts}
            allAccountsSelected={allAccountsSelected}
            isMobile={isMobile}
            selectedAccountIds={filters.accounts}
            onToggleAccount={onToggleAccount}
            onToggleAllAccounts={onToggleAllAccounts}
          />

          {/* Separator */}
          {accounts.length > 0 && creditCards.length > 0 && <Separator />}

          {/* Credit Cards Section */}
          <CreditCardSection
            allCreditCardsSelected={allCreditCardsSelected}
            creditCards={creditCards}
            isMobile={isMobile}
            selectedCreditCardIds={filters.creditCards}
            onToggleAllCreditCards={onToggleAllCreditCards}
            onToggleCreditCard={onToggleCreditCard}
          />

          {/* Empty State */}
          {accounts.length === 0 && creditCards.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className={cn(isMobile ? "text-base" : "text-sm")}>
                Nenhuma conta ou cartão encontrado
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
});

FilterContent.displayName = "FilterContent";