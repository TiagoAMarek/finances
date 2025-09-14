import { CreditCard as CreditCardIcon, Settings } from "lucide-react";

import { CreditCard } from "@/lib/schemas";

import { CreditCardItem, ResourceCard } from "./";

interface CreditCardsOverviewProps {
  creditCards: CreditCard[];
}

export function CreditCardsOverview({ creditCards }: CreditCardsOverviewProps) {
  // Calculate total bills
  const totalBills = creditCards.reduce(
    (sum, card) => sum + parseFloat(card.currentBill),
    0,
  );

  if (creditCards.length === 0) {
    return (
      <ResourceCard>
        <ResourceCard.Empty
          actionHref="/credit_cards"
          actionText="Adicionar Cartão"
          emptyMessage="Nenhum cartão cadastrado"
          icon={CreditCardIcon}
          iconBgColor="bg-purple-500/10"
          iconColor="text-purple-500"
          title="Cartões de Crédito"
        />
      </ResourceCard>
    );
  }

  return (
    <ResourceCard>
      <ResourceCard.Header
        count={creditCards.length}
        icon={CreditCardIcon}
        iconBgColor="bg-purple-500/10"
        iconColor="text-purple-500"
        title="Cartões de Crédito"
      />
      <ResourceCard.Content>
        <ResourceCard.Summary
          label="Total das Faturas"
          value={totalBills}
          valueColor="text-red-600 dark:text-red-400"
        />

        <ResourceCard.List>
          {creditCards.map((card) => (
            <CreditCardItem
              key={card.id}
              currentBill={parseFloat(card.currentBill)}
              id={card.id}
              limit={parseFloat(card.limit)}
              name={card.name}
            />
          ))}
        </ResourceCard.List>

        <ResourceCard.Action href="/credit_cards" icon={Settings}>
          Gerenciar Cartões
        </ResourceCard.Action>
      </ResourceCard.Content>
    </ResourceCard>
  );
}
