import { useQuery } from "@tanstack/react-query";

import { fetchWithAuth } from "@/utils/api";

export interface CategoryWithStats {
  id: number;
  name: string;
  type: "income" | "expense" | "both";
  color: string | null;
  icon: string | null;
  isDefault: boolean;
  ownerId: number;
  createdAt: string;
  transactionCount: number;
  totalAmount: string;
  lastUsed: string | null;
}

/**
 * Hook for fetching all user categories with usage statistics
 */
export const useGetCategoriesWithStats = () => {
  return useQuery<CategoryWithStats[]>({
    queryKey: ["categories", "stats"],
    queryFn: async () => {
      const response = await fetchWithAuth("/api/categories/stats");
      if (!response.ok) {
        throw new Error("Erro ao carregar estatísticas de categorias.");
      }
      return response.json();
    },
  });
};