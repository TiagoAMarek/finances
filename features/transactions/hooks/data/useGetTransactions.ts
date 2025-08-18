import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/utils/api";
import { Transaction } from "@/lib/schemas";

/**
 * Hook for fetching all transactions
 */
export const useGetTransactions = () => {
  return useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await fetchWithAuth("/api/transactions");
      if (!response.ok) {
        throw new Error("Erro ao carregar transações.");
      }
      return response.json();
    },
  });
};
