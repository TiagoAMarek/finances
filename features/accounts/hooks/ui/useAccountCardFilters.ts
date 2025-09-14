import { useState, useEffect, useCallback } from "react";

import { BankAccount, CreditCard } from "@/lib/schemas";

export interface FilterState {
  accounts: number[];
  creditCards: number[];
}

interface UseAccountCardFiltersProps {
  accounts: BankAccount[];
  creditCards: CreditCard[];
}

const STORAGE_KEY = "account-card-filters";

/**
 * Hook for managing account and credit card filters
 * Handles localStorage persistence and filter state management
 */
export function useAccountCardFilters({
  accounts,
  creditCards,
}: UseAccountCardFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(() => {
    // Inicializar com todos selecionados imediatamente
    return {
      accounts: accounts.map((a) => a.id),
      creditCards: creditCards.map((c) => c.id),
    };
  });

  // Carregar do localStorage quando disponível
  useEffect(() => {
    if (accounts.length === 0 && creditCards.length === 0) return;

    const savedFilters = localStorage.getItem(STORAGE_KEY);

    if (savedFilters) {
      try {
        const parsed = JSON.parse(savedFilters) as FilterState;
        setFilters(parsed);
        return;
      } catch {
        // Se erro ao fazer parse, continua com estado inicial
      }
    }

    // Se não há filtros salvos ou houve erro, usar todos habilitados
    const allAccountIds = accounts.map((a) => a.id);
    const allCreditCardIds = creditCards.map((c) => c.id);
    const defaultFilters = {
      accounts: allAccountIds,
      creditCards: allCreditCardIds,
    };
    setFilters(defaultFilters);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultFilters));
  }, [accounts, creditCards]);

  // Salvar no localStorage sempre que filtros mudarem
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  // Toggle individual de conta
  const toggleAccount = useCallback((accountId: number) => {
    setFilters((prev) => ({
      ...prev,
      accounts: prev.accounts.includes(accountId)
        ? prev.accounts.filter((id) => id !== accountId)
        : [...prev.accounts, accountId],
    }));
  }, []);

  // Toggle individual de cartão
  const toggleCreditCard = useCallback((creditCardId: number) => {
    setFilters((prev) => ({
      ...prev,
      creditCards: prev.creditCards.includes(creditCardId)
        ? prev.creditCards.filter((id) => id !== creditCardId)
        : [...prev.creditCards, creditCardId],
    }));
  }, []);

  // Toggle todas as contas
  const toggleAllAccounts = useCallback(() => {
    const allAccountIds = accounts.map((a) => a.id);
    const allSelected = allAccountIds.every((id) =>
      filters.accounts.includes(id),
    );

    setFilters((prev) => ({
      ...prev,
      accounts: allSelected ? [] : allAccountIds,
    }));
  }, [accounts, filters.accounts]);

  // Toggle todos os cartões
  const toggleAllCreditCards = useCallback(() => {
    const allCreditCardIds = creditCards.map((c) => c.id);
    const allSelected = allCreditCardIds.every((id) =>
      filters.creditCards.includes(id),
    );

    setFilters((prev) => ({
      ...prev,
      creditCards: allSelected ? [] : allCreditCardIds,
    }));
  }, [creditCards, filters.creditCards]);

  // Estado computado
  const allAccountsSelected =
    accounts.length > 0 &&
    accounts.every((a) => filters.accounts.includes(a.id));
  const allCreditCardsSelected =
    creditCards.length > 0 &&
    creditCards.every((c) => filters.creditCards.includes(c.id));

  const activeFiltersCount =
    filters.accounts.length + filters.creditCards.length;
  const totalFiltersCount = accounts.length + creditCards.length;

  const hasActiveFilters =
    activeFiltersCount > 0 && activeFiltersCount < totalFiltersCount;

  return {
    filters,
    toggleAccount,
    toggleCreditCard,
    toggleAllAccounts,
    toggleAllCreditCards,
    allAccountsSelected,
    allCreditCardsSelected,
    activeFiltersCount,
    totalFiltersCount,
    hasActiveFilters,
  };
}
