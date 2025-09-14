"use client";

import { Banknote, CreditCard as CreditCardIcon, Filter } from "lucide-react";
import * as React from "react";

import { FilterState, useAccountCardFilters } from "@/features";
import {
  Badge,
  Button,
  ScrollArea,
  Separator,
  Toggle,
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

  // Notificar mudanças nos filtros
  React.useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn("flex items-center gap-2", className)}
          size="sm"
          variant="outline"
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filtros</span>
          <Badge
            className="text-xs"
            variant={hasActiveFilters ? "default" : "secondary"}
          >
            {activeFiltersCount}/{totalFiltersCount}
          </Badge>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[480px] p-0">
        <div className="p-4 border-b">
          <h4 className="font-medium">Filtros de Contas e Cartões</h4>
          <p className="text-sm text-muted-foreground">
            Selecione quais contas e cartões incluir nas análises
          </p>
        </div>

        <ScrollArea className="max-h-96">
          <div className="px-4 pt-4 pb-6 space-y-4">
            {/* Seção de Contas */}
            {accounts.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Contas Bancárias</span>
                  </div>
                  <Toggle
                    className="text-xs"
                    pressed={allAccountsSelected}
                    size="sm"
                    onPressedChange={toggleAllAccounts}
                  >
                    Todas
                  </Toggle>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {accounts.map((account) => (
                    <Toggle
                      key={account.id}
                      className="justify-start h-auto p-2.5"
                      pressed={filters.accounts.includes(account.id)}
                      variant="outline"
                      onPressedChange={() => toggleAccount(account.id)}
                    >
                      <div className="flex items-center gap-2 min-w-0 w-full">
                        <Banknote className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate text-sm">{account.name}</span>
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
                    <CreditCardIcon className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">Cartões de Crédito</span>
                  </div>
                  <Toggle
                    className="text-xs"
                    pressed={allCreditCardsSelected}
                    size="sm"
                    onPressedChange={toggleAllCreditCards}
                  >
                    Todos
                  </Toggle>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {creditCards.map((card) => (
                    <Toggle
                      key={card.id}
                      className="justify-start h-auto p-2.5"
                      pressed={filters.creditCards.includes(card.id)}
                      variant="outline"
                      onPressedChange={() => toggleCreditCard(card.id)}
                    >
                      <div className="flex items-center gap-2 min-w-0 w-full">
                        <CreditCardIcon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate text-sm">{card.name}</span>
                      </div>
                    </Toggle>
                  ))}
                </div>
              </div>
            )}

            {/* Estado vazio */}
            {accounts.length === 0 && creditCards.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Nenhuma conta ou cartão encontrado</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
