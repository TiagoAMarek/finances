import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  FilterIcon,
  SearchIcon,
  CalendarIcon,
  TagIcon,
  XIcon,
  CreditCardIcon,
  BanknoteIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ChevronDownIcon,
  ChevronUpIcon,
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

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(
      ([key, value]) => value !== "" && value !== "all" && key !== "search",
    ).length;
  };

  const getActiveFiltersBadges = () => {
    const badges = [];

    if (filters.type !== "all") {
      badges.push({
        key: "type",
        label: filters.type === "income" ? "Receitas" : "Despesas",
        icon: filters.type === "income" ? TrendingUpIcon : TrendingDownIcon,
        color: filters.type === "income" ? "text-green-600" : "text-red-600",
      });
    }

    if (filters.category) {
      badges.push({
        key: "category",
        label: filters.category,
        icon: TagIcon,
        color: "text-blue-600",
      });
    }

    if (filters.accountId) {
      const accountName = accounts.find(
        (a) => a.id.toString() === filters.accountId,
      )?.name;
      if (accountName) {
        badges.push({
          key: "accountId",
          label: accountName,
          icon: BanknoteIcon,
          color: "text-purple-600",
        });
      }
    }

    if (filters.creditCardId) {
      const cardName = creditCards.find(
        (c) => c.id.toString() === filters.creditCardId,
      )?.name;
      if (cardName) {
        badges.push({
          key: "creditCardId",
          label: cardName,
          icon: CreditCardIcon,
          color: "text-orange-600",
        });
      }
    }

    if (filters.dateFrom || filters.dateTo) {
      let dateLabel = "Período";
      if (filters.dateFrom && filters.dateTo) {
        dateLabel = `${new Date(filters.dateFrom).toLocaleDateString("pt-BR")} - ${new Date(filters.dateTo).toLocaleDateString("pt-BR")}`;
      } else if (filters.dateFrom) {
        dateLabel = `A partir de ${new Date(filters.dateFrom).toLocaleDateString("pt-BR")}`;
      } else if (filters.dateTo) {
        dateLabel = `Até ${new Date(filters.dateTo).toLocaleDateString("pt-BR")}`;
      }

      badges.push({
        key: "date",
        label: dateLabel,
        icon: CalendarIcon,
        color: "text-indigo-600",
      });
    }

    return badges;
  };

  const removeFilter = (filterKey: string) => {
    if (filterKey === "date") {
      onFiltersChange({
        ...filters,
        dateFrom: "",
        dateTo: "",
      });
    } else {
      onFiltersChange({
        ...filters,
        [filterKey]: filterKey === "type" ? "all" : "",
      });
    }
  };

  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <FilterIcon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Filtros de Busca
              </h3>
              {hasActiveFilters && (
                <p className="text-xs text-muted-foreground">
                  {getActiveFiltersCount()} filtro(s) ativo(s)
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 px-3 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <XIcon className="h-3 w-3 mr-1" />
                Limpar
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 px-3"
            >
              {isExpanded ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Search and Quick Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por descrição..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="pl-10 transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Select
              value={filters.type}
              onValueChange={(value) => updateFilter("type", value)}
            >
              <SelectTrigger className="w-full sm:w-48 transition-all hover:border-primary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="income">
                  <div className="flex items-center gap-2">
                    <TrendingUpIcon className="h-4 w-4 text-green-500" />
                    Receitas
                  </div>
                </SelectItem>
                <SelectItem value="expense">
                  <div className="flex items-center gap-2">
                    <TrendingDownIcon className="h-4 w-4 text-red-500" />
                    Despesas
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg">
              <span className="text-xs font-medium text-muted-foreground">
                Filtros ativos:
              </span>
              {getActiveFiltersBadges().map((badge) => {
                const IconComponent = badge.icon;
                return (
                  <Badge
                    key={badge.key}
                    variant="secondary"
                    className="flex items-center gap-1.5 pr-1 text-xs hover:bg-secondary/80 transition-colors"
                  >
                    <IconComponent className={`h-3 w-3 ${badge.color}`} />
                    <span className="max-w-24 truncate">{badge.label}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFilter(badge.key)}
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground rounded-full ml-1"
                      aria-label={`Remover filtro ${badge.label}`}
                    >
                      <XIcon className="h-2.5 w-2.5" />
                    </Button>
                  </Badge>
                );
              })}
            </div>
          )}
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="animate-in slide-in-from-top-2 duration-200">
            <Separator className="my-4" />
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
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
                      value={filters.category}
                      onValueChange={(value) => updateFilter("category", value)}
                    >
                      <SelectTrigger className="transition-all hover:border-primary/50 focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Todas as categorias" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">
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
                      value={filters.accountId}
                      onValueChange={(value) =>
                        updateFilter("accountId", value)
                      }
                    >
                      <SelectTrigger className="transition-all hover:border-primary/50 focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Todas as contas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">
                          <div className="flex items-center gap-2">
                            <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
                            Todas as contas
                          </div>
                        </SelectItem>
                        {accounts.map((account) => (
                          <SelectItem
                            key={account.id}
                            value={account.id.toString()}
                          >
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
                      value={filters.creditCardId}
                      onValueChange={(value) =>
                        updateFilter("creditCardId", value)
                      }
                    >
                      <SelectTrigger className="transition-all hover:border-primary/50 focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Todos os cartões" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">
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
                    <Label className="text-sm font-medium text-muted-foreground">
                      Data Inicial
                    </Label>
                    <Input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => updateFilter("dateFrom", e.target.value)}
                      className="transition-all hover:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Data Final
                    </Label>
                    <Input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => updateFilter("dateTo", e.target.value)}
                      className="transition-all hover:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
