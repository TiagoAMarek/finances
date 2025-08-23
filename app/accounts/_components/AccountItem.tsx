import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { RowListItem } from "@/components/ui/row-list";
import { Edit2, Trash2, Banknote, MoreHorizontal } from "lucide-react";
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
        variant={isPositive ? "secondary" : "destructive"}
        className="text-xs font-medium"
      >
        {formatCurrency(balance)}
      </Badge>
      {!isPositive && (
        <Badge variant="destructive" className="text-xs font-medium">
          Saldo Negativo
        </Badge>
      )}
    </>
  );

  const actions = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-muted/80 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Ações da conta ${account.name}`}
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
          onClick={() => setShowDeleteDialog(true)}
          disabled={isDeleting}
          className="text-destructive"
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
        icon={icon}
        title={account.name}
        subtitle={subtitle}
        actions={actions}
        isLoading={isDeleting}
        loadingText="Processando..."
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
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
