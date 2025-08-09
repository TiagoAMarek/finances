
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/utils/api';
import { Transaction, TransactionCreateInput } from '@/lib/schemas';


// Fetch Transactions
export const useTransactions = () => {
  return useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await fetchWithAuth('/api/transactions');
      if (!response.ok) {
        throw new Error('Erro ao carregar transações.');
      }
      return response.json();
    },
  });
};


// Create Transaction
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation<Transaction, Error, TransactionCreateInput>({
    mutationFn: async (newTransaction) => {
      const response = await fetchWithAuth('/api/transactions', {
        method: 'POST',
        body: JSON.stringify(newTransaction),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao criar transação.');
      }
      const data = await response.json();
      return data.transaction; // Extract transaction from response
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
      const response = await fetchWithAuth(`/api/transactions/${updatedTransaction.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedTransaction),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao atualizar transação.');
      }
      const data = await response.json();
      return data.transaction; // Extract transaction from response
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
      const response = await fetchWithAuth(`/api/transactions/${transactionId}`, {
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
