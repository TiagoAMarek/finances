import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/utils/api";
import { CategoryCreateInput, Category } from "@/lib/schemas";

/**
 * Hook for creating a new category
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string; category: Category },
    Error,
    CategoryCreateInput
  >({
    mutationFn: async (categoryData: CategoryCreateInput) => {
      const response = await fetchWithAuth("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao criar categoria.");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};