"use client";

import { Banknote } from "lucide-react";
import * as React from "react";

import { Toggle } from "@/features/shared/components/ui";
import { cn } from "@/lib/utils";

import { AccountSectionProps } from "../types";
import { getFilterAriaLabel, getToggleAllAriaLabel } from "../utils";

export const AccountSection = React.memo(({
  accounts,
  selectedAccountIds,
  allAccountsSelected,
  isMobile = false,
  onToggleAccount,
  onToggleAllAccounts,
}: AccountSectionProps) => {
  if (accounts.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Banknote className={cn("text-blue-500", isMobile ? "h-5 w-5" : "h-4 w-4")} />
          <span className={cn("font-medium", isMobile ? "text-base" : "text-sm")}>
            Contas Bancárias
          </span>
        </div>
        <Toggle
          aria-label={getToggleAllAriaLabel("accounts")}
          className={cn("text-xs", isMobile ? "min-h-[48px] px-4" : "")}
          pressed={allAccountsSelected}
          size={isMobile ? "default" : "sm"}
          onPressedChange={onToggleAllAccounts}
        >
          Todas
        </Toggle>
      </div>

      <div className={cn("grid gap-2", isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2")}>
        {accounts.map((account) => (
          <Toggle
            key={account.id}
            aria-label={getFilterAriaLabel("account", account.name, selectedAccountIds.includes(account.id))}
            className={cn(
              "justify-start h-auto p-3 text-left",
              isMobile ? "min-h-[48px] p-4" : "min-h-[44px]"
            )}
            pressed={selectedAccountIds.includes(account.id)}
            variant="outline"
            onPressedChange={() => onToggleAccount(account.id)}
          >
            <div className="flex items-center gap-2 min-w-0 w-full">
              <Banknote className={cn("flex-shrink-0", isMobile ? "h-5 w-5" : "h-4 w-4")} />
              <span className={cn("truncate", isMobile ? "text-base" : "text-sm")}>
                {account.name}
              </span>
            </div>
          </Toggle>
        ))}
      </div>
    </div>
  );
});

AccountSection.displayName = "AccountSection";