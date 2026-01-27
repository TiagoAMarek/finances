import { render } from "@testing-library/react";
import { usePathname, useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppLayout } from "@/features/shared/components";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

// Mock auth hooks
vi.mock("@/features/auth/hooks", () => ({
  useAuthGuard: vi.fn(),
  useGuestGuard: vi.fn(),
}));

// Mock AppSidebar to avoid additional dependencies
vi.mock("@/features/shared/components", async () => {
  const actual = await vi.importActual("@/features/shared/components");
  return {
    ...actual,
    AppSidebar: () => <div data-testid="sidebar">Sidebar</div>,
  };
});

describe("AppLayout Authentication", () => {
  const mockPush = vi.fn();
  const mockRouter = { push: mockPush };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    (useRouter as any).mockReturnValue(mockRouter);
  });

  it("should call useGuestGuard for /login route", async () => {
    (usePathname as any).mockReturnValue("/login");
    const { useGuestGuard } = await import("@/features/auth/hooks");

    render(
      <AppLayout>
        <div>Login Content</div>
      </AppLayout>
    );

    expect(useGuestGuard).toHaveBeenCalled();
  });

  it("should call useGuestGuard for /register route", async () => {
    (usePathname as any).mockReturnValue("/register");
    const { useGuestGuard } = await import("@/features/auth/hooks");

    render(
      <AppLayout>
        <div>Register Content</div>
      </AppLayout>
    );

    expect(useGuestGuard).toHaveBeenCalled();
  });

  it("should call useAuthGuard for /dashboard route", async () => {
    (usePathname as any).mockReturnValue("/dashboard");
    const { useAuthGuard } = await import("@/features/auth/hooks");

    render(
      <AppLayout>
        <div>Dashboard Content</div>
      </AppLayout>
    );

    expect(useAuthGuard).toHaveBeenCalled();
  });

  it("should call useAuthGuard for /accounts route", async () => {
    (usePathname as any).mockReturnValue("/accounts");
    const { useAuthGuard } = await import("@/features/auth/hooks");

    render(
      <AppLayout>
        <div>Accounts Content</div>
      </AppLayout>
    );

    expect(useAuthGuard).toHaveBeenCalled();
  });

  it("should not call guards for root path", async () => {
    (usePathname as any).mockReturnValue("/");
    const { useAuthGuard, useGuestGuard } = await import("@/features/auth/hooks");

    render(
      <AppLayout>
        <div>Root Content</div>
      </AppLayout>
    );

    expect(useAuthGuard).not.toHaveBeenCalled();
    expect(useGuestGuard).not.toHaveBeenCalled();
  });
});
