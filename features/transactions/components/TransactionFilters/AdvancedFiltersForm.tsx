import { Input, Label, Separator } from "@/features/shared/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";
import {
  BanknoteIcon,
  CalendarIcon,
  CreditCardIcon,
  TagIcon,
} from "lucide-react";
import { TransactionFilters } from "./types";

interface AdvancedFiltersFormProps {
  filters: TransactionFilters;
  categories: string[];
  accounts: Array<{ id: string | number; name: string }>;
  creditCards: Array<{ id: string | number; name: string }>;
  onChange: (key: keyof TransactionFilters, value: string) => void;
}

export function AdvancedFiltersForm({
  filters,
  categories,
  accounts,
  creditCards,
  onChange,
}: AdvancedFiltersFormProps) {
  return (
    <div className="pt-4" aria-labelledby="advanced-filters-heading">
      <Separator className="mb-4" />
      <div className="space-y-6">
        <div>
          <h4
            id="advanced-filters-heading"
            className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"
          >
            <TagIcon className="h-4 w-4 text-primary" />
            Filtros Avançados
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Categoria
              </Label>
              <Select
                value={filters.category || "__all__"}
                onValueChange={(value) =>
                  onChange("category", value === "__all__" ? "" : value)
                }
              >
                <SelectTrigger className="transition-all hover:border-primary/50 focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">
                    <div className="flex items-center gap-2">
                      <TagIcon className="h-4 w-4 text-muted-foreground" />
                      Todas as categorias
                    </div>
                  </SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      <div className="flex items-center gap-2">
                        <TagIcon className="h-4 w-4 text-blue-500" />
                        {category}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Account Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Conta Bancária
              </Label>
              <Select
                value={filters.accountId || "__all__"}
                onValueChange={(value) =>
                  onChange("accountId", value === "__all__" ? "" : value)
                }
              >
                <SelectTrigger className="transition-all hover:border-primary/50 focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Todas as contas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">
                    <div className="flex items-center gap-2">
                      <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
                      Todas as contas
                    </div>
                  </SelectItem>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      <div className="flex items-center gap-2">
                        <BanknoteIcon className="h-4 w-4 text-purple-500" />
                        {account.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Credit Card Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Cartão de Crédito
              </Label>
              <Select
                value={filters.creditCardId || "__all__"}
                onValueChange={(value) =>
                  onChange("creditCardId", value === "__all__" ? "" : value)
                }
              >
                <SelectTrigger className="transition-all hover:border-primary/50 focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Todos os cartões" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">
                    <div className="flex items-center gap-2">
                      <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
                      Todos os cartões
                    </div>
                  </SelectItem>
                  {creditCards.map((card) => (
                    <SelectItem key={card.id} value={card.id.toString()}>
                      <div className="flex items-center gap-2">
                        <CreditCardIcon className="h-4 w-4 text-orange-500" />
                        {card.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-primary" />
            Período
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                className="text-sm font-medium text-muted-foreground"
                htmlFor="date-from"
              >
                Data Inicial
              </Label>
              <Input
                id="date-from"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => onChange("dateFrom", e.target.value)}
                className="transition-all hover:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label
                className="text-sm font-medium text-muted-foreground"
                htmlFor="date-to"
              >
                Data Final
              </Label>
              <Input
                id="date-to"
                type="date"
                value={filters.dateTo}
                onChange={(e) => onChange("dateTo", e.target.value)}
                className="transition-all hover:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
