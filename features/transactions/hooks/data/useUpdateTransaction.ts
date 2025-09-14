import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Transaction } from "@/lib/schemas";
import { fetchWithAuth } from "@/utils/api";

/**
 * Hook for updating a transaction
 */
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation<Transaction, Error, Transaction>({
    mutationFn: async (updatedTransaction) => {
      const response = await fetchWithAuth(
        `/api/transactions/${updatedTransaction.id}`,
        {
          method: "PUT",
          body: JSON.stringify(updatedTransaction),
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao atualizar transação.");
      }
      const data = await response.json();
      return data.transaction; // Extract transaction from response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] }); // Invalidate accounts to reflect balance changes
      queryClient.invalidateQueries({ queryKey: ["creditCards"] }); // Invalidate credit cards to reflect balance changes
    },
  });
};
