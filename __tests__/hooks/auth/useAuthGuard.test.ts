import { renderHook, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthGuard, useGuestGuard } from "@/features/auth/hooks";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("useAuthGuard", () => {
  const mockPush = vi.fn();
  const mockRouter = { push: mockPush };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    (useRouter as any).mockReturnValue(mockRouter);
  });

  it("should redirect to /login when no token is present", async () => {
    renderHook(() => useAuthGuard());

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("should not redirect when token is present", async () => {
    localStorage.setItem("access_token", "valid-token");

    renderHook(() => useAuthGuard());

    await waitFor(() => {
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it("should redirect immediately on component mount without token", () => {
    renderHook(() => useAuthGuard());

    // Should be called synchronously in useEffect
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});

describe("useGuestGuard", () => {
  const mockPush = vi.fn();
  const mockRouter = { push: mockPush };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    (useRouter as any).mockReturnValue(mockRouter);
  });

  it("should redirect to /dashboard when token is present", async () => {
    localStorage.setItem("access_token", "valid-token");

    renderHook(() => useGuestGuard());

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("should not redirect when no token is present", async () => {
    renderHook(() => useGuestGuard());

    await waitFor(() => {
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it("should redirect immediately on component mount with token", () => {
    localStorage.setItem("access_token", "valid-token");

    renderHook(() => useGuestGuard());

    // Should be called synchronously in useEffect
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });
});
