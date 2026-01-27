import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Hook to protect routes that require authentication
 * Redirects to /login if no access token is found
 * 
 * Note: Uses localStorage for token storage. This is vulnerable to XSS attacks.
 * For production applications, consider using httpOnly cookies instead.
 * 
 * Limitation: Only checks for token presence, not validity. Expired/invalid tokens
 * will still grant access until the first API call returns 401.
 */
export function useAuthGuard() {
  const router = useRouter();
  const hasChecked = useRef(false);

  useEffect(() => {
    // Only check once to prevent unnecessary redirects during hydration
    if (hasChecked.current) return;
    hasChecked.current = true;

    // Check if we're in browser context
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);
}

/**
 * Hook to redirect authenticated users away from public routes
 * Redirects to /dashboard if an access token is found
 * 
 * Note: Uses localStorage for token storage. This is vulnerable to XSS attacks.
 * For production applications, consider using httpOnly cookies instead.
 * 
 * Limitation: Only checks for token presence, not validity. Expired tokens
 * will still redirect users to dashboard until the first API call returns 401.
 */
export function useGuestGuard() {
  const router = useRouter();
  const hasChecked = useRef(false);

  useEffect(() => {
    // Only check once to prevent unnecessary redirects during hydration
    if (hasChecked.current) return;
    hasChecked.current = true;

    // Check if we're in browser context
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("access_token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);
}
