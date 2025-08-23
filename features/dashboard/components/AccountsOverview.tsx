import { Badge, Button } from "@/features/shared/components/ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { BankAccount } from "@/lib/schemas";
import { Banknote, Plus, Settings } from "lucide-react";
import Link from "next/link";

interface AccountsOverviewProps {
  accounts: BankAccount[];
  totalBalance: number;
}

export function AccountsOverview({
  accounts,
  totalBalance,
}: AccountsOverviewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (accounts.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">
            Contas Bancárias
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
            <Banknote className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted/30 mb-3">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Nenhuma conta cadastrada
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/accounts">Adicionar Conta</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          Contas Bancárias
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {accounts.length}
          </Badge>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
            <Banknote className="h-4 w-4 text-blue-500" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col h-full space-y-4">
        {/* Saldo Total */}
        <div className="p-3 rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Saldo Total
            </span>
            <span
              className={`text-xl font-bold ${totalBalance >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
                }`}
            >
              {formatCurrency(totalBalance)}
            </span>
          </div>
        </div>

        {/* Lista de contas */}
        <div className="space-y-2 flex-1">
          {accounts.map((account) => {
            const balance = parseFloat(account.balance);
            const isPositive = balance >= 0;

            return (
              <div
                key={account.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 flex-shrink-0">
                    <Banknote className="h-3 w-3 text-blue-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">
                      {account.name}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span
                    className={`font-semibold text-sm ${isPositive
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                      }`}
                  >
                    {formatCurrency(balance)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botão de gerenciar */}
        <div className="mt-auto pt-4">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href="/accounts" className="flex items-center gap-2">
              <Settings className="h-3 w-3" />
              Gerenciar Contas
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
