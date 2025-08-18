import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  FilterIcon,
  SearchIcon,
  CalendarIcon,
  TagIcon,
  XIcon,
} from "lucide-react";
import { useGetAccounts } from "@/features/accounts/hooks/data";
import { useGetCreditCards } from "@/features/credit-cards/hooks/data";

export interface TransactionFilters {
  search: string;
  type: "all" | "income" | "expense" | "transfer";
  category: string;
  accountId: string;
  creditCardId: string;
  dateFrom: string;
  dateTo: string;
}

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  categories: string[];
}

export function TransactionFiltersComponent({
  filters,
  onFiltersChange,
  categories,
}: TransactionFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: accounts = [] } = useGetAccounts();
  const { data: creditCards = [] } = useGetCreditCards();

  const updateFilter = (key: keyof TransactionFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      type: "all",
      category: "",
      accountId: "",
      creditCardId: "",
      dateFrom: "",
      dateTo: "",
    });
    setIsExpanded(false);
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "" && value !== "all",
  );

  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        {/* Basic Search */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por descrição..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={filters.type}
            onValueChange={(value) => updateFilter("type", value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="income">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">📥</span>
                  Receitas
                </div>
              </SelectItem>
              <SelectItem value="expense">
                <div className="flex items-center gap-2">
                  <span className="text-red-500">📤</span>
                  Despesas
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            <FilterIcon className="h-4 w-4" />
            Filtros
            {hasActiveFilters && (
              <span className="ml-1 flex h-2 w-2 rounded-full bg-primary" />
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <XIcon className="h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <>
            <Separator className="mb-4" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <TagIcon className="h-4 w-4" />
                    Categoria
                  </Label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => updateFilter("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas as categorias</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Account Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Conta Bancária</Label>
                  <Select
                    value={filters.accountId}
                    onValueChange={(value) => updateFilter("accountId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as contas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas as contas</SelectItem>
                      {accounts.map((account) => (
                        <SelectItem
                          key={account.id}
                          value={account.id.toString()}
                        >
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Credit Card Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Cartão de Crédito
                  </Label>
                  <Select
                    value={filters.creditCardId}
                    onValueChange={(value) =>
                      updateFilter("creditCardId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os cartões" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os cartões</SelectItem>
                      {creditCards.map((card) => (
                        <SelectItem key={card.id} value={card.id.toString()}>
                          {card.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Data Inicial
                  </Label>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => updateFilter("dateFrom", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Data Final
                  </Label>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => updateFilter("dateTo", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
