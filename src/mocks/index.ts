/**
 * Mock Service Worker (MSW) initialization for development mode
 *
 * This module conditionally starts MSW based on the NEXT_PUBLIC_USE_MOCKS
 * environment variable. When enabled, it intercepts API calls and returns
 * mock data instead of making real network requests.
 */

export async function initMocks() {
  // Only enable mocks in development and when explicitly requested
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_USE_MOCKS === "true"
  ) {
    const { worker } = await import("./browser");

    // Start the worker and wait for it to be ready
    await worker.start({
      onUnhandledRequest: "bypass", // Allow unhandled requests to pass through
    });

    console.log("🔧 MSW: Mock Service Worker enabled for development");
    return worker;
  }

  return null;
}

/**
 * Type guard to check if mocks are enabled
 */
export function isMockingEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_USE_MOCKS === "true"
  );
}

