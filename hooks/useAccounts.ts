import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/utils/api';

interface BankAccount {
  id: number;
  name: string;
  balance: number;
  currency: string;
  owner_id: number;
}

// Fetch Accounts
export const useAccounts = () => {
  return useQuery<BankAccount[]>({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await fetchWithAuth('/accounts');
      if (!response.ok) {
        throw new Error('Erro ao carregar contas bancárias.');
      }
      return response.json();
    },
  });
};

// Create Account
export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation<BankAccount, Error, Omit<BankAccount, 'id' | 'owner_id'>>({
    mutationFn: async (newAccount) => {
      const response = await fetchWithAuth('/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAccount),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao criar conta.');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};

// Update Account
export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation<BankAccount, Error, BankAccount>({
    mutationFn: async (updatedAccount) => {
      const response = await fetchWithAuth(`/accounts/${updatedAccount.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAccount),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao atualizar conta.');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};

// Delete Account
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (accountId) => {
      const response = await fetchWithAuth(`/accounts/${accountId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao excluir conta.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};