import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchWithAuth } from "@/utils/api";

/**
 * Hook for deleting a category
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, number>({
    mutationFn: async (categoryId: number) => {
      const response = await fetchWithAuth(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao excluir categoria.");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      // Also invalidate transactions since they might reference deleted category
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};