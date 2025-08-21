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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  EditIcon,
  TrashIcon,
  CreditCardIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  MoreVerticalIcon,
  PlusIcon,
  EyeIcon,
  CopyIcon,
} from "lucide-react";
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
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleDelete = () => {
    onDelete(account.id);
    setDeleteDialogOpen(false);
  };

  const handleCopyData = async () => {
    try {
      await navigator.clipboard.writeText(
        `${account.name}: ${formatCurrency(balance)}`,
      );
      // TODO: Add toast notification
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleNewTransaction = () => {
    // TODO: Integrate with transaction creation flow
    console.log("New transaction for account:", account.id);
  };

  const handleViewDetails = () => {
    // TODO: Navigate to account details page
    console.log("View details for account:", account.id);
  };

  return (
    <Card
      className={`group transition-all duration-200 ${
        isDeleting
          ? "opacity-50 pointer-events-none"
          : "hover:shadow-lg hover:border-primary/20 hover:-translate-y-1"
      }`}
      role="article"
      aria-label={`Conta ${account.name} com saldo de ${formatCurrency(balance)}`}
    >
      <CardContent className="p-6 relative">
        {isDeleting && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span className="text-sm text-muted-foreground">
                Excluindo...
              </span>
            </div>
          </div>
        )}
        <div className="space-y-4">
          {/* Header with icon and name */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 ${
                  isPositive
                    ? "bg-green-500/10 group-hover:bg-green-500/20"
                    : "bg-red-500/10 group-hover:bg-red-500/20"
                } transition-colors duration-200`}
              >
                <CreditCardIcon
                  className={`h-5 w-5 ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {account.name}
                </h3>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-xs text-muted-foreground">
                    ID: {account.id}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isPositive && (
                <Badge variant="destructive" className="text-xs flex-shrink-0">
                  Negativo
                </Badge>
              )}
              {isPositive && (
                <Badge
                  variant="secondary"
                  className="text-xs flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Ativo
                </Badge>
              )}
            </div>
          </div>

          {/* Balance */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {isPositive ? (
                <TrendingUpIcon className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDownIcon className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-xl font-bold ${
                  isPositive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {formatCurrency(Math.abs(balance))}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Saldo disponível na conta
              </p>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-xs text-muted-foreground">
                  Tipo: Conta Corrente • Banco: {account.name.split(" ")[0]}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-muted-foreground">
                {isPositive ? "✓ Ativo" : "⚠ Atenção"}
              </span>
            </div>

            <div className="opacity-60 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-muted/80 disabled:opacity-50"
                    aria-label="Mais opções"
                    disabled={isDeleting}
                  >
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => onEdit(account)}
                    className="cursor-pointer"
                    aria-label={`Editar conta ${account.name}`}
                  >
                    <EditIcon className="h-4 w-4 mr-2" />
                    Editar conta
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleNewTransaction}
                    className="cursor-pointer"
                    aria-label={`Criar nova transação para ${account.name}`}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Nova transação
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleViewDetails}
                    className="cursor-pointer"
                    aria-label={`Ver detalhes da conta ${account.name}`}
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    Ver detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleCopyData}
                    className="cursor-pointer"
                    aria-label={`Copiar dados da conta ${account.name}`}
                  >
                    <CopyIcon className="h-4 w-4 mr-2" />
                    Copiar dados
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <Dialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <DropdownMenuItem
                        className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <TrashIcon className="h-4 w-4 mr-2" />
                        Excluir conta
                      </DropdownMenuItem>
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
                            permanentemente a conta.
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
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
