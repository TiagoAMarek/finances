import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CategoryUpdateInput, Category } from "@/lib/schemas";
import { fetchWithAuth } from "@/utils/api";

/**
 * Hook for updating a category
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string; category: Category },
    Error,
    { id: number; data: CategoryUpdateInput }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await fetchWithAuth(`/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao atualizar categoria.");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};