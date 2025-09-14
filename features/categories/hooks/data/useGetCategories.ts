import { useQuery } from "@tanstack/react-query";

import { Category } from "@/lib/schemas";
import { fetchWithAuth } from "@/utils/api";

/**
 * Hook for fetching all user categories
 */
export const useGetCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetchWithAuth("/api/categories");
      if (!response.ok) {
        throw new Error("Erro ao carregar categorias.");
      }
      return response.json();
    },
  });
};