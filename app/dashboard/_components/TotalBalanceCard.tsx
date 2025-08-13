import { formatCurrency } from "@/lib/utils";
import { Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface TotalBalanceCardProps {
  totalBalance: number;
}

export function TotalBalanceCard({
  totalBalance,
}: TotalBalanceCardProps) {
  const isPositive = totalBalance >= 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Saldo Total
        </CardTitle>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
          isPositive ? 'bg-primary/10' : 'bg-gray-500/10'
        }`}>
          <Wallet className={`h-4 w-4 ${
            isPositive ? 'text-primary' : 'text-gray-500'
          }`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${
          isPositive 
            ? 'text-foreground' 
            : 'text-gray-600 dark:text-gray-400'
        }`}>
          {formatCurrency(totalBalance)}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Todas as contas
        </p>
      </CardContent>
    </Card>
  );
}
