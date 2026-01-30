import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { z } from "zod";

import { UpdateProfileSchema } from "@/lib/schemas/users";
import { fetchWithAuth } from "@/utils/api";

type UpdateProfileData = z.infer<typeof UpdateProfileSchema>;

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const response = await fetchWithAuth("/api/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Erro ao atualizar perfil");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
}
