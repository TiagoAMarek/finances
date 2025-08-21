import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  EditIcon,
  TrashIcon,
  MoreVerticalIcon,
  CopyIcon,
  RepeatIcon,
  ShoppingCartIcon,
  CarIcon,
  HomeIcon,
  UtensilsIcon,
  HeartIcon,
  GraduationCapIcon,
  PlaneIcon,
  GamepadIcon,
  BanknoteIcon,
  CreditCardIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from "lucide-react";
import { Transaction } from "@/lib/schemas";
import { useGetAccounts } from "@/features/accounts/hooks/data";
import { useGetCreditCards } from "@/features/credit-cards/hooks/data";

interface TransactionListItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: number) => void;
  isDeleting: boolean;
}

// Category icon mapping with colors
const getCategoryIcon = (
  category: string,
  type: "income" | "expense" | "transfer",
  transaction: Transaction,
) => {
  const categoryLower = category.toLowerCase();

  // Default icons for income/expense/transfer
  const defaultIcon =
    type === "income"
      ? { icon: TrendingUpIcon, color: "bg-green-500" }
      : type === "transfer"
        ? { icon: BanknoteIcon, color: "bg-blue-500" }
        : { icon: TrendingDownIcon, color: "bg-red-500" };

  // Category-specific mappings
  const categoryMappings: Record<
    string,
    { icon: React.ComponentType<{ className?: string }>; color: string }
  > = {
    // Shopping & Retail
    compras: { icon: ShoppingCartIcon, color: "bg-pink-500" },
    mercado: { icon: ShoppingCartIcon, color: "bg-orange-500" },
    supermercado: { icon: ShoppingCartIcon, color: "bg-orange-500" },
    shopping: { icon: ShoppingCartIcon, color: "bg-pink-500" },
    market4u: { icon: ShoppingCartIcon, color: "bg-orange-500" },

    // Transportation
    transporte: { icon: CarIcon, color: "bg-blue-500" },
    combustível: { icon: CarIcon, color: "bg-blue-600" },
    uber: { icon: CarIcon, color: "bg-gray-800" },
    taxi: { icon: CarIcon, color: "bg-yellow-500" },

    // Food & Dining
    alimentação: { icon: UtensilsIcon, color: "bg-red-500" },
    restaurante: { icon: UtensilsIcon, color: "bg-red-600" },
    comida: { icon: UtensilsIcon, color: "bg-orange-600" },
    ifood: { icon: UtensilsIcon, color: "bg-red-500" },
    jeronimo: { icon: UtensilsIcon, color: "bg-purple-500" },

    // Health & Pharmacy
    saúde: { icon: HeartIcon, color: "bg-red-400" },
    farmácia: { icon: HeartIcon, color: "bg-blue-400" },
    panvel: { icon: HeartIcon, color: "bg-blue-500" },
    medicina: { icon: HeartIcon, color: "bg-red-400" },

    // Education
    educação: { icon: GraduationCapIcon, color: "bg-indigo-500" },
    curso: { icon: GraduationCapIcon, color: "bg-indigo-600" },
    livros: { icon: GraduationCapIcon, color: "bg-purple-600" },

    // Travel
    viagem: { icon: PlaneIcon, color: "bg-sky-500" },
    hotel: { icon: PlaneIcon, color: "bg-sky-600" },
    iguatemi: { icon: PlaneIcon, color: "bg-blue-500" },

    // Entertainment
    entretenimento: { icon: GamepadIcon, color: "bg-purple-500" },
    jogos: { icon: GamepadIcon, color: "bg-purple-600" },
    cinema: { icon: GamepadIcon, color: "bg-indigo-500" },

    // Home & Utilities
    casa: { icon: HomeIcon, color: "bg-green-600" },
    utilidades: { icon: HomeIcon, color: "bg-gray-500" },
    conta: { icon: HomeIcon, color: "bg-gray-600" },

    // Banking & Finance
    banco: { icon: BanknoteIcon, color: "bg-green-700" },
    investimento: { icon: TrendingUpIcon, color: "bg-green-600" },
    poupança: { icon: BanknoteIcon, color: "bg-blue-700" },

    // Insurance & Security
    seguro: { icon: CreditCardIcon, color: "bg-blue-800" },
    yelum: { icon: CreditCardIcon, color: "bg-blue-700" },
  };

  // Try to find a match in the category mappings
  for (const [key, value] of Object.entries(categoryMappings)) {
    if (categoryLower.includes(key)) {
      return value;
    }
  }

  // Also check description for better matching
  const description = transaction.description?.toLowerCase() || "";
  for (const [key, value] of Object.entries(categoryMappings)) {
    if (description.includes(key)) {
      return value;
    }
  }

  return defaultIcon;
};

