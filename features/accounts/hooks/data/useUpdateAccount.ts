import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/utils/api";
import { BankAccount } from "@/lib/schemas";

/**
 * Hook for updating a bank account
 */
export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation<BankAccount, Error, BankAccount>({
    mutationFn: async (updatedAccount) => {
      const response = await fetchWithAuth(
        `/api/accounts/${updatedAccount.id}`,
        {
          method: "PUT",
          body: JSON.stringify(updatedAccount),
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao atualizar conta.");
      }
      const data = await response.json();
      return data.account; // Extract account from response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};
