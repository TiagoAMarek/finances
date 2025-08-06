import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TrendingDown } from "lucide-react";

interface ExpensesCardProps {
  monthlyExpenses: number;
}

export function ExpensesCard({ monthlyExpenses }: ExpensesCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
        <TrendingDown className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-red-600">
          {formatCurrency(monthlyExpenses)}
        </div>
        <p className="text-xs text-muted-foreground">
          Total de despesas em{" "}
          {new Date().toLocaleDateString("pt-BR", { month: "long" })}
        </p>
      </CardContent>
    </Card>
  );
}
