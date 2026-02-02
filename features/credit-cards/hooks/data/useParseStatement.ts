import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/utils/api";

/**
 * Hook for parsing a credit card statement
 */
export const useParseStatement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (statementId: number) => {
      const response = await fetchWithAuth(
        `/api/credit_cards/statements/${statementId}/parse`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao processar fatura.");
      }

      return response.json();
    },
    onSuccess: (_, statementId) => {
      queryClient.invalidateQueries({ queryKey: ["statements"] });
      queryClient.invalidateQueries({ queryKey: ["statement", statementId] });
      queryClient.invalidateQueries({ queryKey: ["statement-line-items", statementId] });
    },
  });
};
