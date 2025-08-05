"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import { Button } from '@/components/ui/button';
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
  const error = transactionsError || accountsError || creditCardsError; if (isLoading) {
    return <div className="flex items-center justify-center py-8">Carregando dados...</div>;
  }

  if (isError) {
    return <div className="flex items-center justify-center py-8 text-red-500">Erro: {error?.message}</div>;
  }


  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Minhas Transações</h1>

      {error && <p className="mb-4 text-red-500">{error.message}</p>}

      <div className="mb-8 rounded-md bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">
          {editingTransaction ? 'Editar Transação' : 'Adicionar Nova Transação'}
        </h2>
        <form onSubmit={editingTransaction ? handleUpdateTransaction : handleCreateTransaction}>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-600">
              Descrição
            </label>
            <input
              type="text"
              id="description"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-600">
              Valor (R$)
            </label>
            <input
              type="number"
              id="amount"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              step="0.01"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="type" className="block text-sm font-medium text-gray-600">
              Tipo
            </label>
            <select
              id="type"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring"
              value={type}
              onChange={(e) => setType(e.target.value as 'income' | 'expense')}
            >
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-600">
              Data
            </label>
            <input
              type="date"
              id="date"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-600">
              Categoria
            </label>
            <input
              type="text"
              id="category"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="account" className="block text-sm font-medium text-gray-600">
              Conta Bancária (Opcional)
            </label>
            <select
              id="account"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring"
              value={selectedAccount || ''}
              onChange={(e) => setSelectedAccount(e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">Nenhuma</option>
              {accounts && accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="creditCard" className="block text-sm font-medium text-gray-600">
              Cartão de Crédito (Opcional)
            </label>
            <select
              id="creditCard"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring"
              value={selectedCreditCard || ''}
              onChange={(e) => setSelectedCreditCard(e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">Nenhum</option>
              {creditCards && creditCards.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-4">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {editingTransaction ? 'Salvar Alterações' : 'Adicionar Transação'}
            </Button>
            {editingTransaction && (
              <Button
                type="button"
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
                className="bg-gray-400 hover:bg-gray-500"
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="rounded-md bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">Transações Existentes</h2>
        {transactions && transactions.length === 0 ? (
          <p className="text-gray-500">Nenhuma transação cadastrada ainda.</p>
        ) : (
          <ul className="space-y-4">
            {transactions?.map((transaction) => (
              <li key={transaction.id} className="flex items-center justify-between rounded-md border border-gray-200 p-4">
                <div>
                  <p className="text-lg font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-600">
                    Valor: R$ {transaction.amount.toFixed(2)} ({transaction.type === 'income' ? 'Receita' : 'Despesa'})
                  </p>
                  <p className="text-sm text-gray-600">Data: {transaction.date}</p>
                  <p className="text-sm text-gray-600">Categoria: {transaction.category}</p>
                  {transaction.account_id && (
                    <p className="text-sm text-gray-600">
                      Conta: {accounts?.find(acc => acc.id === transaction.account_id)?.name || 'N/A'}
                    </p>
                  )}
                  {transaction.credit_card_id && creditCards && (
                    <p className="text-sm text-gray-600">
                      Cartão: {creditCards.find(card => card.id === transaction.credit_card_id)?.name || 'N/A'}
                    </p>
                  )}
                </div>
                <div className="space-x-2">
                  <Button
                    onClick={() => handleEditClick(transaction)}
                    className="bg-yellow-500 hover:bg-yellow-600"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDeleteTransaction(transaction.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Excluir
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
