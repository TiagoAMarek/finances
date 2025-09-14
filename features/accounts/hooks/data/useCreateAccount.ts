import { useMutation, useQueryClient } from "@tanstack/react-query";

import { BankAccount, BankAccountCreateInput } from "@/lib/schemas";
import { fetchWithAuth } from "@/utils/api";

/**
 * Hook for creating a new bank account
 */
export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation<BankAccount, Error, BankAccountCreateInput>({
    mutationFn: async (newAccount) => {
      const response = await fetchWithAuth("/api/accounts", {
        method: "POST",
        body: JSON.stringify(newAccount),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao criar conta.");
      }
      const data = await response.json();
      return data.account; // Extract account from response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};
