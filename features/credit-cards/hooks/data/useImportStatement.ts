import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/utils/api";
import { StatementImportInput, StatementImportResult } from "@/lib/schemas/credit-card-statements";

/**
 * Hook for importing a credit card statement
 */
export const useImportStatement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      statementId,
      data,
    }: {
      statementId: number;
      data: StatementImportInput;
    }) => {
      const response = await fetchWithAuth(
        `/api/credit_cards/statements/${statementId}/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao importar fatura.");
      }

      return response.json() as Promise<StatementImportResult>;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["statements"] });
      queryClient.invalidateQueries({ queryKey: ["statement", variables.statementId] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["creditCards"] });
    },
  });
};
