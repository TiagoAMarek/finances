import { MetricCard } from "@/features/shared/components/ui";
import { CreditCard } from "@/lib/schemas";
import {
  AlertTriangle,
  CreditCard as CreditCardIcon,
  TrendingDown,
} from "lucide-react";
import { memo } from "react";

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
          title="Total das Faturas"
          value={totalBills}
          description="Valor total a pagar"
          icon={TrendingDown}
          iconTheme="danger"
          valueTheme="danger"
          formatValue="currency"
        />
        <MetricCard
          title="Limite Total"
          value={totalLimit}
          description="Crédito disponível total"
          icon={CreditCardIcon}
          iconTheme="primary"
          valueTheme="primary"
          formatValue="currency"
        />
        <MetricCard
          title="Alto Uso"
          value={cardsWithHighUsage.length}
          description={
            cards.length > 0
              ? `${cards.length === 1 ? "cartão" : "cartões"} acima de 80%`
              : "Nenhum cartão"
          }
          icon={AlertTriangle}
          iconTheme={cardsWithHighUsage.length > 0 ? "warning" : "neutral"}
          valueTheme={cardsWithHighUsage.length > 0 ? "warning" : "success"}
          formatValue="number"
        />
      </div>
    );
  },
);
