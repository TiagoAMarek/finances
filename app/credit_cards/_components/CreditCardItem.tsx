import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { EditIcon, TrashIcon, CreditCardIcon, AlertTriangleIcon } from "lucide-react";
import { CreditCard } from "@/lib/schemas";

interface CreditCardItemProps {
  card: CreditCard;
  onEdit: (card: CreditCard) => void;
  onDelete: (cardId: number) => void;
  isDeleting: boolean;
}

export function CreditCardItem({
  card,
  onEdit,
  onDelete,
  isDeleting,
}: CreditCardItemProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const limit = parseFloat(card.limit);
  const currentBill = parseFloat(card.currentBill);
  const availableCredit = limit - currentBill;
  const usagePercentage = limit > 0 ? (currentBill / limit) * 100 : 0;
  const isHighUsage = usagePercentage > 80;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleDelete = () => {
    onDelete(card.id);
    setDeleteDialogOpen(false);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <CreditCardIcon className="h-6 w-6 text-blue-500" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold text-foreground truncate">
                    {card.name}
                  </h3>
                  {isHighUsage && (
                    <div className="flex items-center gap-1">
                      <AlertTriangleIcon className="h-4 w-4 text-amber-500" />
                      <Badge variant="secondary" className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-500/10">
                        Alto uso
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Limite: {formatCurrency(limit)}</span>
                  <span>•</span>
                  <span>Disponível: {formatCurrency(availableCredit)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(card)}
                className="h-9 px-3 hover:bg-primary/10"
              >
                <EditIcon className="h-4 w-4 mr-1" />
                Editar
              </Button>
              
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader className="text-center space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                      <TrashIcon className="h-6 w-6 text-destructive" />
                    </div>
                    <div className="space-y-1">
                      <DialogTitle className="text-xl">Confirmar Exclusão</DialogTitle>
                      <DialogDescription className="text-sm">
                        Esta ação não pode ser desfeita e removerá permanentemente o cartão.
                      </DialogDescription>
                    </div>
                  </DialogHeader>
                  
                  <div className="bg-muted/50 rounded-lg p-4 border border-dashed">
                    <div className="text-center">
                      <p className="font-medium text-foreground">
                        {card.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Fatura: {formatCurrency(currentBill)} • Limite: {formatCurrency(limit)}
                      </p>
                    </div>
                  </div>
                  
                  <DialogFooter className="flex gap-3 sm:gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(false)}
                      className="flex-1"
                      disabled={isDeleting}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex-1"
                    >
                      {isDeleting ? (
                        "Excluindo..."
                      ) : (
                        <>
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Excluir Cartão
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Fatura e Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Fatura Atual
              </span>
              <div className="text-right">
                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(currentBill)}
                </span>
                <p className="text-xs text-muted-foreground">
                  {usagePercentage.toFixed(1)}% do limite
                </p>
              </div>
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
      </CardContent>
    </Card>
  );
}