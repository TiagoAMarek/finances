import { useCallback } from "react";

import { UseFilterActionsProps } from "../types";

export function useFilterActions({
  accounts,
  creditCards,
  filters,
  toggleAccount,
  toggleCreditCard,
}: UseFilterActionsProps) {
  const clearAllFilters = useCallback(() => {
    accounts.forEach(account => {
      if (filters.accounts.includes(account.id)) {
        toggleAccount(account.id);
      }
    });
    creditCards.forEach(card => {
      if (filters.creditCards.includes(card.id)) {
        toggleCreditCard(card.id);
      }
    });
  }, [accounts, creditCards, filters, toggleAccount, toggleCreditCard]);

  const selectAllFilters = useCallback(() => {
    accounts.forEach(account => {
      if (!filters.accounts.includes(account.id)) {
        toggleAccount(account.id);
      }
    });
    creditCards.forEach(card => {
      if (!filters.creditCards.includes(card.id)) {
        toggleCreditCard(card.id);
      }
    });
  }, [accounts, creditCards, filters, toggleAccount, toggleCreditCard]);

  return {
    clearAllFilters,
    selectAllFilters,
  };
}