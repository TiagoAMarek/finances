import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

export interface MonthlyBalanceCardProps {
  monthlyBalance: number;
}

export function MonthlyBalanceCard({ monthlyBalance }: MonthlyBalanceCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Balanço Mensal
        </CardTitle>
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div
          className={`text-2xl font-bold ${monthlyBalance >= 0 ? "text-green-600" : "text-red-600"}`}
        >
          {formatCurrency(monthlyBalance)}
        </div>
        <p className="text-xs text-muted-foreground">
          {monthlyBalance >= 0 ? "Superávit" : "Déficit"} no mês atual
        </p>
      </CardContent>
    </Card>
  )
}
