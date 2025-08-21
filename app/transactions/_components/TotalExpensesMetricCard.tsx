import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown } from "lucide-react";

interface TotalExpensesMetricCardProps {
  totalExpenses: number;
  transactionCount: number;
}

export function TotalExpensesMetricCard({
  totalExpenses,
  transactionCount,
}: TotalExpensesMetricCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Total Despesas
        </CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
          <TrendingDown className="h-4 w-4 text-red-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
          {formatCurrency(totalExpenses)}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {transactionCount}{" "}
          {transactionCount === 1 ? "transação" : "transações"}
        </p>
      </CardContent>
    </Card>
  );
}
