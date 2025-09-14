import { useMemo } from "react";

import { Transaction } from "@/lib/schemas";

import { TransactionListItem } from "./TransactionListItem";

interface TransactionListViewProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: number) => void;
  isDeleting: boolean;
}

interface GroupedTransactions {
  [date: string]: Transaction[];
}

export function TransactionListView({
  transactions,
  onEdit,
  onDelete,
  isDeleting,
}: TransactionListViewProps) {
  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: GroupedTransactions = {};

    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    sortedTransactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const dateKey = date.toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
      });

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
    });

    return groups;
  }, [transactions]);

  const formatDateHeader = (dateString: string) => {
    // dateString is already formatted as "9 de agosto" from grouping
    return dateString;
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-6">
          <span className="text-2xl">📱</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">
          Nenhuma transação encontrada
        </h3>
        <p className="text-muted-foreground max-w-md">
          Suas transações aparecerão aqui organizadas por data, como um extrato
          bancário.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedTransactions).map(
        ([dateKey, dateTransactions]) => (
          <div key={dateKey} className="space-y-3">
            {/* Date Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-muted-foreground px-4 py-2">
                {formatDateHeader(dateKey)}
              </h3>
            </div>

            {/* Transactions for this date */}
            <div className="space-y-1">
              {dateTransactions.map((transaction) => (
                <TransactionListItem
                  key={transaction.id}
                  isDeleting={isDeleting}
                  transaction={transaction}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </div>
          </div>
        ),
      )}
    </div>
  );
}
