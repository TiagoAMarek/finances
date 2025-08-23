"use client";

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
import { Banknote, CreditCard as CreditCardIcon, Filter } from "lucide-react";
import * as React from "react";

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
          variant="outline"
          size="sm"
          className={cn("flex items-center gap-2", className)}
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filtros</span>
          <Badge
            variant={hasActiveFilters ? "default" : "secondary"}
            className="text-xs"
          >
            {activeFiltersCount}/{totalFiltersCount}
          </Badge>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b">
          <h4 className="font-medium">Filtros de Contas e Cartões</h4>
          <p className="text-sm text-muted-foreground">
            Selecione quais contas e cartões incluir nas análises
          </p>
        </div>

        <ScrollArea className="max-h-80">
          <div className="p-4 space-y-6">
            {/* Seção de Contas */}
            {accounts.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Contas Bancárias</span>
                  </div>
                  <Toggle
                    pressed={allAccountsSelected}
                    onPressedChange={toggleAllAccounts}
                    size="sm"
                    className="text-xs"
                  >
                    Todas
                  </Toggle>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {accounts.map((account) => (
                    <Toggle
                      key={account.id}
                      pressed={filters.accounts.includes(account.id)}
                      onPressedChange={() => toggleAccount(account.id)}
                      variant="outline"
                      className="justify-start h-auto p-3"
                    >
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4" />
                        <span className="truncate">{account.name}</span>
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
                    pressed={allCreditCardsSelected}
                    onPressedChange={toggleAllCreditCards}
                    size="sm"
                    className="text-xs"
                  >
                    Todos
                  </Toggle>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {creditCards.map((card) => (
                    <Toggle
                      key={card.id}
                      pressed={filters.creditCards.includes(card.id)}
                      onPressedChange={() => toggleCreditCard(card.id)}
                      variant="outline"
                      className="justify-start h-auto p-3"
                    >
                      <div className="flex items-center gap-2">
                        <CreditCardIcon className="h-4 w-4" />
                        <span className="truncate">{card.name}</span>
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
