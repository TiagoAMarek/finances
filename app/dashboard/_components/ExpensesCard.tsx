import { formatCurrency } from "@/lib/utils";
import { TrendingDown } from "lucide-react";

interface ExpensesCardProps {
  monthlyExpenses: number;
}

export function ExpensesCard({ monthlyExpenses }: ExpensesCardProps) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
          <TrendingDown className="h-4 w-4 text-red-500" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          Despesas do Mês
        </p>
      </div>
      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
        {formatCurrency(monthlyExpenses)}
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        {new Date().toLocaleDateString("pt-BR", { month: "long" })}
      </p>
    </div>
  );
}
