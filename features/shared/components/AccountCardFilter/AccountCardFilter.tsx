"use client";

import * as React from "react";

import { useAccountCardFilters } from "@/features";
import { useIsMobile } from "@/features/shared/hooks";

import { FilterContainer, FilterContent, FilterTriggerButton } from "./components";
import { AccountCardFilterProps } from "./types";

export const AccountCardFilter = React.memo(({
  accounts,
  creditCards,
  onFiltersChange,
  className,
}: AccountCardFilterProps) => {
  const {
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
  } = useAccountCardFilters({ accounts, creditCards });

  const isMobile = useIsMobile();

  // Notify filter changes
  React.useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const triggerButton = (
    <FilterTriggerButton
      activeFiltersCount={activeFiltersCount}
      className={className}
      hasActiveFilters={hasActiveFilters}
      totalFiltersCount={totalFiltersCount}
    />
  );

  const filterContent = (
    <FilterContent
      accounts={accounts}
      allAccountsSelected={allAccountsSelected}
      allCreditCardsSelected={allCreditCardsSelected}
      creditCards={creditCards}
      filters={filters}
      isMobile={isMobile}
      onToggleAccount={toggleAccount}
      onToggleAllAccounts={toggleAllAccounts}
      onToggleAllCreditCards={toggleAllCreditCards}
      onToggleCreditCard={toggleCreditCard}
    />
  );

  return (
    <FilterContainer
      description="Selecione quais contas e cartões incluir nas análises"
      isMobile={isMobile}
      title="Filtros de Contas e Cartões"
      triggerButton={triggerButton}
    >
      {filterContent}
    </FilterContainer>
  );
});

AccountCardFilter.displayName = "AccountCardFilter";