import { formatCurrency } from "@/lib/utils";
import { TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExpensesCardProps {
  monthlyExpenses: number;
}

export function ExpensesCard({ monthlyExpenses }: ExpensesCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Despesas do Mês
        </CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
          <TrendingDown className="h-4 w-4 text-red-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
          {formatCurrency(monthlyExpenses)}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {new Date().toLocaleDateString("pt-BR", { month: "long" })}
        </p>
      </CardContent>
    </Card>
  );
}
