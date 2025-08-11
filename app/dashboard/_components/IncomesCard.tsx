import { formatCurrency } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface IncomesCardProps {
  monthlyIncomes: number;
}

export function IncomesCard({ monthlyIncomes }: IncomesCardProps) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          Receitas do Mês
        </p>
      </div>
      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
        {formatCurrency(monthlyIncomes)}
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        {new Date().toLocaleDateString('pt-BR', { month: 'long' })}
      </p>
    </div>
  );
}
