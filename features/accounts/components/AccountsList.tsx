import { Banknote, CreditCardIcon } from "lucide-react";

import {
  Badge,
  RowList,
  RowListSkeleton,
} from "@/features/shared/components/ui";
import { BankAccount } from "@/lib/schemas";

import { AccountItem } from "./AccountItem";

interface AccountsListProps {
  accounts: BankAccount[];
  isLoading: boolean;
  onEdit: (account: BankAccount) => void;
  onDelete: (accountId: number) => void;
  isDeleting: boolean;
}

function EmptyState() {
  return (
    <div className="py-12 text-center border border-dashed rounded-lg">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Banknote className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-medium">Nenhuma conta encontrada</h3>
      <p className="mt-2 text-muted-foreground">
        Comece criando sua primeira conta para organizar suas finanças.
      </p>
    </div>
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
    return <RowListSkeleton rows={6} showSubtitle={true} />;
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
        <Badge className="text-xs" variant="secondary">
          {accounts.length} {accounts.length === 1 ? "conta" : "contas"}
        </Badge>
      </div>

      <RowList>
        {accounts.map((account) => (
          <AccountItem
            key={account.id}
            account={account}
            isDeleting={isDeleting}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </RowList>
    </div>
  );
}
