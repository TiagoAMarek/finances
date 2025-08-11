import { Badge } from "@/components/ui/badge";
import { CreditCardIcon, TrendingUpIcon, TrendingDownIcon, Banknote } from "lucide-react";
import { BankAccount } from "@/lib/schemas";

interface AccountsOverviewProps {
  accounts: BankAccount[];
}

export function AccountsOverview({ accounts }: AccountsOverviewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (accounts.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCardIcon className="h-5 w-5 text-foreground" />
            <h2 className="text-xl font-semibold text-foreground">Contas Bancárias</h2>
          </div>
          <Badge variant="secondary" className="text-xs">0 contas</Badge>
        </div>
        <div className="text-center py-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
            <Banknote className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">
            Nenhuma conta cadastrada
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCardIcon className="h-5 w-5 text-foreground" />
          <h2 className="text-xl font-semibold text-foreground">Contas Bancárias</h2>
        </div>
        <Badge variant="secondary" className="text-xs">
          {accounts.length} {accounts.length === 1 ? 'conta' : 'contas'}
        </Badge>
      </div>
      
      <div className="space-y-3">
        {accounts.map((account) => {
          const balance = parseFloat(account.balance);
          const isPositive = balance >= 0;
          
          return (
            <div
              key={account.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <CreditCardIcon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{account.name}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    BRL
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {isPositive ? (
                  <TrendingUpIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDownIcon className="h-4 w-4 text-red-500" />
                )}
                <span className={`font-semibold ${
                  isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatCurrency(Math.abs(balance))}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}