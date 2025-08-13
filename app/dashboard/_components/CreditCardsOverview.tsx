import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CreditCardIcon, AlertTriangleIcon, Wallet, TrendingDownIcon, Settings } from "lucide-react";
import { CreditCard } from "@/lib/schemas";

interface CreditCardsOverviewProps {
  creditCards: CreditCard[];
}

export function CreditCardsOverview({ creditCards }: CreditCardsOverviewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Calcular total das faturas
  const totalBills = creditCards.reduce((sum, card) => sum + parseFloat(card.currentBill), 0);

  if (creditCards.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCardIcon className="h-5 w-5 text-foreground" />
            <h2 className="text-xl font-semibold text-foreground">Cartões de Crédito</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">0 cartões</Badge>
            <Button asChild variant="outline" size="sm">
              <Link href="/credit-cards" className="flex items-center gap-1">
                <Settings className="h-3 w-3" />
                Gerenciar
              </Link>
            </Button>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
            <Wallet className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">
            Nenhum cartão cadastrado
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cabeçalho com título e total das faturas */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCardIcon className="h-5 w-5 text-foreground" />
            <h2 className="text-xl font-semibold text-foreground">Cartões de Crédito</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {creditCards.length} {creditCards.length === 1 ? 'cartão' : 'cartões'}
            </Badge>
            <Button asChild variant="outline" size="sm">
              <Link href="/credit-cards" className="flex items-center gap-1">
                <Settings className="h-3 w-3" />
                Gerenciar
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Total das Faturas */}
        <div className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg border border-dashed">
          <span className="text-sm font-medium text-muted-foreground">
            Total das Faturas
          </span>
          <div className="flex items-center gap-2">
            <TrendingDownIcon className="h-4 w-4 text-red-500" />
            <span className="text-lg font-bold text-red-600 dark:text-red-400">
              {formatCurrency(totalBills)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Lista de cartões individuais */}
      <div className="space-y-2">
        {creditCards.map((card) => {
          const limit = parseFloat(card.limit);
          const currentBill = parseFloat(card.currentBill);
          const availableCredit = limit - currentBill;
          const usagePercentage = limit > 0 ? (currentBill / limit) * 100 : 0;
          const isHighUsage = usagePercentage > 80;
          
          return (
            <div
              key={card.id}
              className="p-3 rounded-lg border space-y-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 flex-shrink-0">
                    <CreditCardIcon className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground truncate">{card.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Limite: {formatCurrency(limit)}</span>
                      {isHighUsage && (
                        <div className="flex items-center gap-1">
                          <AlertTriangleIcon className="h-3 w-3 text-amber-500" />
                          <span className="text-amber-600 dark:text-amber-400">Alto uso</span>
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
                    {usagePercentage.toFixed(1)}% usado
                  </p>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Disponível: {formatCurrency(availableCredit)}
                  </span>
                </div>
                <Progress 
                  value={usagePercentage} 
                  className={`h-1.5 ${
                    isHighUsage 
                      ? '[&>div]:bg-amber-500' 
                      : usagePercentage > 50 
                        ? '[&>div]:bg-orange-500'
                        : '[&>div]:bg-green-500'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}