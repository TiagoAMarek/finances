"use client";

import { useGuestGuard } from "@/features/auth/hooks";

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * Wrapper component for public routes (login, register)
 * Redirects to /dashboard if a valid token is found
 */
export function PublicRoute({ children }: PublicRouteProps) {
  useGuestGuard();
  return <>{children}</>;
}
