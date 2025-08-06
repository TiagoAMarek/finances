"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { PlusIcon, EditIcon, TrashIcon, Receipt, TrendingUp, TrendingDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from '@/hooks/useTransactions';
import { useAccounts } from '@/hooks/useAccounts';
import { useCreditCards } from '@/hooks/useCreditCards';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string; // ISO format string
  category: string;
  owner_id: number;
  account_id: number | null;
  credit_card_id: number | null;
}

const TransactionsPage: NextPage = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [selectedCreditCard, setSelectedCreditCard] = useState<number | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    isError: isErrorTransactions,
    error: transactionsError,
  } = useTransactions();
  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    isError: isErrorAccounts,
    error: accountsError,
  } = useAccounts();
  const {
    data: creditCards,
    isLoading: isLoadingCreditCards,
    isError: isErrorCreditCards,
    error: creditCardsError,
  } = useCreditCards();

  const createTransactionMutation = useCreateTransaction();
  const updateTransactionMutation = useUpdateTransaction();
  const deleteTransactionMutation = useDeleteTransaction();

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTransactionMutation.mutateAsync({
        description,
        amount: parseFloat(amount.toString()),
        type,
        date,
        category,
        account_id: selectedAccount,
        credit_card_id: selectedCreditCard,
      });
      toast.success('Transação criada com sucesso!');
      setDescription('');
      setAmount(0);
      setType('expense');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('');
      setSelectedAccount(null);
      setSelectedCreditCard(null);
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Erro ao criar transação.');
    }
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setDescription(transaction.description);
    setAmount(transaction.amount);
    setType(transaction.type);
    setDate(transaction.date);
    setCategory(transaction.category);
    setSelectedAccount(transaction.account_id);
    setSelectedCreditCard(transaction.credit_card_id);
  };

  const handleUpdateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransaction) return;

    try {
      await updateTransactionMutation.mutateAsync({
        ...editingTransaction,
        description,
        amount: parseFloat(amount.toString()),
        type,
        date,
        category,
        account_id: selectedAccount,
        credit_card_id: selectedCreditCard,
      });
      toast.success('Transação atualizada com sucesso!');
      setEditingTransaction(null);
      setDescription('');
      setAmount(0);
      setType('expense');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('');
      setSelectedAccount(null);
      setSelectedCreditCard(null);
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Erro ao atualizar transação.');
    }
  };

  const handleDeleteTransaction = async () => {
    if (!transactionToDelete) return;

    try {
      await deleteTransactionMutation.mutateAsync(transactionToDelete.id);
      toast.success('Transação excluída com sucesso!');
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Erro ao excluir transação.');
    }
  };

  const openDeleteDialog = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setDeleteDialogOpen(true);
  };

  const isLoading = isLoadingTransactions || isLoadingAccounts || isLoadingCreditCards;
  const isError = isErrorTransactions || isErrorAccounts || isErrorCreditCards;
  const error = transactionsError || accountsError || creditCardsError;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-32" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>Erro: {error?.message}</AlertDescription>
        </Alert>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Minhas Transações</h1>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {editingTransaction ? (
              <>
                <EditIcon className="h-5 w-5" />
                Editar Transação
              </>
            ) : (
              <>
                <PlusIcon className="h-5 w-5" />
                Adicionar Nova Transação
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={editingTransaction ? handleUpdateTransaction : handleCreateTransaction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                step="0.01"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={type} onValueChange={(value) => setType(value as 'income' | 'expense')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Despesa</SelectItem>
                  <SelectItem value="income">Receita</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account">Conta Bancária (Opcional)</Label>
              <Select
                value={selectedAccount?.toString() || 'none'}
                onValueChange={(value) => setSelectedAccount(value !== 'none' ? parseInt(value) : null)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma conta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  {accounts && accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id.toString()}>
                      {acc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="creditCard">Cartão de Crédito (Opcional)</Label>
              <Select
                value={selectedCreditCard?.toString() || 'none'}
                onValueChange={(value) => setSelectedCreditCard(value !== 'none' ? parseInt(value) : null)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um cartão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {creditCards && creditCards.map((card) => (
                    <SelectItem key={card.id} value={card.id.toString()}>
                      {card.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-4">
              <Button type="submit" className="flex items-center gap-2">
                {editingTransaction ? (
                  'Salvar Alterações'
                ) : (
                  <>
                    <PlusIcon className="h-4 w-4" />
                    Adicionar Transação
                  </>
                )}
              </Button>
              {editingTransaction && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingTransaction(null);
                    setDescription('');
                    setAmount(0);
                    setType('expense');
                    setDate(new Date().toISOString().split('T')[0]);
                    setCategory('');
                    setSelectedAccount(null);
                    setSelectedCreditCard(null);
                  }}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Transações Existentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions && transactions.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma transação encontrada</h3>
              <p className="text-muted-foreground mb-4">
                Você ainda não cadastrou nenhuma transação.
              </p>
              <Button
                onClick={() => document.getElementById('description')?.focus()}
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Criar primeira transação
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions?.map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="space-y-1">
                      <p className="text-lg font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        {transaction.type === 'income' ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        )}
                        <span>R$ {transaction.amount.toFixed(2)} ({transaction.type === 'income' ? 'Receita' : 'Despesa'})</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Data: {transaction.date}</p>
                      <p className="text-sm text-muted-foreground">Categoria: {transaction.category}</p>
                      {transaction.account_id && (
                        <p className="text-sm text-muted-foreground">
                          Conta: {accounts?.find(acc => acc.id === transaction.account_id)?.name || 'N/A'}
                        </p>
                      )}
                      {transaction.credit_card_id && creditCards && (
                        <p className="text-sm text-muted-foreground">
                          Cartão: {creditCards.find(card => card.id === transaction.credit_card_id)?.name || 'N/A'}
                        </p>
                      )}
                    </div>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(transaction)}
                        className="flex items-center gap-1"
                      >
                        <EditIcon className="h-3 w-3" />
                        Editar
                      </Button>
                      <Dialog open={deleteDialogOpen && transactionToDelete?.id === transaction.id} onOpenChange={setDeleteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteDialog(transaction)}
                            className="flex items-center gap-1"
                          >
                            <TrashIcon className="h-3 w-3" />
                            Excluir
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirmar exclusão</DialogTitle>
                            <DialogDescription>
                              Tem certeza que deseja excluir a transação &ldquo;{transaction.description}&rdquo;? Esta ação não pode ser desfeita.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                              Cancelar
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDeleteTransaction}
                              disabled={deleteTransactionMutation.isPending}
                              className="flex items-center gap-2"
                            >
                              {deleteTransactionMutation.isPending ? (
                                'Excluindo...'
                              ) : (
                                <>
                                  <TrashIcon className="h-4 w-4" />
                                  Excluir
                                </>
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
