import {
  BanknoteIcon,
  CreditCardIcon,
  EditIcon,
  Receipt,
  TrashIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

import { useGetAccounts } from "@/features/accounts/hooks/data";
import { useGetCreditCards } from "@/features/credit-cards/hooks/data";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/shared/components/ui";
import { Transaction } from "@/lib/schemas";

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: number) => void;
  isDeleting: boolean;
}

export function TransactionItem({
  transaction,
  onEdit,
  onDelete,
  isDeleting,
}: TransactionItemProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: accounts = [] } = useGetAccounts();
  const { data: creditCards = [] } = useGetCreditCards();

  const account = accounts.find((acc) => acc.id === transaction.accountId);
  const creditCard = creditCards.find(
    (card) => card.id === transaction.creditCardId,
  );
  const isIncome = transaction.type === "income";

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const handleDelete = () => {
    onDelete(transaction.id);
    setDeleteDialogOpen(false);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0 ${
                isIncome ? "bg-green-500/10" : "bg-red-500/10"
              }`}
            >
              {isIncome ? (
                <TrendingUp className="h-6 w-6 text-green-500" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-500" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-foreground truncate">
                  {transaction.description}
                </h3>
                <Badge
                  className="text-xs flex-shrink-0"
                  variant={isIncome ? "default" : "destructive"}
                >
                  {isIncome ? "Receita" : "Despesa"}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <Receipt className="h-3 w-3" />
                    {transaction.category}
                  </span>
                  <span>•</span>
                  <span>{formatDate(transaction.date)}</span>
                </div>

                {(account || creditCard) && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {account && (
                      <div className="flex items-center gap-1">
                        <BanknoteIcon className="h-3 w-3" />
                        <span>{account.name}</span>
                      </div>
                    )}
                    {creditCard && (
                      <div className="flex items-center gap-1">
                        <CreditCardIcon className="h-3 w-3" />
                        <span>{creditCard.name}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <div className="text-right">
              <span
                className={`text-xl font-bold ${
                  isIncome
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {formatCurrency(parseFloat(transaction.amount))}
              </span>
            </div>

            <div className="flex items-center gap-1 ml-4">
              <Button
                className="h-9 px-3 hover:bg-primary/10"
                size="sm"
                variant="ghost"
                onClick={() => onEdit(transaction)}
              >
                <EditIcon className="h-4 w-4 mr-1" />
                Editar
              </Button>

              <Dialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    className="h-9 px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                    size="sm"
                    variant="ghost"
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
                      <DialogTitle className="text-xl">
                        Confirmar Exclusão
                      </DialogTitle>
                      <DialogDescription className="text-sm">
                        Esta ação não pode ser desfeita e removerá
                        permanentemente o lançamento.
                      </DialogDescription>
                    </div>
                  </DialogHeader>

                  <div className="bg-muted/50 rounded-lg p-4 border border-dashed">
                    <div className="text-center">
                      <p className="font-medium text-foreground">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(parseFloat(transaction.amount))} •{" "}
                        {transaction.category}
                      </p>
                    </div>
                  </div>

                  <DialogFooter className="flex gap-3 sm:gap-3">
                    <Button
                      className="flex-1"
                      disabled={isDeleting}
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="flex-1"
                      disabled={isDeleting}
                      variant="destructive"
                      onClick={handleDelete}
                    >
                      {isDeleting ? (
                        "Excluindo..."
                      ) : (
                        <>
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Excluir Lançamento
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
