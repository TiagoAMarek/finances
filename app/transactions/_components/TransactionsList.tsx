import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Receipt,
  TrendingUpIcon,
  TrendingDownIcon,
  BarChart3,
  CalendarIcon,
} from "lucide-react";
import { Transaction } from "@/lib/schemas";
import { TransactionsTable } from "./TransactionsTable";

interface TransactionsListProps {
  transactions: Transaction[];
  isLoading: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: number) => void;
  isDeleting: boolean;
  isFiltered?: boolean;
  totalCount?: number;
}

function TransactionsListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Summary Statistics Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Total Receitas Skeleton */}
        <div className="text-center py-2 md:py-0">
          <Skeleton className="h-4 w-24 mb-2 mx-auto" />
          <Skeleton className="h-8 w-32 mx-auto" />
        </div>

        {/* Total Despesas Skeleton */}
        <div className="text-center py-2 md:py-0 md:px-8">
          <Skeleton className="h-4 w-24 mb-2 mx-auto" />
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>

        {/* Saldo do Período Skeleton */}
        <div className="text-center py-2 md:py-0 md:px-8">
          <Skeleton className="h-4 w-28 mb-2 mx-auto" />
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </div>

      <Separator />

      {/* Transactions List Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-24" />
                    <div className="flex gap-1">
                      <Skeleton className="h-9 w-16" />
                      <Skeleton className="h-9 w-16" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ isFiltered }: { isFiltered?: boolean }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-6">
          <Receipt className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          {isFiltered
            ? "Nenhum lançamento encontrado com os filtros aplicados"
            : "Nenhum lançamento encontrado"}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          {isFiltered
            ? "Tente ajustar os filtros para encontrar os lançamentos desejados ou limpe os filtros para ver todos os lançamentos."
            : 'Comece registrando suas receitas e despesas para ter controle total das suas finanças. Use o botão "Novo Lançamento" no topo da página.'}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Receipt className="h-4 w-4" />
          <span>
            {isFiltered
              ? "Ajuste os filtros para encontrar seus lançamentos"
              : "Registre todas as suas movimentações financeiras"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function TransactionsList({
  transactions,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
  isFiltered = false,
  totalCount = 0,
}: TransactionsListProps) {
  if (isLoading) {
    return <TransactionsListSkeleton />;
  }

  if (transactions.length === 0) {
    return <EmptyState isFiltered={isFiltered} />;
  }

  // Calculate summary statistics
  const totalIncomes = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = totalIncomes - totalExpenses;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // Additional statistics
  const expenseRatio =
    totalIncomes > 0 ? (totalExpenses / totalIncomes) * 100 : 0;
  const avgTransactionValue =
    transactions.length > 0
      ? (totalIncomes + totalExpenses) / transactions.length
      : 0;

  // Category breakdown
  const categoryStats = transactions.reduce(
    (acc, transaction) => {
      const category = transaction.category;
      const amount = parseFloat(transaction.amount);

      if (!acc[category]) {
        acc[category] = { total: 0, count: 0, type: transaction.type };
      }
      acc[category].total += amount;
      acc[category].count += 1;

      return acc;
    },
    {} as Record<string, { total: number; count: number; type: string }>,
  );

  const topCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b.total - a.total)
    .slice(0, 3);

  // Monthly distribution
  const monthlyStats = transactions.reduce(
    (acc, transaction) => {
      const monthYear = new Date(transaction.date).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "short",
      });
      const amount = parseFloat(transaction.amount);

      if (!acc[monthYear]) {
        acc[monthYear] = { income: 0, expense: 0, count: 0 };
      }

      if (transaction.type === "income") {
        acc[monthYear].income += amount;
      } else {
        acc[monthYear].expense += amount;
      }
      acc[monthYear].count += 1;

      return acc;
    },
    {} as Record<string, { income: number; expense: number; count: number }>,
  );

  const monthlyEntries = Object.entries(monthlyStats).slice(-3); // Last 3 months

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Total Receitas */}
        <div className="text-center py-2 md:py-0">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
              <TrendingUpIcon className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Receitas
            </p>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(totalIncomes)}
          </p>
        </div>

        {/* Total Despesas */}
        <div className="text-center py-2 md:py-0 md:px-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
              <TrendingDownIcon className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Despesas
            </p>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(totalExpenses)}
          </p>
        </div>

        {/* Saldo do Período */}
        <div className="text-center py-2 md:py-0 md:px-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                balance >= 0 ? "bg-blue-500/10" : "bg-orange-500/10"
              }`}
            >
              <BarChart3
                className={`h-4 w-4 ${
                  balance >= 0 ? "text-blue-500" : "text-orange-500"
                }`}
              />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Saldo do Período
            </p>
          </div>
          <p
            className={`text-2xl font-bold ${
              balance >= 0
                ? "text-blue-600 dark:text-blue-400"
                : "text-orange-600 dark:text-orange-400"
            }`}
          >
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      <Separator />

      {/* Enhanced Statistics */}
      {transactions.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expense Ratio & Average */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-muted-foreground">
                    Taxa de Gastos
                  </span>
                  <span className="text-sm font-medium">
                    {expenseRatio.toFixed(1)}%
                  </span>
                </div>
                <Progress value={Math.min(expenseRatio, 100)} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Gastos representam {expenseRatio.toFixed(1)}% da receita
                </p>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Valor Médio
                  </p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(avgTransactionValue)}
                  </p>
                </div>
              </div>
            </div>

            {/* Top Categories */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                  <Receipt className="h-4 w-4 text-purple-500" />
                </div>
                <h3 className="font-medium text-foreground">
                  Principais Categorias
                </h3>
              </div>

              <div className="space-y-3">
                {topCategories.map(([category, stats], index) => (
                  <div
                    key={category}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/20"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        #{index + 1}
                      </span>
                      <span className="text-sm font-medium text-foreground truncate">
                        {category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {stats.count}x
                      </Badge>
                      <span
                        className={`text-sm font-bold ${
                          stats.type === "income"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {formatCurrency(stats.total)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {topCategories.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma categoria encontrada
                </p>
              )}
            </div>
          </div>

          {/* Monthly Overview */}
          {monthlyEntries.length > 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
                  <CalendarIcon className="h-4 w-4 text-orange-500" />
                </div>
                <h3 className="font-medium text-foreground">
                  Distribuição Mensal
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {monthlyEntries.map(([month, stats]) => (
                  <div
                    key={month}
                    className="p-3 rounded-lg border border-border bg-card"
                  >
                    <div className="text-center mb-2">
                      <p className="text-sm font-medium text-foreground">
                        {month}
                      </p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {stats.count} lançamentos
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-green-600 dark:text-green-400">
                          Receitas
                        </span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {formatCurrency(stats.income)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-red-600 dark:text-red-400">
                          Despesas
                        </span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          {formatCurrency(stats.expense)}
                        </span>
                      </div>
                      <div className="border-t border-border pt-1 mt-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-foreground">
                            Saldo
                          </span>
                          <span
                            className={`font-bold ${
                              stats.income - stats.expense >= 0
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-orange-600 dark:text-orange-400"
                            }`}
                          >
                            {formatCurrency(stats.income - stats.expense)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Separator />

      {/* Transactions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-foreground" />
            <h2 className="text-xl font-semibold text-foreground">
              Seus Lançamentos
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {transactions.length}{" "}
              {transactions.length === 1 ? "lançamento" : "lançamentos"}
              {isFiltered && totalCount > transactions.length && (
                <span className="text-muted-foreground ml-1">
                  de {totalCount}
                </span>
              )}
            </Badge>
            {isFiltered && (
              <Badge variant="outline" className="text-xs">
                Filtrado
              </Badge>
            )}
          </div>
        </div>

        <TransactionsTable
          transactions={sortedTransactions}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
