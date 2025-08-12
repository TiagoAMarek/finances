import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { EditIcon, TrashIcon, CreditCardIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { BankAccount } from "@/lib/schemas";

interface AccountItemProps {
  account: BankAccount;
  onEdit: (account: BankAccount) => void;
  onDelete: (accountId: number) => void;
  isDeleting: boolean;
}

export function AccountItem({
  account,
  onEdit,
  onDelete,
  isDeleting,
}: AccountItemProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const balance = parseFloat(account.balance);
  const isPositive = balance >= 0;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleDelete = () => {
    onDelete(account.id);
    setDeleteDialogOpen(false);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <CreditCardIcon className="h-6 w-6 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-foreground truncate">
                  {account.name}
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                {isPositive ? (
                  <TrendingUpIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDownIcon className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-xl font-bold ${
                  isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatCurrency(Math.abs(balance))}
                </span>
                {!isPositive && (
                  <Badge variant="destructive" className="text-xs">
                    Negativo
                  </Badge>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground mt-1">
                Saldo disponível na conta
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(account)}
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
                      Esta ação não pode ser desfeita e removerá permanentemente a conta.
                    </DialogDescription>
                  </div>
                </DialogHeader>
                
                <div className="bg-muted/50 rounded-lg p-4 border border-dashed">
                  <div className="text-center">
                    <p className="font-medium text-foreground">
                      {account.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Saldo: {formatCurrency(balance)}
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
                        Excluir Conta
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}