"use client";

import { useAuthGuard } from "@/features/auth/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Wrapper component for protected routes that require authentication
 * Redirects to /login if no valid token is found
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  useAuthGuard();
  return <>{children}</>;
}
