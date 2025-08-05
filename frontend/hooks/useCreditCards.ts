import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/utils/api';

interface CreditCard {
  id: number;
  name: string;
  limit: number;
  current_bill: number;
  owner_id: number;
}

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

// Create Credit Card
export const useCreateCreditCard = () => {
  const queryClient = useQueryClient();
  return useMutation<CreditCard, Error, Omit<CreditCard, 'id' | 'owner_id'>>({
    mutationFn: async (newCard) => {
      const response = await fetchWithAuth('http://localhost:8000/credit_cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCard),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao criar cartão de crédito.');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditCards'] });
    },
  });
};

// Update Credit Card
export const useUpdateCreditCard = () => {
  const queryClient = useQueryClient();
  return useMutation<CreditCard, Error, CreditCard>({
    mutationFn: async (updatedCard) => {
      const response = await fetchWithAuth(`http://localhost:8000/credit_cards/${updatedCard.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCard),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao atualizar cartão de crédito.');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditCards'] });
    },
  });
};

// Delete Credit Card
export const useDeleteCreditCard = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (cardId) => {
      const response = await fetchWithAuth(`http://localhost:8000/credit_cards/${cardId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao excluir cartão de crédito.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditCards'] });
    },
  });
};