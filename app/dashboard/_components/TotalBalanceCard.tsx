import { formatCurrency } from "@/lib/utils";
import { Wallet } from "lucide-react";

export interface TotalBalanceCardProps {
  totalBalance: number;
}

export function TotalBalanceCard({
  totalBalance,
}: TotalBalanceCardProps) {
  const isPositive = totalBalance >= 0;
  
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
          isPositive ? 'bg-primary/10' : 'bg-gray-500/10'
        }`}>
          <Wallet className={`h-4 w-4 ${
            isPositive ? 'text-primary' : 'text-gray-500'
          }`} />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          Saldo Total
        </p>
      </div>
      <p className={`text-2xl font-bold ${
        isPositive 
          ? 'text-foreground' 
          : 'text-gray-600 dark:text-gray-400'
      }`}>
        {formatCurrency(totalBalance)}
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        Todas as contas
      </p>
    </div>
  );
}
