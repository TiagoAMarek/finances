import { useQuery } from "@tanstack/react-query";

import { fetchWithAuth } from "@/utils/api";

interface UserProfile {
  id: number;
  name: string;
  email: string;
}

export function useGetUserProfile() {
  return useQuery<UserProfile>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const response = await fetchWithAuth("/api/users/profile");
      return response.json();
    },
  });
}
