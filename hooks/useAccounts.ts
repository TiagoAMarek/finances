import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/utils/api';
import { BankAccount } from '@/types/api';
import { BankAccountCreateData, BankAccountUpdateData } from '@/app/api/lib/validation';


// Fetch Accounts
export const useAccounts = () => {
  return useQuery<BankAccount[]>({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await fetchWithAuth('/api/accounts');
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
  return useMutation<BankAccount, Error, Omit<BankAccount, 'id' | 'ownerId'>>({
    mutationFn: async (newAccount) => {
      const response = await fetchWithAuth('/api/accounts', {
        method: 'POST',
        body: JSON.stringify(newAccount),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao criar conta.');
      }
      const data = await response.json();
      return data.account; // Extract account from response
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
      const response = await fetchWithAuth(`/api/accounts/${updatedAccount.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedAccount),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao atualizar conta.');
      }
      const data = await response.json();
      return data.account; // Extract account from response
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
      const response = await fetchWithAuth(`/api/accounts/${accountId}`, {
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