"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
      alert('Transação criada com sucesso!');
      setDescription('');
      setAmount(0);
      setType('expense');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('');
      setSelectedAccount(null);
      setSelectedCreditCard(null);
    } catch (err: unknown) {
      alert((err as Error).message || 'Erro ao criar transação.');
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
      alert('Transação atualizada com sucesso!');
      setEditingTransaction(null);
      setDescription('');
      setAmount(0);
      setType('expense');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('');
      setSelectedAccount(null);
      setSelectedCreditCard(null);
    } catch (err: unknown) {
      alert((err as Error).message || 'Erro ao atualizar transação.');
    }
  };

  const handleDeleteTransaction = async (transactionId: number) => {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) {
      return;
    }
    try {
      await deleteTransactionMutation.mutateAsync(transactionId);
      alert('Transação excluída com sucesso!');
    } catch (err: unknown) {
      alert((err as Error).message || 'Erro ao excluir transação.');
    }
  };

  const isLoading = isLoadingTransactions || isLoadingAccounts || isLoadingCreditCards;
  const isError = isErrorTransactions || isErrorAccounts || isErrorCreditCards;
  const error = transactionsError || accountsError || creditCardsError;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando dados...</div>
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
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Minhas Transações</h1>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {editingTransaction ? 'Editar Transação' : 'Adicionar Nova Transação'}
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
                value={selectedAccount?.toString() || ''} 
                onValueChange={(value) => setSelectedAccount(value ? parseInt(value) : null)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma conta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhuma</SelectItem>
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
                value={selectedCreditCard?.toString() || ''} 
                onValueChange={(value) => setSelectedCreditCard(value ? parseInt(value) : null)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um cartão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {creditCards && creditCards.map((card) => (
                    <SelectItem key={card.id} value={card.id.toString()}>
                      {card.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-4">
              <Button type="submit">
                {editingTransaction ? 'Salvar Alterações' : 'Adicionar Transação'}
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
          <CardTitle>Transações Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions && transactions.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma transação cadastrada ainda.</p>
          ) : (
            <div className="space-y-4">
              {transactions?.map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="space-y-1">
                      <p className="text-lg font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Valor: R$ {transaction.amount.toFixed(2)} ({transaction.type === 'income' ? 'Receita' : 'Despesa'})
                      </p>
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
                        onClick={() => handleEditClick(transaction)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                      >
                        Excluir
                      </Button>
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
