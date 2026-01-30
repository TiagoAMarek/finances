import { useMutation } from "@tanstack/react-query";
import type { z } from "zod";

import { ChangePasswordSchema } from "@/lib/schemas/users";
import { fetchWithAuth } from "@/utils/api";

type ChangePasswordData = z.infer<typeof ChangePasswordSchema>;

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      const response = await fetchWithAuth("/api/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Erro ao alterar senha");
      }

      return response.json();
    },
  });
}
