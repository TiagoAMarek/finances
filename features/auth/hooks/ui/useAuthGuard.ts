import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Hook to protect routes that require authentication
 * Redirects to /login if no access token is found
 */
export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);
}

/**
 * Hook to redirect authenticated users away from public routes
 * Redirects to /dashboard if an access token is found
 */
export function useGuestGuard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);
}
