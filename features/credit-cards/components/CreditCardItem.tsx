import {
  AlertTriangle,
  CreditCard,
  Edit2,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import { Badge, Button, Progress } from "@/features/shared/components/ui";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/features/shared/components/ui/dropdown-menu";
import { RowListItem } from "@/features/shared/components/ui/row-list";
import { CreditCard as CreditCardType } from "@/lib/schemas";

interface CreditCardItemProps {
  card: CreditCardType;
  onEdit: (card: CreditCardType) => void;
  onDelete: (cardId: number) => void;
  isDeleting: boolean;
}

export function CreditCardItem({
  card,
  onEdit,
  onDelete,
  isDeleting,
}: CreditCardItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const limit = parseFloat(card.limit);
  const currentBill = parseFloat(card.currentBill);
  const availableCredit = limit - currentBill;
  const usagePercentage = limit > 0 ? (currentBill / limit) * 100 : 0;
  const isHighUsage = usagePercentage > 80;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleDelete = () => {
    onDelete(card.id);
    setShowDeleteDialog(false);
  };

  const getUsageColor = () => {
    if (isHighUsage)
      return "text-amber-600 bg-amber-100 dark:bg-amber-900 dark:text-amber-300";
    if (usagePercentage > 50)
      return "text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300";
    return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300";
  };

  const icon = (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 flex-shrink-0">
      <CreditCard className="h-5 w-5 text-white" />
    </div>
  );

  const subtitle = (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge className="text-xs font-medium" variant="secondary">
          Fatura: {formatCurrency(currentBill)}
        </Badge>
        <Badge
          className={`text-xs font-medium ${getUsageColor()}`}
          variant="secondary"
        >
          {usagePercentage.toFixed(1)}% usado
        </Badge>
        {isHighUsage && (
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-amber-500" />
            <Badge
              className="text-xs text-amber-600 bg-amber-100 dark:bg-amber-900 dark:text-amber-300"
              variant="secondary"
            >
              Alto uso
            </Badge>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Limite: {formatCurrency(limit)}</span>
          <span>Disponível: {formatCurrency(availableCredit)}</span>
        </div>
        <Progress
          className={`h-1.5 ${
            isHighUsage
              ? "[&>div]:bg-amber-500"
              : usagePercentage > 50
                ? "[&>div]:bg-orange-500"
                : "[&>div]:bg-green-500"
          }`}
          value={usagePercentage}
        />
      </div>
    </div>
  );

  const actions = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={`Ações do cartão ${card.name}`}
          className="h-8 w-8 p-0 hover:bg-muted/80 opacity-0 group-hover:opacity-100 transition-opacity"
          size="sm"
          variant="ghost"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(card)}>
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
        title={card.name}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cartão de crédito</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cartão &quot;{card.name}&quot;?
              Esta ação não pode ser desfeita e removerá permanentemente o
              cartão e todas as suas transações.
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
