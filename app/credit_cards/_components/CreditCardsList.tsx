import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CreditCardIcon,
  TrendingDownIcon,
  AlertTriangleIcon,
  Wallet,
} from "lucide-react";
import { CreditCard } from "@/lib/schemas";
import { CreditCardItem } from "./CreditCardItem";

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
      {/* Summary Statistics Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Total das Faturas Skeleton */}
        <div className="text-center py-2 md:py-0">
          <Skeleton className="h-4 w-24 mb-2 mx-auto" />
          <Skeleton className="h-8 w-32 mx-auto" />
        </div>

        {/* Limite Total Skeleton */}
        <div className="text-center py-2 md:py-0 md:px-8">
          <Skeleton className="h-4 w-20 mb-2 mx-auto" />
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>

        {/* Cartões com Alto Uso Skeleton */}
        <div className="text-center py-2 md:py-0 md:px-8">
          <Skeleton className="h-4 w-28 mb-2 mx-auto" />
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
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

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <Skeleton className="h-12 w-12 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-16" />
                      <Skeleton className="h-9 w-16" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-6">
          <Wallet className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Nenhum cartão cadastrado</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Comece adicionando seus cartões de crédito para ter controle total das
          suas despesas. Use o botão &quot;Novo Cartão&quot; no topo da página.
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CreditCardIcon className="h-4 w-4" />
          <span>Gerencie todos os seus cartões em um só lugar</span>
        </div>
      </CardContent>
    </Card>
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

  // Calculate summary statistics
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Total das Faturas */}
        <div className="text-center py-2 md:py-0">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
              <TrendingDownIcon className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Total das Faturas
            </p>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(totalBills)}
          </p>
        </div>

        {/* Limite Total */}
        <div className="text-center py-2 md:py-0 md:px-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
              <CreditCardIcon className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Limite Total
            </p>
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(totalLimit)}
          </p>
        </div>

        {/* Cartões com Alto Uso */}
        <div className="text-center py-2 md:py-0 md:px-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
              <AlertTriangleIcon className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Alto Uso
            </p>
          </div>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {cardsWithHighUsage.length}
          </p>
        </div>
      </div>

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
          <Badge variant="secondary" className="text-xs">
            {cards.length} {cards.length === 1 ? "cartão" : "cartões"}
          </Badge>
        </div>

        <div className="space-y-3">
          {cards.map((card) => (
            <CreditCardItem
              key={card.id}
              card={card}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
