import { useQuery } from "@tanstack/react-query";

import { fetchWithAuth } from "@/utils/api";
import { GetLineItemsResponse } from "@/lib/schemas/credit-card-statements";

/**
 * Hook for fetching statement line items
 */
export const useGetStatementLineItems = (statementId: number | null) => {
  return useQuery<GetLineItemsResponse>({
    queryKey: ["statement-line-items", statementId],
    queryFn: async () => {
      if (!statementId) {
        throw new Error("ID da fatura é obrigatório");
      }

      const response = await fetchWithAuth(
        `/api/credit_cards/statements/${statementId}/line-items`
      );
      
      if (!response.ok) {
        throw new Error("Erro ao carregar itens da fatura.");
      }
      
      return response.json();
    },
    enabled: !!statementId,
  });
};
