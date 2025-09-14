import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchWithAuth } from "@/utils/api";

/**
 * Hook for deleting a credit card
 */
export const useDeleteCreditCard = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (cardId) => {
      const response = await fetchWithAuth(`/api/credit_cards/${cardId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Erro ao excluir cartão de crédito.",
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creditCards"] });
    },
  });
};
