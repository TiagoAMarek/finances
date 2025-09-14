import { useMutation } from "@tanstack/react-query";

import { RegisterResponse, RegisterApiInput } from "@/lib/schemas";
import { fetchWithAuth } from "@/utils/api";

/**
 * Hook for user registration
 */
export const useRegister = () => {
  return useMutation<RegisterResponse, Error, RegisterApiInput>({
    mutationFn: async (userData) => {
      const response = await fetchWithAuth("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao registrar usuário.");
      }
      return response.json();
    },
  });
};
