import { useQuery } from "@tanstack/react-query";

import { CreditCard } from "@/lib/schemas";
import { fetchWithAuth } from "@/utils/api";

/**
 * Hook for fetching all credit cards
 */
export const useGetCreditCards = () => {
  return useQuery<CreditCard[]>({
    queryKey: ["creditCards"],
    queryFn: async () => {
      const response = await fetchWithAuth("/api/credit_cards");
      if (!response.ok) {
        throw new Error("Erro ao carregar cartões de crédito.");
      }
      return response.json();
    },
  });
};
