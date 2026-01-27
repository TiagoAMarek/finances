import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define allowed origins in one place for consistency
const getAllowedOrigins = () => {
  return [
    "http://localhost:3000",
    process.env.FRONTEND_URL,
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter((origin): origin is string => Boolean(origin));
};

export function middleware(request: NextRequest) {
  const allowedOrigins = getAllowedOrigins();
  const origin = request.headers.get("origin") || "";
  const isOriginAllowed = allowedOrigins.includes(origin);

  // Handle CORS preflight requests for API routes
  if (
    request.method === "OPTIONS" &&
    request.nextUrl.pathname.startsWith("/api/")
  ) {
    return new Response(null, {
      status: 200,
      headers: {
        // Security fix: Only allow origin if it's in allowedOrigins
        "Access-Control-Allow-Origin": isOriginAllowed ? origin : allowedOrigins[0] || "http://localhost:3000",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const response = NextResponse.next();

  // Add CORS headers to all API responses
  if (request.nextUrl.pathname.startsWith("/api/")) {
    if (isOriginAllowed) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }

    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With",
    );
    
    // Security headers
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
    response.headers.set(
      "Referrer-Policy",
      "strict-origin-when-cross-origin"
    );
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
