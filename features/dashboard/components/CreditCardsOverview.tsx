import { CreditCard } from "@/lib/schemas";
import { CreditCard as CreditCardIcon, Settings } from "lucide-react";
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
          title="Cartões de Crédito"
          icon={CreditCardIcon}
          iconColor="text-purple-500"
          iconBgColor="bg-purple-500/10"
          emptyMessage="Nenhum cartão cadastrado"
          actionText="Adicionar Cartão"
          actionHref="/credit_cards"
        />
      </ResourceCard>
    );
  }

  return (
    <ResourceCard>
      <ResourceCard.Header
        title="Cartões de Crédito"
        icon={CreditCardIcon}
        iconColor="text-purple-500"
        iconBgColor="bg-purple-500/10"
        count={creditCards.length}
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
              id={card.id}
              name={card.name}
              currentBill={parseFloat(card.currentBill)}
              limit={parseFloat(card.limit)}
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
