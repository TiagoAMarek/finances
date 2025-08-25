import { vi, beforeEach, afterEach } from "vitest";
import 'vitest-browser-react';

// Browser-specific test setup for Playwright/Vitest browser mode

// Note: Unlike jsdom setup, we don't need to mock DOM APIs since we're running in a real browser
// We also don't need to mock ResizeObserver, IntersectionObserver, etc. as they exist in the browser

// Mock next/navigation for browser tests
// This is similar to the jsdom setup but may behave differently in browser context
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/image for browser tests
vi.mock("next/image", () => ({
  default: (props: { src: string; alt: string; [key: string]: unknown }) => {
    const { src, alt, ...rest } = props;
    return {
      type: "img",
      props: { src, alt, ...rest },
    };
  },
}));

// Mock sonner toast for browser tests - Fix import conflicts
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
  Toaster: () => null
}));

// Mock next-themes to prevent hydration issues
vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
    resolvedTheme: "light"
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children
}));

// Mock fetch for browser tests (use window.fetch instead of global.fetch)
if (typeof window !== 'undefined') {
  window.fetch = vi.fn();
}

// Browser-specific configurations
// Set up any browser-specific global configurations here

// Example: Mock API calls if needed for browser tests
// This could be different from MSW setup if you want to test with real network requests
// in some cases and mocked in others

// Browser test utilities
// Add any browser-specific test utilities here

// Global test cleanup for browser tests
beforeEach(() => {
  // Clear any browser-specific state before each test
  // This might include clearing localStorage, sessionStorage, etc.
  if (typeof window !== 'undefined') {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }
});

afterEach(() => {
  // Clean up after each browser test
  // This is important for browser tests to avoid state leakage
  vi.clearAllMocks();
});