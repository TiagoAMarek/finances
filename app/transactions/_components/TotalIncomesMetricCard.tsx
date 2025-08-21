import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface TotalIncomesMetricCardProps {
  totalIncomes: number;
  transactionCount: number;
}

export function TotalIncomesMetricCard({
  totalIncomes,
  transactionCount,
}: TotalIncomesMetricCardProps) {
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
          Total Receitas
        </CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
          {formatCurrency(totalIncomes)}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {transactionCount}{" "}
          {transactionCount === 1 ? "transação" : "transações"}
        </p>
      </CardContent>
    </Card>
  );
}
