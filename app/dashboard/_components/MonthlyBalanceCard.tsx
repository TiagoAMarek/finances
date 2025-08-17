import { formatCurrency } from "@/lib/utils";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface MonthlyBalanceCardProps {
  monthlyBalance: number;
}

export function MonthlyBalanceCard({
  monthlyBalance,
}: MonthlyBalanceCardProps) {
  const isPositive = monthlyBalance >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Balanço Mensal
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
          {formatCurrency(monthlyBalance)}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {monthlyBalance >= 0 ? "Superávit" : "Déficit"} no mês
        </p>
      </CardContent>
    </Card>
  );
}
