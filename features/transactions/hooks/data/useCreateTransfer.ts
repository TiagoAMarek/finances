import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/utils/api";
import { Transaction, TransferCreateInput } from "@/lib/schemas";

/**
 * Hook for creating transfers between accounts
 */
export const useCreateTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation<Transaction, Error, TransferCreateInput>({
    mutationFn: async (transferData) => {
      const response = await fetchWithAuth("/api/transfers", {
        method: "POST",
        body: JSON.stringify(transferData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao criar transferência.");
      }
      const data = await response.json();
      return data.transaction; // Extract transaction from response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] }); // Invalidate accounts to reflect balance changes
    },
  });
};
