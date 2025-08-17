import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CreditCard as CreditCardIcon,
  AlertTriangle,
  Plus,
  Settings,
} from "lucide-react";
import { CreditCard } from "@/lib/schemas";

interface CreditCardsOverviewProps {
  creditCards: CreditCard[];
}

export function CreditCardsOverview({ creditCards }: CreditCardsOverviewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Calcular total das faturas
  const totalBills = creditCards.reduce(
    (sum, card) => sum + parseFloat(card.currentBill),
    0,
  );

  if (creditCards.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">
            Cartões de Crédito
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
            <CreditCardIcon className="h-4 w-4 text-purple-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted/30 mb-3">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Nenhum cartão cadastrado
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/credit_cards">Adicionar Cartão</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          Cartões de Crédito
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {creditCards.length}
          </Badge>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
            <CreditCardIcon className="h-4 w-4 text-purple-500" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col h-full space-y-4">
        {/* Total das Faturas */}
        <div className="p-3 rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Total das Faturas
            </span>
            <span className="text-xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(totalBills)}
            </span>
          </div>
        </div>

        {/* Lista de cartões */}
        <div className="space-y-3 flex-1">
          {creditCards.map((card) => {
            const limit = parseFloat(card.limit);
            const currentBill = parseFloat(card.currentBill);
            const usagePercentage = limit > 0 ? (currentBill / limit) * 100 : 0;
            const isHighUsage = usagePercentage > 80;

            return (
              <div
                key={card.id}
                className="p-3 rounded-lg border space-y-2 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/10 flex-shrink-0">
                      <CreditCardIcon className="h-3 w-3 text-purple-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">
                        {card.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Limite: {formatCurrency(limit)}</span>
                        {isHighUsage && (
                          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Alto uso</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                      {formatCurrency(currentBill)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {usagePercentage.toFixed(0)}% usado
                    </p>
                  </div>
                </div>

                <Progress
                  value={usagePercentage}
                  className={`h-2 ${
                    isHighUsage
                      ? "[&>div]:bg-red-500"
                      : usagePercentage > 50
                        ? "[&>div]:bg-orange-500"
                        : "[&>div]:bg-green-500"
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Botão de gerenciar */}
        <div className="mt-auto pt-4">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href="/credit_cards" className="flex items-center gap-2">
              <Settings className="h-3 w-3" />
              Gerenciar Cartões
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
