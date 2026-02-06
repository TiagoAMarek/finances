import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/utils/api";
import { StatementUploadInput } from "@/lib/schemas/credit-card-statements";

/**
 * Hook for uploading a credit card statement PDF
 */
export const useUploadStatement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StatementUploadInput) => {
      const response = await fetchWithAuth("/api/credit_cards/statements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao fazer upload da fatura.");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statements"] });
    },
  });
};
