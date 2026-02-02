import { useQuery } from "@tanstack/react-query";

import { fetchWithAuth } from "@/utils/api";
import { GetStatementDetailsResponse } from "@/lib/schemas/credit-card-statements";

/**
 * Hook for fetching a single statement with details
 */
export const useGetStatementDetails = (statementId: number | null) => {
  return useQuery<GetStatementDetailsResponse>({
    queryKey: ["statement", statementId],
    queryFn: async () => {
      if (!statementId) {
        throw new Error("ID da fatura é obrigatório");
      }

      const response = await fetchWithAuth(
        `/api/credit_cards/statements/${statementId}`
      );
      
      if (!response.ok) {
        throw new Error("Erro ao carregar detalhes da fatura.");
      }
      
      return response.json();
    },
    enabled: !!statementId,
  });
};
