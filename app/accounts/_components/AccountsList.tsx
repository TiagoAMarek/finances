import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CreditCardIcon, Banknote } from "lucide-react";
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header skeleton */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>

                {/* Balance skeleton */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <Skeleton className="h-3 w-40" />
                </div>

                {/* Actions skeleton */}
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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

  return (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
  );
}
