import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CreditCardIcon,
  Banknote,
  TrendingUpIcon,
  TrendingDownIcon,
} from "lucide-react";
import { BankAccount } from "@/lib/schemas";
import { AccountItem } from "./AccountItem";

interface AccountsListProps {
  accounts: BankAccount[];
  isLoading: boolean;
  onEdit: (account: BankAccount) => void;
  onDelete: (accountId: number) => void;
  isDeleting: boolean;
}

function AccountsListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Summary Statistics Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Saldo Total Skeleton */}
        <div className="text-center md:text-left py-2 md:py-0">
          <Skeleton className="h-4 w-20 mb-2 mx-auto md:mx-0" />
          <Skeleton className="h-8 w-32 mx-auto md:mx-0" />
        </div>

        {/* Contas Positivas Skeleton */}
        <div className="text-center md:text-left py-2 md:py-0 md:px-8">
          <Skeleton className="h-4 w-28 mb-2 mx-auto md:mx-0" />
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>

        {/* Contas Negativas Skeleton */}
        <div className="text-center md:text-left py-2 md:py-0 md:px-8">
          <Skeleton className="h-4 w-28 mb-2 mx-auto md:mx-0" />
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>

      <Separator />

      {/* Accounts List Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-8 rounded-full" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-16" />
                    <Skeleton className="h-9 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-6">
          <Banknote className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Nenhuma conta cadastrada</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Comece adicionando suas contas bancárias para ter uma visão completa
          das suas finanças. Use o botão &quot;Nova Conta&quot; no topo da
          página.
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CreditCardIcon className="h-4 w-4" />
          <span>Gerencie todas as suas contas em um só lugar</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function AccountsList({
  accounts,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
}: AccountsListProps) {
  if (isLoading) {
    return <AccountsListSkeleton />;
  }

  if (accounts.length === 0) {
    return <EmptyState />;
  }

  // Calculate summary statistics
  const totalBalance = accounts.reduce(
    (sum, account) => sum + parseFloat(account.balance),
    0,
  );
  const positiveAccounts = accounts.filter(
    (account) => parseFloat(account.balance) >= 0,
  );
  const negativeAccounts = accounts.filter(
    (account) => parseFloat(account.balance) < 0,
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Saldo Total */}
        <div className="text-center py-2 md:py-0">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                totalBalance >= 0 ? "bg-primary/10" : "bg-gray-500/10"
              }`}
            >
              <CreditCardIcon
                className={`h-4 w-4 ${
                  totalBalance >= 0 ? "text-primary" : "text-gray-500"
                }`}
              />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Saldo Total
            </p>
          </div>
          <p
            className={`text-2xl font-bold ${
              totalBalance >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {formatCurrency(totalBalance)}
          </p>
        </div>

        {/* Contas Positivas */}
        <div className="text-center py-2 md:py-0 md:px-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
              <TrendingUpIcon className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Contas Positivas
            </p>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {positiveAccounts.length}
          </p>
        </div>

        {/* Contas Negativas */}
        <div className="text-center py-2 md:py-0 md:px-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
              <TrendingDownIcon className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Contas Negativas
            </p>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {negativeAccounts.length}
          </p>
        </div>
      </div>

      <Separator />

      {/* Accounts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCardIcon className="h-5 w-5 text-foreground" />
            <h2 className="text-xl font-semibold text-foreground">
              Suas Contas Bancárias
            </h2>
          </div>
          <Badge variant="secondary" className="text-xs">
            {accounts.length} {accounts.length === 1 ? "conta" : "contas"}
          </Badge>
        </div>

        <div className="space-y-3">
          {accounts.map((account) => (
            <AccountItem
              key={account.id}
              account={account}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
