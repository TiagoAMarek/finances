import { useCallback, useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  FilterIcon,
  SearchIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  ChevronDownIcon,
  CalendarIcon,
  TagIcon,
  CreditCardIcon,
  BanknoteIcon,
} from "lucide-react";
import { useGetAccounts } from "@/features/accounts/hooks/data";
import { useGetCreditCards } from "@/features/credit-cards/hooks/data";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ActiveFiltersBadges } from "./ActiveFiltersBadges";
import { AdvancedFiltersForm } from "./AdvancedFiltersForm";
import {
  BadgeMeta,
  TransactionFilters,
  TransactionFiltersProps,
} from "./types";

export function TransactionFiltersComponent({
  filters,
  onFiltersChange,
  categories,
}: TransactionFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: accounts = [] } = useGetAccounts();
  const { data: creditCards = [] } = useGetCreditCards();

  const hasAdvanced = useMemo(() => {
    return (
      filters.category !== "" ||
      filters.accountId !== "" ||
      filters.creditCardId !== "" ||
      filters.dateFrom !== "" ||
      filters.dateTo !== ""
    );
  }, [
    filters.accountId,
    filters.category,
    filters.creditCardId,
    filters.dateFrom,
    filters.dateTo,
  ]);

  // Expand advanced filters when any is active
  // Use effect to avoid state update during render
  useEffect(() => {
    if (hasAdvanced && !isExpanded) setIsExpanded(true);
  }, [hasAdvanced, isExpanded]);

  const updateFilter = useCallback(
    (key: keyof TransactionFilters, value: string) => {
      onFiltersChange({
        ...filters,
        [key]: value,
      });
    },
    [filters, onFiltersChange],
  );

  const clearFilters = useCallback(() => {
    onFiltersChange({
      search: "",
      type: "all",
      category: "",
      accountId: "",
      creditCardId: "",
      dateFrom: "",
      dateTo: "",
    });
  }, [onFiltersChange]);

  const hasActiveFilters = useMemo(
    () =>
      Object.values(filters).some((value) => value !== "" && value !== "all"),
    [filters],
  );

  const activeFiltersCount = useMemo(
    () =>
      Object.entries(filters).filter(
        ([key, value]) => value !== "" && value !== "all" && key !== "search",
      ).length,
    [filters],
  );

  const activeBadges: BadgeMeta[] = useMemo(() => {
    const badges: BadgeMeta[] = [];

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
  }, [accounts, creditCards, filters]);

  const removeFilter = useCallback(
    (filterKey: BadgeMeta["key"]) => {
      if (filterKey === "date") {
        onFiltersChange({ ...filters, dateFrom: "", dateTo: "" });
      } else {
        onFiltersChange({
          ...filters,
          [filterKey]: filterKey === "type" ? "all" : "",
        });
      }
    },
    [filters, onFiltersChange],
  );

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
                  {activeFiltersCount} filtro(s) ativo(s)
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
                Limpar
              </Button>
            )}

            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 transition-all hover:bg-accent data-[state=open]:bg-accent"
                  aria-label={
                    isExpanded ? "Recolher filtros" : "Expandir filtros"
                  }
                >
                  <ChevronDownIcon
                    className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180"
                    data-state={isExpanded ? "open" : "closed"}
                    aria-hidden="true"
                  />
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
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
                <SelectValue placeholder="Todos os tipos" />
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
                <SelectItem value="transfer">
                  <div className="flex items-center gap-2">
                    <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
                    Transferências
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <ActiveFiltersBadges
              badges={activeBadges}
              onRemove={removeFilter}
            />
          )}
        </div>

        {/* Collapsible Advanced Filters */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent>
            <AdvancedFiltersForm
              filters={filters}
              categories={categories}
              accounts={accounts.map((a) => ({ id: a.id, name: a.name }))}
              creditCards={creditCards.map((c) => ({ id: c.id, name: c.name }))}
              onChange={updateFilter}
            />
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
