import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProtectedRoute, PublicRoute } from "@/features/auth/components";

// Mock the hooks
vi.mock("@/features/auth/hooks", () => ({
  useAuthGuard: vi.fn(),
  useGuestGuard: vi.fn(),
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render children", () => {
    render(
      <ProtectedRoute>
        <div data-testid="child-content">Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("should call useAuthGuard hook", async () => {
    const { useAuthGuard } = await import("@/features/auth/hooks");

    render(
      <ProtectedRoute>
        <div>Content</div>
      </ProtectedRoute>
    );

    expect(useAuthGuard).toHaveBeenCalledTimes(1);
  });

  it("should render multiple children", () => {
    render(
      <ProtectedRoute>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
  });
});

describe("PublicRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render children", () => {
    render(
      <PublicRoute>
        <div data-testid="child-content">Public Content</div>
      </PublicRoute>
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByText("Public Content")).toBeInTheDocument();
  });

  it("should call useGuestGuard hook", async () => {
    const { useGuestGuard } = await import("@/features/auth/hooks");

    render(
      <PublicRoute>
        <div>Content</div>
      </PublicRoute>
    );

    expect(useGuestGuard).toHaveBeenCalledTimes(1);
  });

  it("should render multiple children", () => {
    render(
      <PublicRoute>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </PublicRoute>
    );

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
  });
});
