import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface PeriodBalanceMetricCardProps {
  balance: number;
  totalIncomes: number;
  totalExpenses: number;
}

export function PeriodBalanceMetricCard({
  balance,
  totalIncomes,
  totalExpenses,
}: PeriodBalanceMetricCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const isPositive = balance >= 0;
  const expenseRatio =
    totalIncomes > 0 ? (totalExpenses / totalIncomes) * 100 : 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Saldo do Período
        </CardTitle>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            isPositive ? "bg-blue-500/10" : "bg-orange-500/10"
          }`}
        >
          <BarChart3
            className={`h-4 w-4 ${
              isPositive ? "text-blue-500" : "text-orange-500"
            }`}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={`text-2xl font-bold ${
            isPositive
              ? "text-blue-600 dark:text-blue-400"
              : "text-orange-600 dark:text-orange-400"
          }`}
        >
          {formatCurrency(balance)}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {expenseRatio.toFixed(1)}% de gastos sobre receitas
        </p>
      </CardContent>
    </Card>
  );
}
