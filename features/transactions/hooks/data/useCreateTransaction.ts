import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Transaction, TransactionCreateInput } from "@/lib/schemas";
import { fetchWithAuth } from "@/utils/api";

/**
 * Hook for creating a new transaction
 */
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation<Transaction, Error, TransactionCreateInput>({
    mutationFn: async (newTransaction) => {
      const response = await fetchWithAuth("/api/transactions", {
        method: "POST",
        body: JSON.stringify(newTransaction),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao criar transação.");
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