export function TransactionListItem({
  transaction,
  onEdit,
  onDelete,
  isDeleting,
}: TransactionListItemProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { data: accounts = [] } = useGetAccounts();
  const { data: creditCards = [] } = useGetCreditCards();

  const formatCurrency = (value: string) => {
    const amount = parseFloat(value);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  const getAccountName = (accountId: number | null) => {
    if (!accountId) return null;
    const account = accounts.find((acc) => acc.id === accountId);
    return account?.name || "N/A";
  };

  const getCreditCardName = (creditCardId: number | null) => {
    if (!creditCardId) return null;
    const card = creditCards.find((card) => card.id === creditCardId);
    return card?.name || "N/A";
  };

  const handleDelete = () => {
    onDelete(transaction.id);
    setDeleteDialogOpen(false);
  };

  const handleDuplicate = () => {
    console.log("Duplicate transaction:", transaction.id);
  };

  const handleCopyDetails = async () => {
    try {
      const details = `${transaction.description}: ${formatCurrency(transaction.amount)} - ${transaction.category}`;
      await navigator.clipboard.writeText(details);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleAddToTemplate = () => {
    console.log("Add to template:", transaction.id);
  };

  const isIncome = transaction.type === "income";
  const isTransfer = transaction.type === "transfer";
  const accountName = getAccountName(transaction.accountId);
  const creditCardName = getCreditCardName(transaction.creditCardId);
  const categoryIcon = getCategoryIcon(
    transaction.category,
    transaction.type,
    transaction,
  );
  const IconComponent = categoryIcon.icon;

  return (
    <div
      className={`group relative flex items-center gap-4 p-4 transition-all duration-200 hover:bg-muted/30 ${
        isDeleting ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {isDeleting && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span className="text-sm text-muted-foreground">Excluindo...</span>
          </div>
        </div>
      )}

      {/* Category Icon */}
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${categoryIcon.color} flex-shrink-0`}
      >
        <IconComponent className="h-6 w-6 text-white" />
      </div>

      {/* Transaction Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground truncate">
              {transaction.description}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">
                {transaction.category}
              </span>
              {(accountName || creditCardName) && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {accountName || creditCardName}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Amount and Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <span
                className={`text-lg font-bold ${
                  isIncome
                    ? "text-green-600 dark:text-green-400"
                    : isTransfer
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-red-600 dark:text-red-400"
                }`}
              >
                {isIncome ? "+" : isTransfer ? "" : "-"}
                {formatCurrency(transaction.amount)}
              </span>
              {isIncome && (
                <Badge
                  variant="outline"
                  className="ml-2 text-xs border-green-200 text-green-700 dark:border-green-800 dark:text-green-400"
                >
                  Receita
                </Badge>
              )}
              {isTransfer && (
                <Badge
                  variant="outline"
                  className="ml-2 text-xs border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400"
                >
                  Transferência
                </Badge>
              )}
            </div>

            {/* Actions Menu */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-muted"
                    aria-label="Mais opções"
                    disabled={isDeleting}
                  >
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => onEdit(transaction)}
                    className="cursor-pointer"
                  >
                    <EditIcon className="h-4 w-4 mr-2" />
                    Editar transação
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDuplicate}
                    className="cursor-pointer"
                  >
                    <CopyIcon className="h-4 w-4 mr-2" />
                    Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleCopyDetails}
                    className="cursor-pointer"
                  >
                    <CopyIcon className="h-4 w-4 mr-2" />
                    Copiar dados
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleAddToTemplate}
                    className="cursor-pointer"
                  >
                    <RepeatIcon className="h-4 w-4 mr-2" />
                    Salvar como modelo
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                  >
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                      onSelect={(e) => {
                        e.preventDefault();
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Excluir transação
                    </DropdownMenuItem>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir a transação &quot;
                          {transaction.description}&quot;? Esta ação não pode
                          ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          disabled={isDeleting}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isDeleting ? "Excluindo..." : "Excluir"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
