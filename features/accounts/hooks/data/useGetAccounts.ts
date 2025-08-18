import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/utils/api";
import { BankAccount } from "@/lib/schemas";

/**
 * Hook for fetching all bank accounts
 */
export const useGetAccounts = () => {
  return useQuery<BankAccount[]>({
    queryKey: ["accounts"],
    queryFn: async () => {
      const response = await fetchWithAuth("/api/accounts");
      if (!response.ok) {
        throw new Error("Erro ao carregar contas bancárias.");
      }
      return response.json();
    },
  });
};
