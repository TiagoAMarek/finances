import { Banknote, Settings } from "lucide-react";

import { BankAccount } from "@/lib/schemas";

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
          actionHref="/accounts"
          actionText="Adicionar Conta"
          emptyMessage="Nenhuma conta cadastrada"
          icon={Banknote}
          iconBgColor="bg-blue-500/10"
          iconColor="text-blue-500"
          title="Contas Bancárias"
        />
      </ResourceCard>
    );
  }

  return (
    <ResourceCard>
      <ResourceCard.Header
        count={accounts.length}
        icon={Banknote}
        iconBgColor="bg-blue-500/10"
        iconColor="text-blue-500"
        title="Contas Bancárias"
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
              balance={parseFloat(account.balance)}
              id={account.id}
              name={account.name}
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
