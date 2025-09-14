import { Banknote, Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/features/shared/components/ui/alert-dialog";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/features/shared/components/ui/dropdown-menu";
import { RowListItem } from "@/features/shared/components/ui/row-list";
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
    setShowDeleteDialog(false);
  };

  const icon = (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 ${
        isPositive ? "bg-green-500" : "bg-red-500"
      }`}
    >
      <Banknote className="h-5 w-5 text-white" />
    </div>
  );

  const subtitle = (
    <>
      <Badge
        className="text-xs font-medium"
        variant={isPositive ? "secondary" : "destructive"}
      >
        {formatCurrency(balance)}
      </Badge>
      {!isPositive && (
        <Badge className="text-xs font-medium" variant="destructive">
          Saldo Negativo
        </Badge>
      )}
    </>
  );

  const actions = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={`Ações da conta ${account.name}`}
          className="h-8 w-8 p-0 hover:bg-muted/80 opacity-0 group-hover:opacity-100 transition-opacity"
          size="sm"
          variant="ghost"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(account)}>
          <Edit2 className="h-4 w-4 mr-2" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          disabled={isDeleting}
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <RowListItem
        actions={actions}
        icon={icon}
        isLoading={isDeleting}
        loadingText="Processando..."
        subtitle={subtitle}
        title={account.name}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir conta</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a conta &quot;{account.name}
              &quot;? Esta ação não pode ser desfeita e removerá permanentemente
              a conta e todas as suas transações.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
