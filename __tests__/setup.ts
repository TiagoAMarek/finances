import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock system time to match visual regression tests and mock data
// All mock transactions are dated in January 2024, so we need to set
// the system time to that month for dashboard calculations to work correctly.
// Use fake timers that only mock Date so other timers (e.g. RTL) keep working.
vi.useFakeTimers({
  now: new Date("2024-01-25T12:00:00.000Z"),
  toFake: ["Date"],
});

// Mock next/navigation
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

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: { src: string; alt: string; [key: string]: unknown }) => {
    const { src, alt, ...rest } = props;
    // Return a simple object representation for tests
    return {
      type: "img",
      props: { src, alt, ...rest },
    };
  },
}));

// Note: user-event should NOT be mocked - it's our testing utility!

// Global test setup
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Needed by Radix UI in jsdom
(global.HTMLElement.prototype as unknown as { hasPointerCapture: () => boolean }).hasPointerCapture = function () {
  return false;
};
// scrollIntoView is not implemented in jsdom
if (!(global.HTMLElement.prototype as unknown as { scrollIntoView?: () => void }).scrollIntoView) {
  (global.HTMLElement.prototype as unknown as { scrollIntoView: () => void }).scrollIntoView = vi.fn();
}

// Mock chart.js canvas context
(global.HTMLCanvasElement.prototype as unknown as { getContext: () => void }).getContext = vi.fn();

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

// Mock window.matchMedia for useIsMobile hook
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Recharts/jsdom: ensure non-zero layout sizes to avoid 0x0 warnings
(() => {
  const original = global.HTMLElement.prototype.getBoundingClientRect;
  const fakeRect: DOMRect = {
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 800,
    bottom: 400,
    width: 800,
    height: 400,
    toJSON: () => ({}),
  } as unknown as DOMRect;

  // Patch immediately for test runtime
  (global.HTMLElement.prototype as unknown as { getBoundingClientRect: () => DOMRect }).getBoundingClientRect = function () {
    const el = this as HTMLElement;
    const className = (el.className || "").toString();
    const isRechartsContainer = className.includes("recharts-responsive-container");
    const isChartTestId = (el.getAttribute && el.getAttribute("data-testid")) === "chart-container";
    if (isRechartsContainer || isChartTestId) {
      return fakeRect;
    }
    return original.call(this);
  };
})();
