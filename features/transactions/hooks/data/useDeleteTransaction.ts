import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchWithAuth } from "@/utils/api";

/**
 * Hook for deleting a transaction
 */
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (transactionId) => {
      const response = await fetchWithAuth(
        `/api/transactions/${transactionId}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao excluir transação.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] }); // Invalidate accounts to reflect balance changes
      queryClient.invalidateQueries({ queryKey: ["creditCards"] }); // Invalidate credit cards to reflect balance changes
    },
  });
};
