import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCardIcon className="h-5 w-5" />
          Contas Existentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Banknote className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            Nenhuma conta encontrada
          </h3>
          <p className="text-muted-foreground">
            Você ainda não cadastrou nenhuma conta bancária. Use o botão &quot;Nova
            Conta&quot; acima para começar.
          </p>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCardIcon className="h-5 w-5" />
          Contas Existentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
      </CardContent>
    </Card>
  );
}