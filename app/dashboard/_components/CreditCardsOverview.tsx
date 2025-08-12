import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreditCardIcon, AlertTriangleIcon, Wallet } from "lucide-react";
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

  if (creditCards.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCardIcon className="h-5 w-5 text-foreground" />
            <h2 className="text-xl font-semibold text-foreground">Cartões de Crédito</h2>
          </div>
          <Badge variant="secondary" className="text-xs">0 cartões</Badge>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCardIcon className="h-5 w-5 text-foreground" />
          <h2 className="text-xl font-semibold text-foreground">Cartões de Crédito</h2>
        </div>
        <Badge variant="secondary" className="text-xs">
          {creditCards.length} {creditCards.length === 1 ? 'cartão' : 'cartões'}
        </Badge>
      </div>
      
      <div className="space-y-3">
        {creditCards.map((card) => {
          const limit = parseFloat(card.limit);
          const currentBill = parseFloat(card.currentBill);
          const availableCredit = limit - currentBill;
          const usagePercentage = limit > 0 ? (currentBill / limit) * 100 : 0;
          const isHighUsage = usagePercentage > 80;
          
          return (
            <div
              key={card.id}
              className="p-4 rounded-lg border space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                    <CreditCardIcon className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{card.name}</p>
                    {isHighUsage && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertTriangleIcon className="h-3 w-3 text-amber-500" />
                        <span className="text-xs text-amber-600 dark:text-amber-400">
                          Alto uso
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {formatCurrency(currentBill)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    de {formatCurrency(limit)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Disponível: {formatCurrency(availableCredit)}
                  </span>
                  <span className={`font-medium ${
                    isHighUsage 
                      ? 'text-amber-600 dark:text-amber-400' 
                      : usagePercentage > 50 
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-green-600 dark:text-green-400'
                  }`}>
                    {usagePercentage.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={usagePercentage} 
                  className={`h-2 ${
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