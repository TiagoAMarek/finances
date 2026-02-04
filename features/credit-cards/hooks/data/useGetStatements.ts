import { useQuery } from "@tanstack/react-query";

import { fetchWithAuth } from "@/utils/api";
import { GetStatementsResponse } from "@/lib/schemas/credit-card-statements";

export interface UseGetStatementsParams {
  creditCardId?: number;
  status?: "pending" | "reviewed" | "imported" | "cancelled";
  page?: number;
  limit?: number;
}

/**
 * Hook for fetching credit card statements
 */
export const useGetStatements = (params?: UseGetStatementsParams) => {
  const queryParams = new URLSearchParams();
  
  if (params?.creditCardId) {
    queryParams.append("creditCardId", params.creditCardId.toString());
  }
  if (params?.status) {
    queryParams.append("status", params.status);
  }
  if (params?.page) {
    queryParams.append("page", params.page.toString());
  }
  if (params?.limit) {
    queryParams.append("limit", params.limit.toString());
  }

  const queryString = queryParams.toString();
  const url = `/api/credit_cards/statements${queryString ? `?${queryString}` : ""}`;

  return useQuery<GetStatementsResponse>({
    queryKey: ["statements", params],
    queryFn: async () => {
      const response = await fetchWithAuth(url);
      if (!response.ok) {
        throw new Error("Erro ao carregar faturas.");
      }
      return response.json();
    },
  });
};
