import { BankAccount } from "@/lib/schemas";
import { Banknote, Settings } from "lucide-react";
import { BankAccountItem, ResourceCard } from "./";

interface AccountsOverviewProps {
  accounts: BankAccount[];
  totalBalance: number;
}

export function AccountsOverview({
  accounts,
  totalBalance,
}: AccountsOverviewProps) {
  if (accounts.length === 0) {
    return (
      <ResourceCard>
        <ResourceCard.Empty
          title="Contas Bancárias"
          icon={Banknote}
          iconColor="text-blue-500"
          iconBgColor="bg-blue-500/10"
          emptyMessage="Nenhuma conta cadastrada"
          actionText="Adicionar Conta"
          actionHref="/accounts"
        />
      </ResourceCard>
    );
  }

  return (
    <ResourceCard>
      <ResourceCard.Header
        title="Contas Bancárias"
        icon={Banknote}
        iconColor="text-blue-500"
        iconBgColor="bg-blue-500/10"
        count={accounts.length}
      />
      <ResourceCard.Content>
        <ResourceCard.Summary
          label="Saldo Total"
          value={totalBalance}
          valueColor={
            totalBalance >= 0
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }
        />

        <ResourceCard.List>
          {accounts.map((account) => (
            <BankAccountItem
              key={account.id}
              id={account.id}
              name={account.name}
              balance={parseFloat(account.balance)}
            />
          ))}
        </ResourceCard.List>

        <ResourceCard.Action href="/accounts" icon={Settings}>
          Gerenciar Contas
        </ResourceCard.Action>
      </ResourceCard.Content>
    </ResourceCard>
  );
}
