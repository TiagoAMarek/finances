import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchWithAuth } from "@/utils/api";

/**
 * Hook for deleting a bank account
 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (accountId) => {
      const response = await fetchWithAuth(`/api/accounts/${accountId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao excluir conta.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};
