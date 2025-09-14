import { CreditCardIcon, Wallet } from "lucide-react";

import { Badge, Separator, Skeleton } from "@/features/shared/components/ui";
import {
  RowList,
  RowListSkeleton,
} from "@/features/shared/components/ui/row-list";
import { CreditCard } from "@/lib/schemas";

import { CreditCardItem } from "./CreditCardItem";
import { CreditCardsMetricsGrid } from "./CreditCardsMetricsGrid";

interface CreditCardsListProps {
  cards: CreditCard[];
  isLoading: boolean;
  onEdit: (card: CreditCard) => void;
  onDelete: (cardId: number) => void;
  isDeleting: boolean;
}

function CreditCardsListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Metrics Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        ))}
      </div>

      <Separator />

      {/* Cards List Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>

        <RowListSkeleton rows={3} showSubtitle={true} />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-12 text-center border border-dashed rounded-lg">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Wallet className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-medium">Nenhum cartão encontrado</h3>
      <p className="mt-2 text-muted-foreground">
        Comece criando seu primeiro cartão de crédito para organizar suas
        finanças.
      </p>
    </div>
  );
}

export function CreditCardsList({
  cards,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
}: CreditCardsListProps) {
  if (isLoading) {
    return <CreditCardsListSkeleton />;
  }

  if (cards.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <CreditCardsMetricsGrid cards={cards} />

      <Separator />

      {/* Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCardIcon className="h-5 w-5 text-foreground" />
            <h2 className="text-xl font-semibold text-foreground">
              Seus Cartões de Crédito
            </h2>
          </div>
          <Badge className="text-xs" variant="secondary">
            {cards.length} {cards.length === 1 ? "cartão" : "cartões"}
          </Badge>
        </div>

        <RowList>
          {cards.map((card) => (
            <CreditCardItem
              key={card.id}
              card={card}
              isDeleting={isDeleting}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </RowList>
      </div>
    </div>
  );
}
