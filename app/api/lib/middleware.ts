import { NextRequest, NextResponse } from "next/server";

export function corsMiddleware(request: NextRequest, response: NextResponse) {
  // Configure CORS headers
  const allowedOrigins = [
    "http://localhost:3000",
    "https://your-domain.vercel.app", // Replace with your actual domain
    process.env.FRONTEND_URL || "http://localhost:3000",
  ];

  const origin = request.headers.get("origin") || "";

  if (allowedOrigins.includes(origin)) {
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

  return response;
}

export function handleOptionsRequest() {
  // Use consistent CORS policy with corsMiddleware (no wildcard for security)
  // In production, configure allowed origins via environment variables
  const allowedOrigins = [
    "http://localhost:3000",
    "https://your-domain.vercel.app", // Replace with your actual domain
    process.env.FRONTEND_URL || "http://localhost:3000",
  ];

  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigins[0], // Default to localhost, or check request origin
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Max-Age": "86400",
    },
  });
}
