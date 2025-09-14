import {
  AlertTriangle,
  CreditCard as CreditCardIcon,
  TrendingDown,
} from "lucide-react";
import { memo } from "react";

import { MetricCard } from "@/features/shared/components/ui";
import { CreditCard } from "@/lib/schemas";

interface CreditCardsMetricsGridProps {
  cards: CreditCard[];
}

export const CreditCardsMetricsGrid = memo<CreditCardsMetricsGridProps>(
  function CreditCardsMetricsGrid({ cards }) {
    // Calculate metrics
    const totalBills = cards.reduce(
      (sum, card) => sum + parseFloat(card.currentBill),
      0,
    );

    const totalLimit = cards.reduce(
      (sum, card) => sum + parseFloat(card.limit),
      0,
    );

    const cardsWithHighUsage = cards.filter((card) => {
      const usage = parseFloat(card.currentBill) / parseFloat(card.limit);
      return usage > 0.8;
    });

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          description="Valor total a pagar"
          formatValue="currency"
          icon={TrendingDown}
          iconTheme="danger"
          title="Total das Faturas"
          value={totalBills}
          valueTheme="danger"
        />
        <MetricCard
          description="Crédito disponível total"
          formatValue="currency"
          icon={CreditCardIcon}
          iconTheme="primary"
          title="Limite Total"
          value={totalLimit}
          valueTheme="primary"
        />
        <MetricCard
          description={
            cards.length > 0
              ? `${cards.length === 1 ? "cartão" : "cartões"} acima de 80%`
              : "Nenhum cartão"
          }
          formatValue="number"
          icon={AlertTriangle}
          iconTheme={cardsWithHighUsage.length > 0 ? "warning" : "neutral"}
          title="Alto Uso"
          value={cardsWithHighUsage.length}
          valueTheme={cardsWithHighUsage.length > 0 ? "warning" : "success"}
        />
      </div>
    );
  },
);
