import { useMutation } from "@tanstack/react-query";
import { fetchWithAuth } from "@/utils/api";
import { LoginResponse, LoginInput } from "@/lib/schemas";

/**
 * Hook for user login
 */
export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: async (credentials) => {
      const response = await fetchWithAuth("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao fazer login.");
      }
      return response.json();
    },
  });
};
