import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/utils/api";
import { CreditCard, CreditCardCreateInput } from "@/lib/schemas";

/**
 * Hook for creating a new credit card
 */
export const useCreateCreditCard = () => {
  const queryClient = useQueryClient();
  return useMutation<CreditCard, Error, CreditCardCreateInput>({
    mutationFn: async (newCard) => {
      const response = await fetchWithAuth("/api/credit_cards", {
        method: "POST",
        body: JSON.stringify(newCard),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao criar cartão de crédito.");
      }
      const data = await response.json();
      return data.card; // Extract card from response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creditCards"] });
    },
  });
};
