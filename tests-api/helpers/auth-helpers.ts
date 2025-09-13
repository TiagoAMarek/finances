import { NextRequest } from "next/server";

// Simple helper functions for unit tests (no database dependencies)

// Create NextRequest for testing API routes
export const createNextRequest = (
  url: string,
  options: {
    method?: string;
    body?: Record<string, unknown> | unknown[] | string;
    token?: string;
    headers?: Record<string, string>;
  } = {},
): NextRequest => {
  const { method = "GET", body, token, headers = {} } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const requestInit = {
    method,
    headers: requestHeaders,
    ...(body &&
      method !== "GET" && {
        body: typeof body === "string" ? body : JSON.stringify(body),
      }),
  };

  return new NextRequest(url, requestInit);
};

// Alias for backward compatibility
export const createMockRequest = createNextRequest;

// Create authorization header for requests
export const createAuthHeader = (token: string): Record<string, string> => {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Create unauthorized request (no token)
export const createUnauthorizedHeaders = (): Record<string, string> => {
  return {
    "Content-Type": "application/json",
  };
};
