
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/utils/api';

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

interface BankAccount {
  id: number;
  name: string;
}

interface CreditCard {
  id: number;
  name: string;
}

// Fetch Transactions
export const useTransactions = () => {
  return useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await fetchWithAuth('http://localhost:8000/transactions');
      if (!response.ok) {
        throw new Error('Erro ao carregar transações.');
      }
      return response.json();
    },
  });
};

// Fetch Accounts
export const useAccounts = () => {
  return useQuery<BankAccount[]>({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await fetchWithAuth('http://localhost:8000/accounts');
      if (!response.ok) {
        throw new Error('Erro ao carregar contas bancárias.');
      }
      return response.json();
    },
  });
};

// Fetch Credit Cards
export const useCreditCards = () => {
  return useQuery<CreditCard[]>({ 
    queryKey: ['creditCards'],
    queryFn: async () => {
      const response = await fetchWithAuth('http://localhost:8000/credit_cards');
      if (!response.ok) {
        throw new Error('Erro ao carregar cartões de crédito.');
      }
      return response.json();
    },
  });
};

// Create Transaction
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation<Transaction, Error, Omit<Transaction, 'id' | 'owner_id'>>({
    mutationFn: async (newTransaction) => {
      const response = await fetchWithAuth('http://localhost:8000/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTransaction),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao criar transação.');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] }); // Invalidate accounts to reflect balance changes
      queryClient.invalidateQueries({ queryKey: ['creditCards'] }); // Invalidate credit cards to reflect balance changes
    },
  });
};

// Update Transaction
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation<Transaction, Error, Transaction>({
    mutationFn: async (updatedTransaction) => {
      const response = await fetchWithAuth(`http://localhost:8000/transactions/${updatedTransaction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTransaction),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao atualizar transação.');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] }); // Invalidate accounts to reflect balance changes
      queryClient.invalidateQueries({ queryKey: ['creditCards'] }); // Invalidate credit cards to reflect balance changes
    },
  });
};

// Delete Transaction
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (transactionId) => {
      const response = await fetchWithAuth(`http://localhost:8000/transactions/${transactionId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao excluir transação.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] }); // Invalidate accounts to reflect balance changes
      queryClient.invalidateQueries({ queryKey: ['creditCards'] }); // Invalidate credit cards to reflect balance changes
    },
  });
};
