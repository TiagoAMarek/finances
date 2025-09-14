import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CreditCard } from "@/lib/schemas";
import { fetchWithAuth } from "@/utils/api";

/**
 * Hook for updating a credit card
 */
export const useUpdateCreditCard = () => {
  const queryClient = useQueryClient();
  return useMutation<CreditCard, Error, CreditCard>({
    mutationFn: async (updatedCard) => {
      const response = await fetchWithAuth(
        `/api/credit_cards/${updatedCard.id}`,
        {
          method: "PUT",
          body: JSON.stringify(updatedCard),
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Erro ao atualizar cartão de crédito.",
        );
      }
      const data = await response.json();
      return data.card; // Extract card from response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creditCards"] });
    },
  });
};
