import React, { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  MoreHorizontal, 
  EditIcon, 
  TrashIcon, 
  TrendingUpIcon, 
  TrendingDownIcon,
  CalendarIcon,
  CreditCardIcon,
  BanknoteIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from "lucide-react";
import { Transaction } from "@/lib/schemas";
import { useAccounts } from "@/hooks/useAccounts";
import { useCreditCards } from "@/hooks/useCreditCards";

interface TransactionsTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: number) => void;
  isDeleting: boolean;
  isLoading?: boolean;
}

type SortField = 'date' | 'description' | 'amount' | 'category';
type SortDirection = 'asc' | 'desc';

export function TransactionsTable({
  transactions,
  onEdit,
  onDelete,
  isDeleting,
  isLoading = false,
}: TransactionsTableProps) {
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const { data: accounts = [] } = useAccounts();
  const { data: creditCards = [] } = useCreditCards();

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(value));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getAccountName = (accountId: number | null) => {
    if (!accountId) return null;
    const account = accounts.find(acc => acc.id === accountId);
    return account?.name || 'N/A';
  };

  const getCreditCardName = (creditCardId: number | null) => {
    if (!creditCardId) return null;
    const card = creditCards.find(card => card.id === creditCardId);
    return card?.name || 'N/A';
  };

  const getTypeInfo = (type: string) => {
    if (type === 'income') {
      return {
        label: 'Receita',
        icon: TrendingUpIcon,
        className: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
      };
    }
    return {
      label: 'Despesa',
      icon: TrendingDownIcon,
      className: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
    };
  };

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
  };

  const handleDeleteConfirm = () => {
    if (transactionToDelete) {
      onDelete(transactionToDelete.id);
      setTransactionToDelete(null);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return ArrowUpDownIcon;
    return sortDirection === 'asc' ? ArrowUpIcon : ArrowDownIcon;
  };

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        case 'amount':
          aValue = parseFloat(a.amount);
          bValue = parseFloat(b.amount);
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [transactions, sortField, sortDirection]);

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-[120px]">Tipo</TableHead>
              <TableHead className="w-[150px]">Categoria</TableHead>
              <TableHead className="w-[140px]">Conta/Cartão</TableHead>
              <TableHead className="text-right w-[120px]">Valor</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-full max-w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('date')}
                >
                  Data
                  {React.createElement(getSortIcon('date'), { className: "ml-1 h-3 w-3" })}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('description')}
                >
                  Descrição
                  {React.createElement(getSortIcon('description'), { className: "ml-1 h-3 w-3" })}
                </Button>
              </TableHead>
              <TableHead className="w-[120px]">Tipo</TableHead>
              <TableHead className="w-[150px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('category')}
                >
                  Categoria
                  {React.createElement(getSortIcon('category'), { className: "ml-1 h-3 w-3" })}
                </Button>
              </TableHead>
              <TableHead className="w-[140px]">Conta/Cartão</TableHead>
              <TableHead className="text-right w-[120px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('amount')}
                >
                  Valor
                  {React.createElement(getSortIcon('amount'), { className: "ml-1 h-3 w-3" })}
                </Button>
              </TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.map((transaction) => {
              const typeInfo = getTypeInfo(transaction.type);
              const TypeIcon = typeInfo.icon;
              const accountName = getAccountName(transaction.accountId);
              const creditCardName = getCreditCardName(transaction.creditCardId);

              return (
                <TableRow key={transaction.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50">
                        <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <span className="text-sm">{formatDate(transaction.date)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium leading-none">{transaction.description}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={typeInfo.className}>
                      <TypeIcon className="mr-1 h-3 w-3" />
                      {typeInfo.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{transaction.category}</span>
                  </TableCell>
                  <TableCell>
                    {accountName && (
                      <div className="flex items-center gap-1.5">
                        <BanknoteIcon className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm truncate max-w-[100px]" title={accountName}>
                          {accountName}
                        </span>
                      </div>
                    )}
                    {creditCardName && (
                      <div className="flex items-center gap-1.5">
                        <CreditCardIcon className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm truncate max-w-[100px]" title={creditCardName}>
                          {creditCardName}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-bold ${
                      transaction.type === 'income' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatCurrency(transaction.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(transaction)}>
                          <EditIcon className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(transaction)}
                          className="text-destructive focus:text-destructive"
                        >
                          <TrashIcon className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {sortedTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum lançamento encontrado.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!transactionToDelete} onOpenChange={() => setTransactionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o lançamento &quot;{transactionToDelete?.description}&quot;? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}