import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown } from "lucide-react";

interface NegativeAccountsMetricCardProps {
  negativeAccountsCount: number;
}

export function NegativeAccountsMetricCard({
  negativeAccountsCount,
}: NegativeAccountsMetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Contas Negativas
        </CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
          <TrendingDown className="h-4 w-4 text-red-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
          {negativeAccountsCount}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {negativeAccountsCount === 1 ? "conta" : "contas"} com saldo negativo
        </p>
      </CardContent>
    </Card>
  );
}
