import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Receipt } from "lucide-react";
import { Transaction } from "@/lib/schemas";
import { TransactionsMetricsGrid } from "./TransactionsMetricsGrid";
import { TransactionListView } from "./TransactionListView";

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
    <div className="space-y-8">
      {/* Metrics Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32">
            <Skeleton className="h-full w-full" />
          </div>
        ))}
      </div>

      {/* Transactions List Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>

        {/* Date grouped skeleton */}
        {[1, 2].map((group) => (
          <div key={group} className="space-y-3">
            {/* Date header skeleton */}
            <Skeleton className="h-4 w-24" />

            {/* Transaction items skeleton */}
            <div className="space-y-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  {/* Icon skeleton */}
                  <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />

                  {/* Content skeleton */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <Skeleton className="h-5 w-48 mb-2" />
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-20" />
                          <span className="text-muted-foreground">•</span>
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
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
    return (
      <div className="space-y-8">
        {/* Metrics Cards - Empty State */}
        <TransactionsMetricsGrid transactions={[]} />
        <EmptyState isFiltered={isFiltered} />
      </div>
    );
  }

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <TransactionsMetricsGrid transactions={transactions} />

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

        <TransactionListView
          transactions={sortedTransactions}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}
