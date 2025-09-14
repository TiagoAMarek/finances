"use client";

import { Banknote, CreditCard as CreditCardIcon, Filter, Check, X } from "lucide-react";
import * as React from "react";

import { FilterState, useAccountCardFilters } from "@/features";
import {
  Badge,
  Button,
  ScrollArea,
  Separator,
  Toggle,
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
import { BankAccount, CreditCard } from "@/lib/schemas";
import { cn } from "@/lib/utils";

interface AccountCardFilterProps {
  accounts: BankAccount[];
  creditCards: CreditCard[];
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

// Hook to detect mobile viewport
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return isMobile;
}

// Shared content component for both mobile and desktop
function FilterContent({
  accounts,
  creditCards,
  filters,
  toggleAccount,
  toggleCreditCard,
  toggleAllAccounts,
  toggleAllCreditCards,
  allAccountsSelected,
  allCreditCardsSelected,
  isMobile = false,
}: {
  accounts: BankAccount[];
  creditCards: CreditCard[];
  filters: FilterState;
  toggleAccount: (id: number) => void;
  toggleCreditCard: (id: number) => void;
  toggleAllAccounts: () => void;
  toggleAllCreditCards: () => void;
  allAccountsSelected: boolean;
  allCreditCardsSelected: boolean;
  isMobile?: boolean;
}) {
  const clearAllFilters = () => {
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
  };

  const selectAllFilters = () => {
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
  };

  return (
    <div className="flex flex-col h-full">
      {/* Quick Actions - Mobile */}
      {isMobile && (
        <div className="flex gap-2 p-4 border-b">
          <Button
            aria-label="Selecionar todos os filtros"
            className="flex-1 min-h-[48px]"
            size="sm"
            variant="outline"
            onClick={selectAllFilters}
          >
            <Check className="h-4 w-4 mr-2" />
            Selecionar Todos
          </Button>
          <Button
            aria-label="Limpar todos os filtros"
            className="flex-1 min-h-[48px]"
            size="sm"
            variant="outline"
            onClick={clearAllFilters}
          >
            <X className="h-4 w-4 mr-2" />
            Limpar Todos
          </Button>
        </div>
      )}

      <ScrollArea className={cn("flex-1", isMobile ? "max-h-[calc(100vh-200px)]" : "max-h-96")}>
        <div className={cn("space-y-4", isMobile ? "p-4" : "px-4 pt-4 pb-6")}>
          {/* Seção de Contas */}
          {accounts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Banknote className={cn("text-blue-500", isMobile ? "h-5 w-5" : "h-4 w-4")} />
                  <span className={cn("font-medium", isMobile ? "text-base" : "text-sm")}>
                    Contas Bancárias
                  </span>
                </div>
                <Toggle
                  aria-label="Alternar todas as contas bancárias"
                  className={cn("text-xs", isMobile ? "min-h-[48px] px-4" : "")}
                  pressed={allAccountsSelected}
                  size={isMobile ? "default" : "sm"}
                  onPressedChange={toggleAllAccounts}
                >
                  Todas
                </Toggle>
              </div>

              <div className={cn("grid gap-2", isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2")}>
                {accounts.map((account) => (
                  <Toggle
                    key={account.id}
                    aria-label={`${filters.accounts.includes(account.id) ? 'Desmarcar' : 'Marcar'} conta ${account.name}`}
                    className={cn(
                      "justify-start h-auto p-3 text-left",
                      isMobile ? "min-h-[48px] p-4" : "min-h-[44px]"
                    )}
                    pressed={filters.accounts.includes(account.id)}
                    variant="outline"
                    onPressedChange={() => toggleAccount(account.id)}
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
          )}

          {/* Separador */}
          {accounts.length > 0 && creditCards.length > 0 && <Separator />}

          {/* Seção de Cartões */}
          {creditCards.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCardIcon className={cn("text-purple-500", isMobile ? "h-5 w-5" : "h-4 w-4")} />
                  <span className={cn("font-medium", isMobile ? "text-base" : "text-sm")}>
                    Cartões de Crédito
                  </span>
                </div>
                <Toggle
                  aria-label="Alternar todos os cartões de crédito"
                  className={cn("text-xs", isMobile ? "min-h-[48px] px-4" : "")}
                  pressed={allCreditCardsSelected}
                  size={isMobile ? "default" : "sm"}
                  onPressedChange={toggleAllCreditCards}
                >
                  Todos
                </Toggle>
              </div>

              <div className={cn("grid gap-2", isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2")}>
                {creditCards.map((card) => (
                  <Toggle
                    key={card.id}
                    aria-label={`${filters.creditCards.includes(card.id) ? 'Desmarcar' : 'Marcar'} cartão ${card.name}`}
                    className={cn(
                      "justify-start h-auto p-3 text-left",
                      isMobile ? "min-h-[48px] p-4" : "min-h-[44px]"
                    )}
                    pressed={filters.creditCards.includes(card.id)}
                    variant="outline"
                    onPressedChange={() => toggleCreditCard(card.id)}
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
          )}

          {/* Estado vazio */}
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
}

export function AccountCardFilter({
  accounts,
  creditCards,
  onFiltersChange,
  className,
}: AccountCardFilterProps) {
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

  // Notificar mudanças nos filtros
  React.useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const triggerButton = (
    <Button
      aria-label={`Filtros - ${activeFiltersCount} de ${totalFiltersCount} selecionados`}
      className={cn(
        "flex items-center gap-2",
        isMobile ? "min-h-[48px] px-4" : "",
        className
      )}
      size={isMobile ? "default" : "sm"}
      variant="outline"
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

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          {triggerButton}
        </SheetTrigger>
        <SheetContent className="h-[85vh] flex flex-col" side="bottom">
          <SheetHeader className="flex-shrink-0">
            <SheetTitle>Filtros de Contas e Cartões</SheetTitle>
            <SheetDescription>
              Selecione quais contas e cartões incluir nas análises
            </SheetDescription>
          </SheetHeader>
          <FilterContent
            accounts={accounts}
            allAccountsSelected={allAccountsSelected}
            allCreditCardsSelected={allCreditCardsSelected}
            creditCards={creditCards}
            filters={filters}
            isMobile={true}
            toggleAccount={toggleAccount}
            toggleAllAccounts={toggleAllAccounts}
            toggleAllCreditCards={toggleAllCreditCards}
            toggleCreditCard={toggleCreditCard}
          />
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
          <h4 className="font-medium">Filtros de Contas e Cartões</h4>
          <p className="text-sm text-muted-foreground">
            Selecione quais contas e cartões incluir nas análises
          </p>
        </div>

        <FilterContent
          accounts={accounts}
          allAccountsSelected={allAccountsSelected}
          allCreditCardsSelected={allCreditCardsSelected}
          creditCards={creditCards}
          filters={filters}
          isMobile={false}
          toggleAccount={toggleAccount}
          toggleAllAccounts={toggleAllAccounts}
          toggleAllCreditCards={toggleAllCreditCards}
          toggleCreditCard={toggleCreditCard}
        />
      </PopoverContent>
    </Popover>
  );
}
