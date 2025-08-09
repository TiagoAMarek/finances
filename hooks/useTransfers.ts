import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/utils/api';
import { Transaction } from '@/types/api';

interface TransferRequest {
  description: string;
  amount: number;
  date: string; // ISO format string
  fromAccountId: number;
  toAccountId: number;
}

// Create Transfer
export const useCreateTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation<Transaction, Error, TransferRequest>({
    mutationFn: async (transferData) => {
      const response = await fetchWithAuth('/api/transfers', {
        method: 'POST',
        body: JSON.stringify(transferData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao criar transferência.');
      }
      const data = await response.json();
      return data.transaction; // Extract transaction from response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] }); // Invalidate accounts to reflect balance changes
    },
  });
};