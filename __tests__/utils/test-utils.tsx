import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, RenderOptions } from "@testing-library/react";
import React from "react";
import { beforeAll, afterEach, afterAll, vi } from "vitest";

import { server } from "../mocks/server";

// MSW server setup for tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

// Mock localStorage for authentication
export const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock window.location for auth redirects
const mockLocation = {
  href: "",
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
  origin: "http://localhost:3000",
  protocol: "http:",
  host: "localhost:3000",
  pathname: "/",
  search: "",
  hash: "",
};

Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
});

// Make href setter work properly
Object.defineProperty(mockLocation, "href", {
  get() {
    return this._href || "";
  },
  set(value) {
    this._href = value;
  },
  configurable: true,
});

// Mock process.env for proper API base URL in tests
Object.defineProperty(process, "env", {
  value: {
    ...process.env,
    NEXT_PUBLIC_API_URL: "http://localhost:3000",
  },
  writable: true,
});

export { mockLocation };

// Create test query client with sensible defaults
export const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Don't retry in tests
        gcTime: 0, // Disable cache time
        staleTime: 0, // Data is always stale in tests
      },
      mutations: {
        retry: false,
      },
    },
  });
};

// Test provider wrapper
interface TestProvidersProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

export const TestProviders: React.FC<TestProvidersProps> = ({
  children,
  queryClient = createTestQueryClient(),
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// Custom render function with providers
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & {
    queryClient?: QueryClient;
  },
) => {
  const { queryClient, ...renderOptions } = options || {};

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <TestProviders queryClient={queryClient}>{children}</TestProviders>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Test helpers for common operations
export const testHelpers = {
  // Set authenticated user
  setAuthenticatedUser: (token = "mock-jwt-token") => {
    localStorageMock.getItem.mockImplementation((key) =>
      key === "access_token" ? token : null,
    );
  },

  // Clear authentication
  clearAuthentication: () => {
    localStorageMock.getItem.mockReturnValue(null);
  },

  // Reset localStorage mock
  resetLocalStorage: () => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
    // Reset mockLocation href
    mockLocation.href = "";
  },

  // Wait for queries to settle
  waitForQueries: async (queryClient: QueryClient) => {
    await queryClient.getQueryCache().clear();
  },
};

// Re-export everything from testing-library
export * from "@testing-library/react";

// Custom matchers - extend this as needed
export const customMatchers = {
  toBeWithinRange: (received: number, floor: number, ceiling: number) => {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
};
