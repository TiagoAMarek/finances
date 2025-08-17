import { formatCurrency } from "@/lib/utils";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IncomesCardProps {
  monthlyIncomes: number;
}

export function IncomesCard({ monthlyIncomes }: IncomesCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Receitas do Mês
        </CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
          {formatCurrency(monthlyIncomes)}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {new Date().toLocaleDateString("pt-BR", { month: "long" })}
        </p>
      </CardContent>
    </Card>
  );
}
