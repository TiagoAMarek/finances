import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCardIcon, TrendingUpIcon, TrendingDownIcon, Banknote, Settings } from "lucide-react";
import { BankAccount } from "@/lib/schemas";

interface AccountsOverviewProps {
  accounts: BankAccount[];
  totalBalance: number;
}

export function AccountsOverview({ accounts, totalBalance }: AccountsOverviewProps) {
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
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">0 contas</Badge>
            <Button asChild variant="outline" size="sm">
              <Link href="/accounts" className="flex items-center gap-1">
                <Settings className="h-3 w-3" />
                Gerenciar
              </Link>
            </Button>
          </div>
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
      {/* Cabeçalho com título e saldo total */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCardIcon className="h-5 w-5 text-foreground" />
            <h2 className="text-xl font-semibold text-foreground">Contas Bancárias</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {accounts.length} {accounts.length === 1 ? 'conta' : 'contas'}
            </Badge>
            <Button asChild variant="outline" size="sm">
              <Link href="/accounts" className="flex items-center gap-1">
                <Settings className="h-3 w-3" />
                Gerenciar
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Saldo Total */}
        <div className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg border border-dashed">
          <span className="text-sm font-medium text-muted-foreground">
            Saldo Total
          </span>
          <div className="flex items-center gap-2">
            {totalBalance >= 0 ? (
              <TrendingUpIcon className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDownIcon className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-lg font-bold ${
              totalBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(totalBalance)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Lista de contas individuais */}
      <div className="space-y-2">
        {accounts.map((account) => {
          const balance = parseFloat(account.balance);
          const isPositive = balance >= 0;
          
          return (
            <div
              key={account.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                  <CreditCardIcon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm text-foreground truncate">{account.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {isPositive ? 'Saldo positivo' : 'Saldo negativo'}
                  </p>
                </div>
              </div>
              
              <div className="text-right flex-shrink-0">
                <span className={`font-semibold text-sm ${
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